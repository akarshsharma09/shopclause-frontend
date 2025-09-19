import axios from "axios";

// baseURL from .env (Step 3)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // agar cookies use karni ho
});

// 🔐 JWT token automatically add
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Response me expiry handle karna
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // Token expire ya invalid
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/"; // ya /login
    }
    return Promise.reject(err);
  }
);

export default api;
