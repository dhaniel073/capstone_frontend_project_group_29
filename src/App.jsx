import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import Home from "./Home";
import Cart from "./Cart";
import AddProduct from "./AddProduct";
import AdminRegister from "./AdminRegister";
import Profile from "./Profile"; // Adjust path as needed

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/admin/add-product" element={<AddProduct />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
