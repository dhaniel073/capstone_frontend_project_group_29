import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginUser = async (credentials) => {
  const response = await API.post("/auth/login", credentials);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await API.post("/auth/register", userData);
  return response.data;
};

export const getProducts = async (params = {}) => {
  const response = await API.get("/products", { params });
  return response.data;
};

export const getProductById = async (id) => {
  const response = await API.get(`/products/${id}`);
  return response.data;
};

export const createProduct = async (formData) => {
  const response = await API.post("/products", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getCart = async () => {
  const response = await API.get("/cart");
  return response.data;
};

export const addOneToCart = async (productId) => {
  const response = await API.post(`/cart/add-one/${productId}`);
  return response.data;
};

export const removeOneFromCart = async (productId) => {
  const response = await API.post(`/cart/remove-one/${productId}`);
  return response.data;
};

export const deleteFromCart = async (productId) => {
  const response = await API.delete(`/cart/${productId}`);
  return response.data;
};

export const initializeCheckout = async (checkoutData) => {
  const response = await API.post("/checkout/initialize", checkoutData);
  return response.data;
};

export const verifyPayment = async (reference) => {
  const response = await API.get(`/checkout/verify/${reference}`);
  return response.data;
};

export default API;
