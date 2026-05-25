import { api } from "@/lib/api";
import { getStoredUser, isAuthenticated } from "@/lib/auth";

const GUEST_CART_KEY = "guest_cart_items";
const CART_STATE_EVENT = "cart-state-changed";

const normalizeGuestCartItems = (value) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => ({
      productId: Number(item?.productId || item?.product_id || 0),
      quantity: Number(item?.quantity || 0),
    }))
    .filter((item) => item.productId > 0 && item.quantity > 0);
};

export const getGuestCartItems = () => {
  try {
    const rawValue = localStorage.getItem(GUEST_CART_KEY);

    if (!rawValue) {
      return [];
    }

    return normalizeGuestCartItems(JSON.parse(rawValue));
  } catch {
    return [];
  }
};

export const saveGuestCartItems = (items) => {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(normalizeGuestCartItems(items)));
  window.dispatchEvent(new Event(CART_STATE_EVENT));
};

export const updateGuestCartItemQuantity = (productId, quantity) => {
  const numericProductId = Number(productId);
  const numericQuantity = Number(quantity);

  if (numericProductId <= 0) {
    return [];
  }

  const currentItems = getGuestCartItems();
  const nextItems =
    numericQuantity <= 0
      ? currentItems.filter((item) => item.productId !== numericProductId)
      : currentItems.map((item) =>
          item.productId === numericProductId ? { ...item, quantity: numericQuantity } : item
        );

  saveGuestCartItems(nextItems);
  return nextItems;
};

export const removeGuestCartItem = (productId) => {
  const numericProductId = Number(productId);
  const nextItems = getGuestCartItems().filter((item) => item.productId !== numericProductId);
  saveGuestCartItems(nextItems);
  return nextItems;
};

export const addGuestCartItem = (productId, quantity = 1) => {
  const numericProductId = Number(productId);
  const numericQuantity = Number(quantity);

  if (numericProductId <= 0 || numericQuantity <= 0) {
    return getGuestCartItems();
  }

  const currentItems = getGuestCartItems();
  const existingItem = currentItems.find((item) => item.productId === numericProductId);

  const nextItems = existingItem
    ? currentItems.map((item) =>
        item.productId === numericProductId
          ? { ...item, quantity: item.quantity + numericQuantity }
          : item
      )
    : [...currentItems, { productId: numericProductId, quantity: numericQuantity }];

  saveGuestCartItems(nextItems);
  return nextItems;
};

export const clearGuestCart = () => {
  localStorage.removeItem(GUEST_CART_KEY);
  window.dispatchEvent(new Event(CART_STATE_EVENT));
};

export const clearServerCart = async (customerId) => {
  const numericCustomerId = Number(customerId);

  if (numericCustomerId <= 0) {
    return;
  }

  const entries = await fetchServerCartEntries(numericCustomerId);

  await Promise.all(
    entries.map((entry) => api.delete(`/carts/${entry.id}`))
  );

  notifyCartStateChanged();
};

export const notifyCartStateChanged = () => {
  window.dispatchEvent(new Event(CART_STATE_EVENT));
};

export const subscribeToCartState = (callback) => {
  window.addEventListener(CART_STATE_EVENT, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(CART_STATE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
};

export const getGuestCartCount = () =>
  getGuestCartItems().reduce((sum, item) => sum + Number(item.quantity || 0), 0);

export const getServerCartCount = async (customerId) => {
  const entries = await fetchServerCartEntries(customerId);

  return entries.reduce(
    (sum, entry) =>
      sum +
      (entry.items || []).reduce(
        (entrySum, item) => entrySum + Number(item.quantity || 0),
        0
      ),
    0
  );
};

export const fetchServerCartEntries = async (customerId) => {
  const response = await api.get(`/carts/customer/${customerId}`);
  return Array.isArray(response.data?.data) ? response.data.data : [];
};

export const addProductToCart = async ({ productId, quantity = 1 }) => {
  const numericProductId = Number(productId);
  const numericQuantity = Number(quantity);

  if (numericProductId <= 0 || numericQuantity <= 0) {
    return { mode: "noop" };
  }

  if (!isAuthenticated()) {
    const guestItems = addGuestCartItem(numericProductId, numericQuantity);
    return { mode: "guest", guestItems };
  }

  const user = getStoredUser();
  const customerId = Number(user?.id || 0);

  if (!customerId) {
    const guestItems = addGuestCartItem(numericProductId, numericQuantity);
    return { mode: "guest", guestItems };
  }

  const entries = await fetchServerCartEntries(customerId);
  const existingEntry = entries.find((entry) =>
    (entry.items || []).some((item) => Number(item.product_id) === numericProductId)
  );

  if (existingEntry) {
    const existingItem = (existingEntry.items || []).find((item) => Number(item.product_id) === numericProductId);
    const nextQuantity = Number(existingItem?.quantity || 0) + numericQuantity;

    await api.put(`/carts/${existingEntry.id}`, {
      customerId,
      items: [
        {
          productId: numericProductId,
          quantity: nextQuantity,
        },
      ],
    });

    notifyCartStateChanged();

    return { mode: "server", customerId, cartId: existingEntry.id, quantity: nextQuantity };
  }

  const response = await api.post("/carts", {
    customerId,
    items: [
      {
        productId: numericProductId,
        quantity: numericQuantity,
      },
    ],
  });

  notifyCartStateChanged();

  return { mode: "server", customerId, cartId: response.data?.cartId, quantity: numericQuantity };
};
