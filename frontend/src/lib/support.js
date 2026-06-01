import { API_BASE_ORIGIN, api } from "@/lib/api";

export function formatSupportConversationTime(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    ...(isToday ? {} : { day: "2-digit", month: "2-digit" }),
  }).format(date);
}

export function resolveSupportImageUrl(value) {
  if (!value) {
    return "";
  }

  if (/^(https?:\/\/|data:)/i.test(value)) {
    return value;
  }

  return `${API_BASE_ORIGIN}${value}`;
}

export function isSupportedImageFile(file) {
  return Boolean(file?.type?.startsWith("image/"));
}

export function buildSupportMessageFormData({ content, imageFile }) {
  const formData = new FormData();

  if (content) {
    formData.append("content", content);
  }

  if (imageFile) {
    formData.append("supportImage", imageFile);
  }

  return formData;
}

export async function fetchAdminSupportConversations() {
  const response = await api.get("/support/conversations/admin");
  const conversations = Array.isArray(response.data?.data) ? response.data.data : [];
  const meta = response.data?.meta || {};

  return {
    conversations,
    stats: {
      pendingMessages: Number(meta.pendingMessages || 0),
      waitingCustomers: Number(meta.waitingCustomers || 0),
    },
  };
}

export async function fetchSupportConversationSummary() {
  const response = await api.get("/support/conversations/me");
  return response.data?.data || null;
}

export async function fetchSupportMessages(conversationId) {
  const response = await api.get(`/support/conversations/${conversationId}/messages`);

  return {
    conversation: response.data?.data?.conversation || null,
    messages: Array.isArray(response.data?.data?.messages) ? response.data.data.messages : [],
  };
}

export async function markSupportConversationRead(conversationId) {
  await api.patch(`/support/conversations/${conversationId}/read`);
}

export async function sendAdminSupportMessage(conversationId, formData) {
  const response = await api.post(`/support/conversations/${conversationId}/messages`, formData);

  return {
    conversation: response.data?.data?.conversation || null,
  };
}

export async function sendUserSupportMessage(formData) {
  const response = await api.post("/support/conversations", formData);

  return {
    conversation: response.data?.data?.conversation || null,
  };
}

export async function deleteSupportMessage(conversationId, messageId) {
  const response = await api.delete(`/support/conversations/${conversationId}/messages/${messageId}`);

  return {
    conversation: response.data?.data?.conversation || null,
    messages: Array.isArray(response.data?.data?.messages) ? response.data.data.messages : [],
    deletedMessageId: response.data?.data?.deletedMessageId || null,
  };
}
