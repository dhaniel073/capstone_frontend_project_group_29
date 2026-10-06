import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProducts } from "./api";

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
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState(() => {
    return JSON.parse(localStorage.getItem("cart") || "[]");
  });

  const user = JSON.parse(
    localStorage.getItem("user") || '{"name": "Customer"}',
  );

  // Live Backend Fetch with Local Fallback
  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        setLoading(true);
        const res = await getProducts();

        // Normalize backend data format (res, res.data, or res.data.products)
        const serverProducts = Array.isArray(res)
          ? res
          : res.data?.products || res.data || [];

       if (serverProducts.length > 0) {
  setProducts([...serverProducts, ...INITIAL_PRODUCTS]);

        } else {
          // If the database is empty, fall back to initial demo catalog
          const custom = JSON.parse(
            localStorage.getItem("custom_products") || "[]",
          );
          setProducts([...custom, ...INITIAL_PRODUCTS]);
        }
      } catch (err) {
        console.warn(
          "Backend not reached, using local catalog fallback:",
          err.message,
        );
        const custom = JSON.parse(
          localStorage.getItem("custom_products") || "[]",
        );
        setProducts([...custom, ...INITIAL_PRODUCTS]);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const addToCart = (product) => {
    const productId = product._id || product.id;
    setCart((prev) => {
      const existing = prev.find((item) => (item._id || item.id) === productId);
      let updated;
      if (existing) {
        updated = prev.map((item) =>
          (item._id || item.id) === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      } else {
        updated = [...prev, { ...product, id: productId, quantity: 1 }];
      }
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const filteredProducts = products.filter((product) => {
    const categoryName = product.category?.name || product.category || "";
    const matchesCategory =
      selectedCategory === "All" || categoryName === selectedCategory;
    const matchesSearch = product.name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col justify-between">
      <div>
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

            {/* Header Actions & Profile */}
            <div className="flex items-center gap-3">
              {/* Add Product Button for Admin */}
              <button
                onClick={() => navigate("/admin/add-product")}
                className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 transition cursor-pointer"
              >
                + Add Product
              </button>

              {/* Cart Button */}
              <button
                onClick={() => navigate("/cart")}
                className="relative p-2 px-3 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition flex items-center gap-2 cursor-pointer"
              >
                <span className="text-sm font-semibold">🛒 Cart</span>
                {totalCartCount > 0 && (
                  <span className="bg-emerald-600 text-white text-[11px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow">
                    {totalCartCount}
                  </span>
                )}
              </button>

              {/* User Profile */}
              <div className="flex items-center gap-2 border-l border-gray-200 pl-3">
                <div className="text-right hidden md:block">
                  <Link
                    to="/profile"
                    className="block text-xs font-semibold leading-tight text-gray-900 hover:text-emerald-700"
                  >
                    {user.name || "My Profile"}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-[11px] text-red-500 hover:underline font-medium cursor-pointer"
                  >
                    Log out
                  </button>
                </div>
                <Link
                  to="/profile"
                  aria-label="Open your profile"
                  className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs uppercase no-underline"
                >
                  {user.name ? user.name.charAt(0) : "U"}
                </Link>
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
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
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
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          {loading ? (
            <div className="py-20 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-600 border-t-transparent mb-3"></div>
              <p className="text-sm font-semibold text-gray-500">
                Loading supermarket catalog...
              </p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-2xl border border-gray-100">
              <p className="text-base font-bold text-gray-800">
                No products found
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Try another category or clear your search query.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((prod) => {
                const prodKey = prod._id || prod.id;
                const imageUrl =
                  prod.imageUrl ||
                  prod.image?.url ||
                  prod.image ||
                  "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80";
                const catLabel =
                  prod.category?.name || prod.category || "General";

                return (
                  <div
                    key={prodKey}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition"
                  >
                    <div className="h-44 bg-gray-100 relative overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={prod.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[11px] font-bold text-gray-700 px-2 py-0.5 rounded-md shadow-sm">
                        {catLabel}
                      </span>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-sm text-gray-900 leading-snug line-clamp-1">
                          {prod.name}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {prod.unit || prod.description || "Fresh in store"}
                        </p>
                      </div>

                      <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-100">
                        <span className="text-base font-extrabold text-emerald-700">
                          ₦{Number(prod.price || 0).toLocaleString()}
                        </span>
                        <button
                          onClick={() => addToCart(prod)}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition active:scale-95 shadow-sm cursor-pointer"
                        >
                          + Add
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Sticky Bottom Bar */}
      {totalCartCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-6 z-40 border border-gray-800">
          <div>
            <p className="text-[11px] text-gray-400">
              Total ({totalCartCount} items)
            </p>
            <p className="text-base font-extrabold text-emerald-400">
              ₦{subtotal.toLocaleString()}
            </p>
          </div>
          <button
            onClick={() => navigate("/cart")}
            className="bg-emerald-500 hover:bg-emerald-600 text-gray-950 font-bold px-5 py-2.5 rounded-xl text-xs transition active:scale-95 cursor-pointer shadow-md"
          >
            View Cart & Checkout →
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-10 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
                🚀
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">
                  Fast Local Delivery
                </h4>
                <p className="text-xs text-gray-500">
                  Same-day delivery directly to your door.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
                🥬
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">
                  100% Fresh Guarantee
                </h4>
                <p className="text-xs text-gray-500">
                  Sourced fresh daily from verified local farms.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
                🔒
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">
                  Secure Payments
                </h4>
                <p className="text-xs text-gray-500">
                  Protected checkouts powered by Paystack.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                  S
                </div>
                <span className="font-bold text-gray-900 text-sm">
                  Supermarket
                </span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Your one-stop community supermarket application built for speed,
                fresh supplies, and easy ordering.
              </p>
            </div>

            <div>
              <h5 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
                Categories
              </h5>
              <ul className="space-y-2 text-xs text-gray-500">
                {CATEGORIES.slice(1).map((cat) => (
                  <li key={cat}>
                    <button
                      onClick={() => {
                        setSelectedCategory(cat);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="hover:text-emerald-600 transition cursor-pointer"
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
                Quick Links
              </h5>
              <ul className="space-y-2 text-xs text-gray-500">
                <li>
                  <button
                    onClick={() => navigate("/cart")}
                    className="hover:text-emerald-600 transition cursor-pointer"
                  >
                    View Basket
                  </button>
                </li>
                <li>
                  <Link
                    to="/profile"
                    className="hover:text-emerald-600 transition"
                  >
                    My Profile
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                    className="hover:text-emerald-600 transition cursor-pointer"
                  >
                    Search Products
                  </button>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="hover:text-red-500 transition cursor-pointer"
                  >
                    Account Logout
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
                Capstone Project
              </h5>
              <p className="text-xs text-gray-500 leading-relaxed">
                Built by <strong>Group 29</strong>. Full-stack supermarket
                implementation with Node.js, Express, React, and MongoDB.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-400">
            <p>© 2026 Supermarket App (Group 29). All rights reserved.</p>
            <div className="flex gap-4">
              <span>Privacy Policy</span>
              <span>•</span>
              <span>Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
