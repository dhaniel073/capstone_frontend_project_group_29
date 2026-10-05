import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts, getCart, addOneToCart } from "./api";

const BASE_CATEGORIES = [
  "All",
  "Fruits & Veggies",
  "Dairy & Eggs",
  "Bakery",
  "Drinks & Snacks",
];

const isObjectId = (val) =>
  typeof val === "string" && /^[0-9a-fA-F]{24}$/.test(val);

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

  useEffect(() => {
    const syncCart = async () => {
      try {
        const res = await getCart();
        const serverItems =
          res?.data?.cart?.items ||
          res?.data?.items ||
          res?.cart?.items ||
          res?.items ||
          (Array.isArray(res?.data)
            ? res.data
            : Array.isArray(res)
              ? res
              : null);

        if (serverItems && serverItems.length > 0) {
          setCart(serverItems);
          localStorage.setItem("cart", JSON.stringify(serverItems));
        }
      } catch (err) {
        
      }
    };
    syncCart();
  }, []);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        setLoading(true);
        const res = await getProducts();
        const serverProducts = Array.isArray(res)
          ? res
          : res?.data?.products || res?.data || [];
        setProducts(serverProducts);
      } catch (err) {
        console.error("Failed to load products from server:", err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    navigate("/login");
  };

  const addToCart = async (product) => {
    const productId = product._id || product.id;

    
    setCart((prev) => {
      const existing = prev.find((item) => {
        const id = item.product?._id || item.productId || item._id || item.id;
        return id === productId;
      });

      let updated;
      if (existing) {
        updated = prev.map((item) => {
          const id = item.product?._id || item.productId || item._id || item.id;
          return id === productId
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item;
        });
      } else {
        updated = [...prev, { product, quantity: 1, _id: productId }];
      }
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });

    try {
      await addOneToCart(productId);
    } catch (err) {
      console.warn("Could not sync item to server cart:", err.message);
    }
  };

  const totalCartCount = cart.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0,
  );
  const subtotal = cart.reduce((sum, item) => {
    const price = Number(item.product?.price || item.price || 0);
    return sum + price * (item.quantity || 1);
  }, 0);

  const dynamicCategories = products
    .map((p) => p.category?.name || p.category)
    .filter((cat) => cat && !isObjectId(cat));

  const availableCategories = Array.from(
    new Set([...BASE_CATEGORIES, ...dynamicCategories]),
  );

  const filteredProducts = products.filter((product) => {
    const rawCategory = product.category?.name || product.category || "";
    const categoryName = isObjectId(rawCategory) ? "General" : rawCategory;

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

            <div className="flex-1 max-w-md hidden sm:block">
              <input
                type="text"
                placeholder="Search groceries, bakery, fresh foods..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 text-sm bg-gray-100 rounded-xl border border-transparent focus:border-emerald-600 focus:bg-white focus:outline-none transition"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/admin/add-product")}
                className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 transition cursor-pointer"
              >
                + Add Product
              </button>

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

              <div className="flex items-center gap-2 border-l border-gray-200 pl-3">
                <div className="text-right hidden md:block">
                  <p className="text-xs font-semibold text-gray-900 leading-tight">
                    {user.name}
                  </p>
                  <button
                    onClick={handleLogout}
                    className="text-[11px] text-red-500 hover:underline font-medium cursor-pointer"
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

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {availableCategories.map((cat) => (
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

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          {loading ? (
            <div className="py-20 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-600 border-t-transparent mb-3"></div>
              <p className="text-sm font-semibold text-gray-500">
                Loading supermarket catalog...
              </p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-2xl border border-gray-100 max-w-lg mx-auto shadow-sm">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3 text-gray-400">
                📦
              </div>
              <p className="text-base font-bold text-gray-800">
                No products found
              </p>
              <p className="text-xs text-gray-500 mt-1 px-4">
                {products.length === 0
                  ? "No inventory has been added to the store yet."
                  : "No products matched your selected category or search filter."}
              </p>
              {products.length === 0 && (
                <button
                  onClick={() => navigate("/admin/add-product")}
                  className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 transition"
                >
                  Create First Product
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((prod) => {
                const prodKey = prod._id || prod.id;
                const imageUrl =
                  prod.imageUrl ||
                  prod.image?.url ||
                  (typeof prod.image === "string" ? prod.image : null);

                const rawCat = prod.category?.name || prod.category || "";
                const catLabel = isObjectId(rawCat)
                  ? "Grocery"
                  : rawCat || "Grocery";

                return (
                  <div
                    key={prodKey}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition"
                  >
                    <div className="h-44 bg-gray-50 relative overflow-hidden flex items-center justify-center">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={prod.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                        />
                      ) : null}

                      <div
                        className={`w-full h-full flex-col items-center justify-center bg-gray-100 text-gray-400 ${
                          imageUrl ? "hidden" : "flex"
                        }`}
                      >
                        <svg
                          className="w-10 h-10 stroke-current text-gray-300"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="text-[10px] text-gray-400 mt-1 font-medium">
                          No image available
                        </span>
                      </div>

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
                          {prod.unit || prod.description || "In stock"}
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
                {BASE_CATEGORIES.slice(1).map((cat) => (
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
