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

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const filteredProducts = INITIAL_PRODUCTS.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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

          {/* Actions & User */}
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition">
              <span className="text-sm font-semibold">🛒 Cart</span>
              {totalCartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-emerald-600 text-white text-[11px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow">
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

      {/* Product Catalog Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
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
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
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
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition active:scale-95 shadow-sm"
                  >
                    + Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Sticky Cart Footer Bar when items exist */}
      {totalCartCount > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3.5 rounded-2xl shadow-xl flex items-center gap-6 z-40">
          <div>
            <p className="text-[11px] text-gray-400">
              Total ({totalCartCount} items)
            </p>
            <p className="text-base font-extrabold text-emerald-400">
              ₦{totalCartAmount.toLocaleString()}
            </p>
          </div>
          <button className="bg-emerald-500 hover:bg-emerald-600 text-gray-950 font-bold px-4 py-2 rounded-xl text-xs transition">
            Proceed to Checkout →
          </button>
        </div>
      )}
    </div>
  );
}
