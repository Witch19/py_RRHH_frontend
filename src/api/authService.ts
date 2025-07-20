// src/api/authService.ts
import axios from "axios";

const API = axios.create({
  baseURL: "https://nestjs-rrhh-backend-api.desarrollo-software.xyz",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
