import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "./api";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
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
      const res = await loginUser(formData);

      // Extract token and user details regardless of response wrapper
      const token = res.data?.token || res.token;
      const user = res.data?.user ||
        res.user || {
          name: formData.email.split("@")[0],
          email: formData.email,
        };

      if (token) {
        localStorage.setItem("token", token);
      }
      localStorage.setItem("user", JSON.stringify(user));

      alert("Logged in successfully!");
      navigate("/home");
    } catch (err) {
      console.warn(
        "Backend auth failed, using demo session fallback:",
        err.message,
      );

      // Local fallback for offline testing or demo environments
      if (!err.response) {
        const fallbackUser = {
          name: formData.email.split("@")[0] || "Customer",
          email: formData.email,
        };
        localStorage.setItem("token", "demo-token-" + Date.now());
        localStorage.setItem("user", JSON.stringify(fallbackUser));
        alert("Logged in with offline demo session!");
        navigate("/home");
        return;
      }

      setError(
        err.response?.data?.message || "Invalid email address or password",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-sm text-gray-500 mt-1">
            Log in to continue shopping
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
              Email address
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="customer1@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-gray-700">
                Password
              </label>
              <Link
                to="/reset-password"
                className="text-xs font-medium text-emerald-600 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition pr-14"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-[11px] font-bold text-gray-400 hover:text-gray-700 tracking-wider cursor-pointer"
              >
                {showPassword ? "HIDE" : "SHOW"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl transition duration-150 disabled:opacity-60 shadow-sm cursor-pointer"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100"></div>
          </div>
          <span className="relative px-3 bg-white text-xs text-gray-400">
            or continue with
          </span>
        </div>

        <div className="flex justify-center gap-3">
          <button
            type="button"
            className="w-11 h-11 flex items-center justify-center border border-gray-200 rounded-full text-sm font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
          >
            G
          </button>
          <button
            type="button"
            className="w-11 h-11 flex items-center justify-center border border-gray-200 rounded-full text-base font-bold text-black hover:bg-gray-50 cursor-pointer"
          >
            
          </button>
          <button
            type="button"
            className="w-11 h-11 flex items-center justify-center border border-gray-200 rounded-full text-sm font-bold text-blue-600 hover:bg-gray-50 cursor-pointer"
          >
            f
          </button>
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-emerald-600 font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </p>

        {/* Dedicated Admin Registration Switcher */}
        <div className="mt-4 pt-4 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-500">
            Store employee or manager?{" "}
            <Link
              to="/admin/register"
              className="text-emerald-700 font-semibold hover:underline inline-block mt-0.5"
            >
              Register as Admin &rarr;
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
