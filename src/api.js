import axios from "axios";

// 1. Axios instance with the correct /api/v1 prefix
const API = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor automatically attaches token to every authenticated request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- AUTH API ---
export const loginUser = async (credentials) => {
  const response = await API.post("/auth/login", credentials);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await API.post("/auth/register", userData);
  return response.data;
};

// --- PRODUCTS API ---
export const getProducts = async (params = {}) => {
  const response = await API.get("/products", { params });
  return response.data;
};

export const getProductById = async (id) => {
  const response = await API.get(`/products/${id}`);
  return response.data;
};

// For creating a product with image upload via Multer/Cloudinary
export const createProduct = async (formData) => {
  const response = await API.post("/products", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// --- CHECKOUT & PAYMENT API ---
export const initializeCheckout = async (checkoutData) => {
  const response = await API.post("/checkout/initialize", checkoutData);
  return response.data;
};

export const verifyPayment = async (reference) => {
  const response = await API.get(`/checkout/verify/${reference}`);
  return response.data;
};

export default API;
