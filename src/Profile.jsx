import React from 'react';

export default function UserProfile() {
  return (
    <div className="bg-[#f4f1ea] min-h-screen max-w-md mx-auto p-5 font-sans box-border">
      {/* Back button */}
      <button 
        className="bg-transparent border-none text-2xl cursor-pointer mb-5"
        onClick={() => window.history.back()}
      >
        ←
      </button>

      {/* User Avatar & Name Placeholder */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-[150px] h-[150px] bg-[#d9d9d9] rounded-full flex items-center justify-center mb-4">
          <span className="text-[70px]">👤</span>
        </div>
        <div className="bg-black h-3 w-36 rounded-full"></div>
      </div>

      {/* Cart History Section */}
      <div className="mb-6">
        <h3 className="text-base text-gray-800 mb-2 font-semibold">Cart History</h3>
        <div className="bg-[#d9d9d9] p-4 rounded-lg flex flex-col gap-2.5">
          <div className="bg-black h-2 w-2/5 rounded-full"></div>
          <div className="bg-black h-2 w-[90%] rounded-full"></div>
          <div className="bg-black h-2 w-[90%] rounded-full"></div>
        </div>
      </div>

      {/* Payment Details Section */}
      <div className="mb-6">
        <h3 className="text-base text-gray-800 mb-2 font-semibold">Payment details</h3>
        <div className="bg-[#d9d9d9] p-4 rounded-lg flex flex-col gap-2.5">
          <div className="bg-black h-2 w-2/5 rounded-full"></div>
          <div className="bg-black h-2 w-[90%] rounded-full"></div>
          <div className="bg-black h-2 w-[90%] rounded-full"></div>
        </div>
      </div>

      {/* Additional Section */}
      <div className="mb-6">
        <div className="bg-black h-2 w-1/3 rounded-full mb-2"></div>
        <div className="bg-[#d9d9d9] p-4 rounded-lg flex flex-col gap-2.5">
          <div className="bg-black h-2 w-2/5 rounded-full"></div>
          <div className="bg-black h-2 w-[90%] rounded-full"></div>
          <div className="bg-black h-2 w-[90%] rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
