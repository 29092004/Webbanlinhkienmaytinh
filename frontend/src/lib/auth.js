const ACCESS_TOKEN_KEY = "auth_access_token";
const USER_KEY = "auth_user";
const PENDING_REGISTER_KEY = "pending_register";
const OTP_AUTO_SENT_KEY = "pending_register_otp_sent_for";
const AUTH_STATE_EVENT = "auth-state-changed";

function notifyAuthStateChanged() {
  window.dispatchEvent(new Event(AUTH_STATE_EVENT));
}

function decodeJwtPayload(token) {
  if (!token || typeof token !== "string") {
    return null;
  }

  const parts = token.split(".");

  if (parts.length !== 3) {
    return null;
  }

  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const normalized = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    const payload = atob(normalized);
    return JSON.parse(payload);
  } catch {
    return null;
  }
}

function isAccessTokenExpired(token) {
  const payload = decodeJwtPayload(token);

  if (!payload?.exp) {
    return true;
  }

  return payload.exp * 1000 <= Date.now();
}

export function saveAuthSession({ accessToken, user }) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  notifyAuthStateChanged();
}

export function clearAuthSession() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  notifyAuthStateChanged();
}

export function getAccessToken() {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);

  if (!token) {
    return null;
  }

  if (isAccessTokenExpired(token)) {
    clearAuthSession();
    return null;
  }

  return token;
}

export function getStoredUser() {
  if (!getAccessToken()) {
    return null;
  }

  const rawUser = localStorage.getItem(USER_KEY);

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser);
  } catch {
    clearAuthSession();
    return null;
  }
}

export function isAuthenticated() {
  return Boolean(getAccessToken());
}

export function savePendingRegistration(data) {
  sessionStorage.setItem(PENDING_REGISTER_KEY, JSON.stringify(data));
}

export function getPendingRegistration() {
  const rawData = sessionStorage.getItem(PENDING_REGISTER_KEY);

  if (!rawData) {
    return null;
  }

  try {
    return JSON.parse(rawData);
  } catch {
    clearPendingRegistration();
    return null;
  }
}

export function clearPendingRegistration() {
  sessionStorage.removeItem(PENDING_REGISTER_KEY);
  clearOtpAutoSentState();
}

export function subscribeToAuthState(callback) {
  window.addEventListener(AUTH_STATE_EVENT, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(AUTH_STATE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function markOtpAutoSent(username) {
  sessionStorage.setItem(OTP_AUTO_SENT_KEY, username);
}

export function hasOtpBeenAutoSent(username) {
  return sessionStorage.getItem(OTP_AUTO_SENT_KEY) === username;
}

export function clearOtpAutoSentState() {
  sessionStorage.removeItem(OTP_AUTO_SENT_KEY);
}

export function getPostLoginRoute(role) {
  return role === "admin" ? "/admin" : "/";
}
