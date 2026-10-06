import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createProduct } from "./api";

const CATEGORIES = [
  "Fruits & Veggies",
  "Dairy & Eggs",
  "Bakery",
  "Drinks & Snacks",
];

export default function AddProduct() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    category: "Fruits & Veggies",
    price: "",
    unit: "",
    description: "",
    stock: "10",
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg({ type: "", text: "" });

    try {
      // 1. Build multipart FormData for Multer & Cloudinary upload pipeline
      const data = new FormData();
      data.append("name", formData.name);
      data.append("category", formData.category);
      data.append("price", formData.price);
      data.append("description", formData.description || formData.unit);
      data.append("stock", formData.stock || "10");
        data.append("unit",formData.unit);
       data.append(
         "sku",
         formData.sku?.trim() || `SKU-${Date.now().toString().slice(-6)}`,
       );
      if (imageFile) {
        data.append("image", imageFile); // Matched to upload.single("image") in the backend
      }

      // 2. Call the centralized Axios helper in src/api.js
      await createProduct(data);

      setStatusMsg({
        type: "success",
        text: "Product published to backend successfully!",
      });
      setTimeout(() => navigate("/home"), 1200);
    } catch (err) {
        alert(err.response?.data?.message || err.message);
      console.warn(
        "Backend upload failed, saving to local catalog fallback:",
        err.message,
      );

      // 3. Graceful fallback for local demo or when offline
      const localProduct = {
        id: Date.now(),
        name: formData.name,
        category: formData.category,
        price: Number(formData.price),
        unit: formData.unit,
        description: formData.description || formData.unit,
        image:
          previewUrl ||
          "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80",
      };

      const existing = JSON.parse(
        localStorage.getItem("custom_products") || "[]",
      );
      localStorage.setItem(
        "custom_products",
        JSON.stringify([localProduct, ...existing]),
      );

      setStatusMsg({
        type: "success",
        text: "Added product to local catalog view!",
      });
      //setTimeout(() => navigate("/home"), 1200);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/home" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
              S
            </div>
            <span className="font-bold text-gray-900 text-sm">
              Supermarket Admin
            </span>
          </Link>
          <Link
            to="/home"
            className="text-xs font-semibold text-emerald-700 hover:underline cursor-pointer"
          >
            ← Storefront
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10">
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <h1 className="text-xl font-bold text-gray-900 mb-1">
            Add New Item to Catalog
          </h1>
          <p className="text-xs text-gray-500 mb-6">
            Upload product details, pricing, stock levels, and media assets.
          </p>

          {statusMsg.text && (
            <div
              className={`p-3 rounded-xl text-xs mb-4 ${
                statusMsg.type === "success"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {statusMsg.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Product Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Crisp Green Apples"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600 cursor-pointer"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Price (₦)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  placeholder="3500"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Unit / Packaging
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1kg Bag, 500ml Bottle"
                  value={formData.unit}
                  onChange={(e) =>
                    setFormData({ ...formData, unit: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Available Stock
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="10"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600"
                />
              </div>
                      </div>
                      

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Description (Optional)
              </label>
              <textarea
                rows="2"
                placeholder="Product description and details..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Product Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-xs text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
              />
              {previewUrl && (
                <div className="mt-3">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded-xl border border-gray-200"
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition cursor-pointer disabled:opacity-50 active:scale-98 shadow-sm"
            >
              {loading
                ? "Uploading to Cloudinary..."
                : "Publish Product to Catalog"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
