import axios from "axios";

import { getAccessToken, notifySessionExpired } from "@/lib/auth";

function normalizeApiBaseUrl(rawValue) {
  const fallback = import.meta.env.PROD ? "/api" : "http://localhost:9000/api";
  const trimmedValue = rawValue?.trim();

  if (!trimmedValue) {
    return fallback;
  }

  const normalizedValue = trimmedValue.replace(/\/+$/, "");

  if (/\/api$/i.test(normalizedValue)) {
    return normalizedValue;
  }

  return `${normalizedValue}/api`;
}

const API_BASE_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_URL);
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
