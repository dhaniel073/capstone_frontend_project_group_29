import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "./api";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }
    if (!formData.agreeTerms) {
      return setError("You must agree to the Terms & Privacy Policy");
    }

    try {
      setLoading(true);
      const res = await API.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      localStorage.setItem("token", res.data.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.data.user));

      alert("Account created successfully!");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="text-sm text-gray-500 mt-1">
            Join Our Supermarket and start shopping 🛒
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
              Full name
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="e.g. John Dera"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Email address
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Phone number
            </label>
            <input
              type="tel"
              name="phone"
              required
              placeholder="08012345678"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Password
            </label>
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
                className="absolute right-3 top-3 text-[11px] font-bold text-gray-400 hover:text-gray-700 tracking-wider"
              >
                {showPassword ? "HIDE" : "SHOW"}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Confirm password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              required
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="agreeTerms"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
            />
            <label htmlFor="agreeTerms" className="text-xs text-gray-600">
              I agree to the{" "}
              <span className="text-emerald-600 font-medium underline">
                Terms & Privacy Policy
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl transition duration-150 disabled:opacity-60 shadow-sm"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100"></div>
          </div>
          <span className="relative px-3 bg-white text-xs text-gray-400">
            or sign up with
          </span>
        </div>

        <div className="flex justify-center gap-3">
          <button
            type="button"
            className="w-11 h-11 flex items-center justify-center border border-gray-200 rounded-full text-sm font-bold text-gray-700 hover:bg-gray-50"
          >
            G
          </button>
          <button
            type="button"
            className="w-11 h-11 flex items-center justify-center border border-gray-200 rounded-full text-base font-bold text-black hover:bg-gray-50"
          >
            
          </button>
          <button
            type="button"
            className="w-11 h-11 flex items-center justify-center border border-gray-200 rounded-full text-sm font-bold text-blue-600 hover:bg-gray-50"
          >
            f
          </button>
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-emerald-600 font-semibold hover:underline"
          >
            Log In
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
