import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  getCart,
  addOneToCart,
  removeOneFromCart,
  deleteFromCart,
} from "./api";

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(() => {
    return JSON.parse(localStorage.getItem("cart") || "[]");
  });
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");

  const getCleanProductId = (item) => {
    if (!item) return null;
    if (typeof item.product === "object" && item.product?._id) {
      return item.product._id;
    }
    if (typeof item.product === "string") {
      return item.product;
    }
    return item.productId || item.id || item._id;
  };

  const parseServerCart = (res) => {
    return (
      res?.data?.cart?.items ||
      res?.data?.items ||
      res?.cart?.items ||
      res?.items ||
      (Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [])
    );
  };

  const fetchLiveCart = async () => {
    try {
      setErrorMessage("");
      const res = await getCart();
      const serverItems = parseServerCart(res);

      if (serverItems && serverItems.length > 0) {
        setCart(serverItems);
        localStorage.setItem("cart", JSON.stringify(serverItems));
      } else {
        const local = JSON.parse(localStorage.getItem("cart") || "[]");
        setCart(local);
      }
    } catch (err) {
      console.error("Cart fetch error:", err.message);
      const local = JSON.parse(localStorage.getItem("cart") || "[]");
      setCart(local);

      if (err.response?.status === 401 || err.response?.status === 403) {
        setErrorMessage(
          "Please log in as a customer to sync your cart with the server.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveCart();
  }, []);

  const handleClearCart = async () => {
    try {
    
      setCart([]);
      localStorage.removeItem("cart");

      for (const item of cart) {
        const pId = getCleanProductId(item);
        if (pId) {
          await deleteFromCart(pId).catch(() => {});
        }
      }
    } catch (err) {
      console.error("Failed to clear cart:", err.message);
    }
  };

  const handleAddQuantity = async (productId) => {
    try {
      setUpdatingId(productId);
      setCart((prev) => {
        const updated = prev.map((item) => {
          const id = getCleanProductId(item);
          return id === productId
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item;
        });
        localStorage.setItem("cart", JSON.stringify(updated));
        return updated;
      });

      await addOneToCart(productId);
      await fetchLiveCart();
    } catch (err) {
      console.error("Failed to add one:", err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemoveQuantity = async (productId) => {
    try {
      setUpdatingId(productId);
      setCart((prev) => {
        const updated = prev
          .map((item) => {
            const id = getCleanProductId(item);
            if (id === productId) {
              const newQty = (item.quantity || 1) - 1;
              return newQty > 0 ? { ...item, quantity: newQty } : null;
            }
            return item;
          })
          .filter(Boolean);
        localStorage.setItem("cart", JSON.stringify(updated));
        return updated;
      });

      await removeOneFromCart(productId);
      await fetchLiveCart();
    } catch (err) {
      console.error("Failed to remove one:", err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      setUpdatingId(productId);
      setCart((prev) => {
        const updated = prev.filter((item) => {
          const id = getCleanProductId(item);
          return id !== productId;
        });
        localStorage.setItem("cart", JSON.stringify(updated));
        return updated;
      });

      await deleteFromCart(productId);
      await fetchLiveCart();
    } catch (err) {
      console.error("Failed to remove item:", err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const applyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === "GROUP29") {
      setDiscount(1000);
      setPromoError("");
    } else {
      setPromoError('Invalid coupon code. Try "GROUP29"');
      setDiscount(0);
    }
  };

  const subtotal = cart.reduce((sum, item) => {
    const product = item.product || item;
    const price = Number(product.price || item.price || 0);
    const quantity = Number(item.quantity || 1);
    return sum + price * quantity;
  }, 0);

  const deliveryFee = subtotal > 0 ? 1200 : 0;
  const grandTotal = Math.max(0, subtotal + deliveryFee - discount);
  const totalItemCount = cart.reduce(
    (sum, item) => sum + Number(item.quantity || 1),
    0,
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/home" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-lg">
              S
            </div>
            <span className="font-bold text-gray-900 text-base">
              Supermarket
            </span>
          </Link>
          <Link
            to="/home"
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            ← Back to Shop
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Shopping Basket{" "}
            <span className="text-sm font-normal text-gray-500">
              ({totalItemCount} {totalItemCount === 1 ? "item" : "items"})
            </span>
          </h1>

          {cart.length > 0 && (
            <button
              onClick={handleClearCart}
              className="text-xs font-semibold text-red-500 hover:text-red-700 hover:underline cursor-pointer"
            >
              Clear Cart
            </button>
          )}
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs flex justify-between items-center">
            <span>{errorMessage}</span>
            <Link
              to="/login"
              className="font-bold underline hover:text-amber-950 ml-2"
            >
              Sign In
            </Link>
          </div>
        )}

        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-600 border-t-transparent mb-3"></div>
            <p className="text-sm font-semibold text-gray-500">
              Loading cart contents...
            </p>
          </div>
        ) : cart.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm max-w-lg mx-auto">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
              🛒
            </div>
            <h2 className="text-lg font-bold text-gray-900">
              Your basket is empty
            </h2>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              Looks like you haven't added anything to your cart yet. Explore
              our grocery collection and pick up your daily essentials.
            </p>
            <Link
              to="/home"
              className="mt-6 inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => {
                const product = item.product || item;
                const productId = getCleanProductId(item);
                const imageUrl =
                  product.imageUrl ||
                  product.image?.url ||
                  (typeof product.image === "string" ? product.image : null);
                const unitPrice = Number(product.price || item.price || 0);
                const quantity = Number(item.quantity || 1);
                const isBusy = updatingId === productId;

                return (
                  <div
                    key={productId}
                    className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex gap-4 items-center"
                  >
                    <div className="w-20 h-20 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden flex items-center justify-center">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={product.name || "Product"}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                        />
                      ) : null}
                      <div
                        className={`w-full h-full flex items-center justify-center text-gray-400 text-xs ${
                          imageUrl ? "hidden" : "flex"
                        }`}
                      >
                        🛍️
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-sm text-gray-900 truncate">
                            {product.name}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {product.unit ||
                              product.category?.name ||
                              product.category ||
                              "Grocery"}
                          </p>
                        </div>
                        <button
                          disabled={isBusy}
                          onClick={() => handleRemoveItem(productId)}
                          className="text-gray-400 hover:text-red-500 transition text-sm p-1 disabled:opacity-40"
                          title="Remove item"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="flex justify-between items-center mt-3">
                        <span className="font-extrabold text-sm text-emerald-700">
                          ₦{(unitPrice * quantity).toLocaleString()}
                          <span className="text-[11px] font-normal text-gray-400 ml-1">
                            (₦{unitPrice.toLocaleString()} ea)
                          </span>
                        </span>

                        <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 overflow-hidden">
                          <button
                            disabled={isBusy}
                            onClick={() => handleRemoveQuantity(productId)}
                            className="px-2.5 py-1 text-sm font-bold text-gray-600 hover:bg-gray-200 transition disabled:opacity-40"
                          >
                            -
                          </button>
                          <span className="px-3 text-xs font-bold text-gray-800">
                            {isBusy ? "..." : quantity}
                          </span>
                          <button
                            disabled={isBusy}
                            onClick={() => handleAddQuantity(productId)}
                            className="px-2.5 py-1 text-sm font-bold text-gray-600 hover:bg-gray-200 transition disabled:opacity-40"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="space-y-4">
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                <h2 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3">
                  Order Summary
                </h2>

                <div className="space-y-2.5 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-900">
                      ₦{subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Estimate</span>
                    <span className="font-semibold text-gray-900">
                      ₦{deliveryFee.toLocaleString()}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Promo Discount</span>
                      <span className="font-semibold">
                        -₦{discount.toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-extrabold text-gray-900 border-t border-gray-100 pt-3">
                    <span>Total</span>
                    <span className="text-emerald-700">
                      ₦{grandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                <form onSubmit={applyPromo} className="pt-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo code (e.g. GROUP29)"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 bg-gray-50 border border-gray-200 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-emerald-600"
                    />
                    <button
                      type="submit"
                      className="bg-gray-900 text-white text-xs font-semibold px-3 py-2 rounded-xl hover:bg-gray-800 transition"
                    >
                      Apply
                    </button>
                  </div>
                  {promoError && (
                    <p className="text-[11px] text-red-500 mt-1">
                      {promoError}
                    </p>
                  )}
                  {discount > 0 && (
                    <p className="text-[11px] text-emerald-600 mt-1 font-medium">
                      Coupon applied: ₦1,000 saved!
                    </p>
                  )}
                </form>

                <button
                  onClick={() =>
                    navigate("/checkout", {
                      state: { grandTotal, subtotal, discount, deliveryFee },
                    })
                  }
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition active:scale-95 cursor-pointer"
                >
                  Proceed to Checkout (₦{grandTotal.toLocaleString()})
                </button>
              </div>

              <div className="bg-emerald-50 rounded-2xl p-4 flex items-center gap-3">
                <span className="text-xl">🛡️</span>
                <p className="text-[11px] text-emerald-900 leading-tight">
                  <strong className="block font-semibold">
                    100% Secure Checkout
                  </strong>
                  Encrypted transactions & quick supermarket delivery.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
