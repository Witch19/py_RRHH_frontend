import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3005", // Ajusta si es necesario
});

// Agrega automáticamente el token en cada petición
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
