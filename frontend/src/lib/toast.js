const TOAST_EVENT = "app-toast";

export const showToast = ({ message, type = "success", duration = 2500 }) => {
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
