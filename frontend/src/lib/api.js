import axios from "axios";

import { getAccessToken, notifySessionExpired } from "@/lib/auth";

const API_BASE_URL =
  import.meta.env.VITE_API_URL?.trim() ||
  (import.meta.env.PROD ? "/api" : "http://localhost:9000/api");
export const API_BASE_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = String(error.config?.url || "");
    const isAuthRoute = requestUrl.includes("/auth/login") || requestUrl.includes("/auth/register") || requestUrl.includes("/auth/google") || requestUrl.includes("/auth/logout");

    if (status === 401 && !isAuthRoute) {
      notifySessionExpired();
    }

    return Promise.reject(error);
  }
);
