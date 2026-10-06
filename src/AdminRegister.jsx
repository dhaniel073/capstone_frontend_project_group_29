import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "./api";

export default function AdminRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      // Explicitly send role: "admin" so the backend saves it as admin
      const payload = {
        ...formData,
        role: "admin",
      };

      const res = await registerUser(payload);

      // Support ApiResponse structure from backend
      const token = res.data?.token || res.token || res.data?.data?.token;
      const user = res.data?.user || res.user || res.data?.data?.user;

      if (token) {
        localStorage.setItem("token", token);
      }
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }

      alert("Admin account registered successfully!");
      navigate("/admin/add-product");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <div className="mb-6 text-center">
          <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Admin Registration
          </span>
          <h1 className="text-2xl font-bold text-gray-900 mt-3">Store Admin</h1>
          <p className="text-xs text-gray-500 mt-1">
            Create an administrator account to manage store products
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs rounded-xl border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Admin Name
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="e.g. Admin Manager"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Admin Email
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="admin@supermarket.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl transition disabled:opacity-60 shadow-sm cursor-pointer"
          >
            {loading ? "Registering..." : "Create Admin Account"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-emerald-600 font-semibold hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
