import React, { useState } from "react";
import { Link } from "react-router-dom";
import API from "./api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      setLoading(true);

      const res = await API.post("/auth/forgot-password", {
        email,
      });

      setMessage(
        res.data.message ||
          "If an account exists with this email, a password reset link has been sent."
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8 sm:px-6">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">

        {/* Header */}
        <div className="mb-7">
          <Link
            to="/login"
            className="text-sm text-emerald-600 font-medium hover:underline"
          >
            ← Back to Login
          </Link>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-6">
            Forgot Password?
          </h1>

          <p className="text-sm sm:text-base text-gray-500 mt-2 leading-relaxed">
            Enter your email address and we'll send you instructions to reset
            your password.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 p-3 sm:p-4 bg-red-50 text-red-600 text-xs sm:text-sm rounded-xl border border-red-200">
            {error}
          </div>
        )}

        {/* Success */}
        {message && (
          <div className="mb-5 p-4 bg-emerald-50 text-emerald-700 text-sm rounded-xl border border-emerald-200">
            <p className="font-semibold mb-1">Check your email</p>
            <p>{message}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email address
            </label>

            <input
              type="email"
              required
              placeholder="customer1@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 text-sm sm:text-base border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 sm:py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm sm:text-base rounded-xl transition duration-150 disabled:opacity-60 shadow-sm"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {/* Important Information */}
        <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            Your reset link will be valid for <strong>5 minutes</strong>.
            Check your spam folder if you don't see it.
          </p>
        </div>

        {/* Login */}
        <p className="text-center text-xs sm:text-sm text-gray-500 mt-6">
          Remember your password?{" "}
          <Link
            to="/login"
            className="text-emerald-600 font-semibold hover:underline"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}