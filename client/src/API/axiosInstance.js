// axiosInstance.ts
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://10.0.13.211:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to attach token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers["Authorization"] = `${token}`;
      console.log("Token added to headers");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
