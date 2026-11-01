import axios from "axios";

export const axiosInstance = axios.create({
  // ORIGINAL IMPLEMENTATION – PRESERVED FOR REFERENCE
  // baseURL: "http://localhost:5000/api",
  // NEW IMPLEMENTATION – CONFIGURABLE API BASE URL
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
