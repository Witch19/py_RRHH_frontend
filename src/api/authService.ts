/*import axios from "axios";

const API = axios.create({
  baseURL: "http://65.38.96.125:3005"//"http://localhost:3005"
});

/* ----- Agrega automáticamente el token en cada petición ----- /
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;*/
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3005"
});
console.log("API base URL:", import.meta.env.VITE_API_URL || "http://localhost:3005")

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
