import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      return Array.isArray(savedCart) ? savedCart : [];
    } catch {
      return [];
    }
  });
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");

  // Sync to localStorage whenever cart changes
  const updateStorage = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleQuantity = (id, delta) => {
    const updated = cart
      .map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter(Boolean);
    updateStorage(updated);
  };

  const removeItem = (id) => {
    const updated = cart.filter((item) => item.id !== id);
    updateStorage(updated);
  };

  const clearCart = () => {
    updateStorage([]);
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

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const deliveryFee = subtotal > 0 ? 1200 : 0;
  const grandTotal = Math.max(0, subtotal + deliveryFee - discount);
  const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Top Navbar */}
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
              onClick={clearCart}
              className="text-xs text-red-500 hover:text-red-700 font-medium transition"
            >
              Clear all items
            </button>
          )}
        </div>

        {cart.length === 0 ? (
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
            {/* Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex gap-4 items-center"
                >
                  <img
                    src={
                      item.imageUrl ||
                      item.image?.url ||
                      item.image ||
                      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80"
                    }
                    alt={item.name}
                    className="w-20 h-20 rounded-xl object-cover bg-gray-100 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-sm text-gray-900 truncate">
                          {item.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {item.unit || item.category}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500 transition text-sm p-1"
                        title="Remove item"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="flex justify-between items-center mt-3">
                      <span className="font-extrabold text-sm text-emerald-700">
                        ₦{(item.price * item.quantity).toLocaleString()}
                        <span className="text-[11px] font-normal text-gray-400 ml-1">
                          (₦{item.price.toLocaleString()} ea)
                        </span>
                      </span>

                      {/* Quantity Controls */}
                      <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 overflow-hidden">
                        <button
                          onClick={() => handleQuantity(item.id, -1)}
                          className="px-2.5 py-1 text-sm font-bold text-gray-600 hover:bg-gray-200 transition"
                        >
                          -
                        </button>
                        <span className="px-3 text-xs font-bold text-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantity(item.id, 1)}
                          className="px-2.5 py-1 text-sm font-bold text-gray-600 hover:bg-gray-200 transition"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Sidebar */}
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

                {/* Promo Code Input */}
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
                  onClick={() => navigate("/checkout")}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition active:scale-95"
                >
                  Proceed to Checkout (₦{grandTotal.toLocaleString()})
                </button>
              </div>

              {/* Trust Badge */}
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
