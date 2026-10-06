import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "Lagos",
    paymentMethod: "card",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(savedCart);

    // Pre-fill user details if profile exists in localStorage
    const savedProfile = JSON.parse(localStorage.getItem("userProfile"));
    if (savedProfile) {
      setFormData((prev) => ({
        ...prev,
        fullName: savedProfile.name || "",
        phone: savedProfile.phone || "",
        address: savedProfile.address || "",
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 0 ? 1200 : 0;
  const grandTotal = subtotal + deliveryFee;

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    // Save order history or clear cart here
    setIsSubmitted(true);
    localStorage.removeItem("cart"); // Clear cart after order
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] text-gray-800 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 text-center border border-gray-100 shadow-sm max-w-md w-full space-y-4">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-3xl mx-auto text-emerald-700">
            🎉
          </div>
          <h2 className="text-xl font-bold text-gray-900">Order Placed Successfully!</h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            Thank you for shopping with us, <span className="font-semibold">{formData.fullName}</span>. Your groceries are being prepared for quick delivery to <span className="font-semibold">{formData.address}</span>.
          </p>
          <button
            onClick={() => navigate("/home")}
            className="w-full mt-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition shadow-md"
          >
            Back to Home Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-gray-800">
      {/* Top Navbar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/home" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-lg">
              S
            </div>
            <span className="font-bold text-gray-900 text-base">Supermarket</span>
          </Link>
          <Link
            to="/cart"
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            ← Back to Basket
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout & Delivery</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="md:col-span-2">
            <form onSubmit={handleSubmitOrder} className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3">
                Shipping Information
              </h2>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-50 border border-gray-200 text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:border-emerald-600"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-50 border border-gray-200 text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:border-emerald-600"
                  placeholder="e.g. 08012345678"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Delivery Address</label>
                <textarea
                  name="address"
                  rows="3"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-50 border border-gray-200 text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:border-emerald-600 resize-none"
                  placeholder="Street address, apartment, etc."
                />
              </div>

              <h2 className="text-sm font-bold text-gray-900 border-b border-gray-100 pt-4 pb-3">
                Payment Method
              </h2>

              <div className="space-y-2 text-xs">
                <label className="flex items-center gap-2 p-3 border border-gray-200 rounded-xl bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === "card"}
                    onChange={handleChange}
                    className="accent-emerald-600"
                  />
                  <span className="font-semibold">Pay with Card / Online Transfer</span>
                </label>
                <label className="flex items-center gap-2 p-3 border border-gray-200 rounded-xl bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={formData.paymentMethod === "cash"}
                    onChange={handleChange}
                    className="accent-emerald-600"
                  />
                  <span className="font-semibold">Cash on Delivery</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition"
              >
                Complete Order (₦{grandTotal.toLocaleString()})
              </button>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3">
                Order Items ({cart.reduce((sum, item) => sum + item.quantity, 0)})
              </h2>
              <div className="max-h-60 overflow-y-auto space-y-3">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-xs">
                    <span className="text-gray-600 truncate max-w-[140px]">
                      {item.name} x {item.quantity}
                    </span>
                    <span className="font-semibold text-gray-900">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-3 space-y-2 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-semibold text-gray-900">₦{deliveryFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-gray-900 border-t border-gray-100 pt-3">
                  <span>Total</span>
                  <span className="text-emerald-700">₦{grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
      }
      
