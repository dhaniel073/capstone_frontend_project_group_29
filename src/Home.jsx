import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: "Fresh Organic Bananas",
    category: "Fruits & Veggies",
    price: 2500,
    unit: "1 bunch (approx. 1kg)",
    image:
      "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 2,
    name: "Golden Sliced Bread",
    category: "Bakery",
    price: 1800,
    unit: "800g Loaf",
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 3,
    name: "Farm Fresh Whole Eggs",
    category: "Dairy & Eggs",
    price: 4500,
    unit: "Crate of 30",
    image:
      "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 4,
    name: "Ripe Red Tomatoes",
    category: "Fruits & Veggies",
    price: 3200,
    unit: "2kg Basket",
    image:
      "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 5,
    name: "Pure Full Cream Milk",
    category: "Dairy & Eggs",
    price: 2100,
    unit: "1 Litre Pack",
    image:
      "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 6,
    name: "Chilled Fruit Juice Blend",
    category: "Drinks & Snacks",
    price: 1950,
    unit: "1 Litre Bottle",
    image:
      "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80",
  },
];

const CATEGORIES = [
  "All",
  "Fruits & Veggies",
  "Dairy & Eggs",
  "Bakery",
  "Drinks & Snacks",
];

export default function Home() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const user = JSON.parse(
    localStorage.getItem("user") || '{"name": "Customer"}',
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean),
    );
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const deliveryFee = subtotal > 0 ? 1200 : 0;
  const grandTotal = subtotal + deliveryFee;

  const filteredProducts = INITIAL_PRODUCTS.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCheckout = () => {
    setOrderSuccess(true);
    setCart([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-xl">
              S
            </div>
            <div>
              <span className="font-bold text-lg text-gray-900 tracking-tight leading-none block">
                Supermarket
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold uppercase tracking-wider">
                Group 29 Store
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md hidden sm:block">
            <input
              type="text"
              placeholder="Search groceries, bakery, fresh foods..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 text-sm bg-gray-100 rounded-xl border border-transparent focus:border-emerald-600 focus:bg-white focus:outline-none transition"
            />
          </div>

          {/* Cart Button & User Profile */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 px-3 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition flex items-center gap-2"
            >
              <span className="text-sm font-semibold">🛒 Cart</span>
              {totalCartCount > 0 && (
                <span className="bg-emerald-600 text-white text-[11px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow">
                  {totalCartCount}
                </span>
              )}
            </button>

            <div className="flex items-center gap-2 border-l border-gray-200 pl-4">
              <div className="text-right hidden md:block">
                <p className="text-xs font-semibold text-gray-900 leading-tight">
                  {user.name}
                </p>
                <button
                  onClick={handleLogout}
                  className="text-[11px] text-red-500 hover:underline font-medium"
                >
                  Log out
                </button>
              </div>
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs uppercase">
                {user.name ? user.name.charAt(0) : "U"}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-700 to-teal-900 p-8 text-white relative overflow-hidden shadow-sm">
          <div className="relative z-10 max-w-xl">
            <span className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
              Daily Essentials
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl mb-2">
              Fresh Groceries Delivered Direct to You
            </h1>
            <p className="text-emerald-100 text-sm">
              Discover top quality produce, dairy products, bakery goods, and
              pantry supplies.
            </p>
          </div>
        </div>
      </section>

      {/* Category Pills */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Products Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition"
            >
              <div className="h-44 bg-gray-100 relative overflow-hidden">
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[11px] font-bold text-gray-700 px-2 py-0.5 rounded-md shadow-sm">
                  {prod.category}
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm text-gray-900 leading-snug line-clamp-1">
                    {prod.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">{prod.unit}</p>
                </div>

                <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-base font-extrabold text-emerald-700">
                    ₦{prod.price.toLocaleString()}
                  </span>
                  <button
                    onClick={() => addToCart(prod)}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition active:scale-95 shadow-sm"
                  >
                    + Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Sticky Bottom Bar */}
      {totalCartCount > 0 && !isCartOpen && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3.5 rounded-2xl shadow-xl flex items-center gap-6 z-40">
          <div>
            <p className="text-[11px] text-gray-400">
              Total ({totalCartCount} items)
            </p>
            <p className="text-base font-extrabold text-emerald-400">
              ₦{subtotal.toLocaleString()}
            </p>
          </div>
          <button
            onClick={() => setIsCartOpen(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-gray-950 font-bold px-4 py-2 rounded-xl text-xs transition active:scale-95"
          >
            View Cart & Checkout →
          </button>
        </div>
      )}

      {/* Slide-over Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsCartOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
              {/* Drawer Header */}
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Your Basket
                  </h2>
                  <p className="text-xs text-gray-500">
                    {totalCartCount} items selected
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition"
                >
                  ✕
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-16">
                    <p className="text-4xl mb-3">🧺</p>
                    <p className="text-sm font-semibold text-gray-800">
                      Your basket is empty
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Add fresh groceries to begin checkout
                    </p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-3 bg-gray-50 rounded-2xl border border-gray-100"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-gray-900 line-clamp-1">
                            {item.name}
                          </h4>
                          <p className="text-[11px] text-gray-500">
                            ₦{item.price.toLocaleString()} each
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs font-bold text-emerald-700">
                            ₦{(item.price * item.quantity).toLocaleString()}
                          </span>
                          <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 px-2 py-0.5">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="text-xs font-bold text-gray-600 hover:text-red-600 px-1"
                            >
                              -
                            </button>
                            <span className="text-xs font-bold text-gray-800">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="text-xs font-bold text-gray-600 hover:text-emerald-600 px-1"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Drawer Footer Summary */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-gray-100 bg-gray-50/50 space-y-3">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Subtotal</span>
                    <span>₦{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Standard Delivery</span>
                    <span>₦{deliveryFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-gray-900 border-t border-gray-200 pt-2">
                    <span>Total</span>
                    <span className="text-emerald-700">
                      ₦{grandTotal.toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="w-full mt-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition active:scale-98 shadow-sm"
                  >
                    Place Order (₦{grandTotal.toLocaleString()})
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Order Confirmed Modal */}
      {orderSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
              ✓
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              Order Placed Successfully!
            </h3>
            <p className="text-xs text-gray-500 mt-2">
              Thank you, {user.name}! Your order has been registered and is
              being prepared for express delivery.
            </p>
            <button
              onClick={() => {
                setOrderSuccess(false);
                setIsCartOpen(false);
              }}
              className="mt-6 w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
