import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  
  // State for user profile details
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  // Load profile from localStorage on mount
  useEffect(() => {
    const savedProfile = JSON.parse(localStorage.getItem("userProfile")) || {
      name: "Amina Yusuf",
      email: "amina.yusuf@example.com",
      phone: "+234 801 234 5678",
      address: "14 Adeola Odeku Street, Victoria Island, Lagos",
    };
    setProfile(savedProfile);
  }, []);

  // Handle input changes in edit mode
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // Save profile changes to localStorage
  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem("userProfile", JSON.stringify(profile));
    setIsEditing(false);
    setSaveMessage("Profile updated successfully!");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Top Navbar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/home" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-lg">
              S
            </div>
            <span className="font-bold text-gray-900 text-base">
              Supermarket
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/cart"
              className="text-xs font-semibold text-gray-600 hover:text-emerald-700 transition"
            >
              🛒 Basket
            </Link>
            <Link
              to="/home"
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              ← Back to Shop
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            My Account Profile
          </h1>
          {saveMessage && (
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
              {saveMessage}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar Navigation / Quick Info */}
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-2xl font-bold text-emerald-700 mx-auto mb-3">
                {profile.name ? profile.name.charAt(0) : "U"}
              </div>
              <h2 className="font-bold text-sm text-gray-900">{profile.name}</h2>
              <p className="text-xs text-gray-500 mt-0.5">{profile.email}</p>
              
              <div className="mt-6 pt-6 border-t border-gray-100 space-y-2">
                <Link
                  to="/cart"
                  className="block w-full py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold text-xs rounded-xl transition"
                >
                  View Shopping Basket
                </Link>
              </div>
            </div>
          </div>

          {/* Profile Details Form */}
          <div className="md:col-span-2">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
              <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <h2 className="text-sm font-bold text-gray-900">
                  Personal Information
                </h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditing(false)}
                    className="text-xs font-semibold text-gray-500 hover:text-gray-700 transition"
                  >
                    Cancel
                  </button>
                )}
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full bg-gray-50 border border-gray-200 text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:border-emerald-600 disabled:opacity-60"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full bg-gray-50 border border-gray-200 text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:border-emerald-600 disabled:opacity-60"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full bg-gray-50 border border-gray-200 text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:border-emerald-600 disabled:opacity-60"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Delivery Address
                  </label>
                  <textarea
                    name="address"
                    rows="3"
                    value={profile.address}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full bg-gray-50 border border-gray-200 text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:border-emerald-600 disabled:opacity-60 resize-none"
                    required
                  />
                </div>

                {isEditing && (
                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition"
                  >
                    Save Changes
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
    }
            
