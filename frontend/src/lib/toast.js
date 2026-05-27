const TOAST_EVENT = "app-toast";
const TOAST_DEDUP_WINDOW_MS = 2000;

let lastToastSignature = "";
let lastToastShownAt = 0;

export const showToast = ({ message, type = "success", duration = 2500 }) => {
  const toastSignature = `${type}:${String(message || "").trim()}`;
  const now = Date.now();

  if (
    toastSignature &&
    toastSignature === lastToastSignature &&
    now - lastToastShownAt < TOAST_DEDUP_WINDOW_MS
  ) {
    return;
  }

  lastToastSignature = toastSignature;
  lastToastShownAt = now;

  window.dispatchEvent(
    new CustomEvent(TOAST_EVENT, {
      detail: {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        message,
        type,
        duration,
      },
    })
  );
};

export const subscribeToToasts = (callback) => {
  const handler = (event) => callback(event.detail);
  window.addEventListener(TOAST_EVENT, handler);

  return () => {
    window.removeEventListener(TOAST_EVENT, handler);
  };
};
