// src/api/authService.ts
import axios from "axios";

const API = axios.create({
  baseURL: "http://65.38.96.125:3005", // tu URL de backend
  withCredentials: false, // no es necesario si usas token, no cookies
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  

  return config;
});



export default API;
