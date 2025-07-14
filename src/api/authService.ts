import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3005", // tu URL de backend
  withCredentials: false, // no es necesario si usas token, no cookies
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Asegura que el contenido sea JSON
  config.headers["Content-Type"] = "application/json";

  console.log("🔐 token:", token);
  return config;
});

export default API;
