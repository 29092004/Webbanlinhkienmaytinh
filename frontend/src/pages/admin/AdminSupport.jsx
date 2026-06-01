/* eslint-disable react-hooks/set-state-in-effect */
import { ImagePlus, MessageCircleMore, Send, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { AdminSidebar } from "@/components/admin/layout/AdminSidebar";
import {
  buildSupportMessageFormData,
  fetchAdminSupportConversations,
  fetchSupportMessages,
  formatSupportConversationTime,
  isSupportedImageFile,
  markSupportConversationRead,
  resolveSupportImageUrl,
  sendAdminSupportMessage,
} from "@/lib/support";
import { showToast } from "@/lib/toast";

const STICKY_SCROLL_THRESHOLD = 40;

function isNearBottom(element) {
  if (!element) {
    return true;
  }

  return element.scrollHeight - element.scrollTop - element.clientHeight <= STICKY_SCROLL_THRESHOLD;
}

function AdminSupport() {
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  const shouldStickToBottomRef = useRef(true);
  const previousMessageCountRef = useRef(0);
  const [conversations, setConversations] = useState([]);
  const [, setStats] = useState({
    pendingMessages: 0,
    waitingCustomers: 0,
  });
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const activeConversationSummary = useMemo(
    () => conversations.find((conversation) => conversation.id === activeConversationId) || activeConversation,
    [activeConversation, activeConversationId, conversations]
  );

  const loadConversations = async ({ silent = false } = {}) => {
    try {
      if (!silent) {
        setIsLoadingList(true);
      }

      const { conversations: nextConversations, stats: nextStats } = await fetchAdminSupportConversations();
      setConversations(nextConversations);
      setStats(nextStats);
    } catch (error) {
      if (!silent) {
        showToast({
          message: error.response?.data?.message || "Không tải được danh sách chat hỗ trợ.",
          type: "error",
        });
      }
    } finally {
      if (!silent) {
        setIsLoadingList(false);
      }
    }
  };

  const loadMessages = async (conversationId) => {
    if (!conversationId) {
      setActiveConversation(null);
      setMessages([]);
      return;
    }

    try {
      setIsLoadingMessages(true);
      const { conversation: nextConversation, messages: nextMessages } = await fetchSupportMessages(conversationId);
      setActiveConversation(nextConversation);
      setMessages(nextMessages);

      if (Number(nextConversation?.unreadForAdmin || 0) > 0) {
        await markSupportConversationRead(conversationId);
        setConversations((current) =>
          current.map((conversation) =>
            conversation.id === conversationId ? { ...conversation, unreadForAdmin: 0 } : conversation
          )
        );
        setStats((current) => ({
          ...current,
          pendingMessages: Math.max(0, current.pendingMessages - Number(nextConversation.unreadForAdmin || 0)),
          waitingCustomers: Math.max(
            0,
            current.waitingCustomers - (Number(nextConversation.unreadForAdmin || 0) > 0 ? 1 : 0)
          ),
        }));
        setActiveConversation((current) => (current ? { ...current, unreadForAdmin: 0 } : current));
      }
    } catch (error) {
      showToast({
        message: error.response?.data?.message || "Không tải được nội dung cuộc trò chuyện.",
        type: "error",
      });
    } finally {
      setIsLoadingMessages(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      loadConversations({ silent: true });

      if (activeConversationId) {
        loadMessages(activeConversationId);
      }
    }, 6000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [activeConversationId]);

  useEffect(() => {
    const hasNewMessage = messages.length > previousMessageCountRef.current;
    const shouldAutoScroll = shouldStickToBottomRef.current || hasNewMessage;

    if (shouldAutoScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: hasNewMessage ? "smooth" : "auto", block: "end" });
    }

    previousMessageCountRef.current = messages.length;
  }, [messages]);

  useEffect(() => {
    previousMessageCountRef.current = 0;
    shouldStickToBottomRef.current = true;
  }, [activeConversationId]);

  const handleSelectConversation = (conversationId) => {
    setActiveConversationId(conversationId);
    loadMessages(conversationId);
  };

  const handleSendMessage = async (event) => {
    event.preventDefault();

    const content = draft.trim();

    if (!activeConversationId || (!content && !selectedImage) || isSending) {
      return;
    }

    setIsSending(true);

    try {
      const formData = buildSupportMessageFormData({ content, imageFile: selectedImage });
      const { conversation: nextConversation } = await sendAdminSupportMessage(activeConversationId, formData);

      setDraft("");
      setSelectedImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setActiveConversation(nextConversation);
      setConversations((current) =>
        current
          .map((conversation) =>
            conversation.id === activeConversationId ? { ...conversation, ...nextConversation } : conversation
          )
          .sort((left, right) => new Date(right.lastMessageAt) - new Date(left.lastMessageAt))
      );
      await loadMessages(activeConversationId);
    } catch (error) {
      showToast({
        message: error.response?.data?.message || "Không gửi được phản hồi cho khách hàng.",
        type: "error",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0] || null;

    if (!file) {
      setSelectedImage(null);
      return;
    }

    if (!isSupportedImageFile(file)) {
      showToast({ message: "Chỉ có thể gửi file ảnh.", type: "error" });
      event.target.value = "";
      return;
    }

    setSelectedImage(file);
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] font-sans flex">
      <AdminSidebar />

      <div className="relative ml-[290px] flex min-h-screen flex-1 flex-col">
        <main className="w-full flex-grow px-7 py-6">
          <section className="rounded-[24px] border border-[#dbe3ef] bg-white px-7 py-6 shadow-[0_10px_35px_rgba(15,23,42,0.04)]">
            <div className="grid gap-6 xl:grid-cols-[370px_minmax(0,1fr)]">
              <div className="overflow-hidden rounded-[24px] border border-[#dbe3ef] bg-[#fbfdff] shadow-sm">
                <div className="max-h-[620px] overflow-y-auto">
                  {isLoadingList ? (
                    <div className="px-5 py-12 text-center text-sm text-slate-500">Đang tải danh sách chat...</div>
                  ) : conversations.length > 0 ? (
                    conversations.map((conversation) => {
                      const isActive = conversation.id === activeConversationId;

                      return (
                        <button
                          key={conversation.id}
                          type="button"
                          onClick={() => handleSelectConversation(conversation.id)}
                          className={`flex w-full items-start gap-3 border-b border-[#edf2f8] px-5 py-4 text-left transition ${
                            isActive ? "bg-[#eef6ff]" : "hover:bg-white"
                          }`}
                        >
                          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-sm font-black text-white">
                            {(conversation.participant?.displayName || conversation.participant?.username || "K")
                              .slice(0, 1)
                              .toUpperCase()}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="truncate text-sm font-bold text-slate-950">
                                  {conversation.participant?.displayName || conversation.participant?.username || "Khách hàng"}
                                </p>
                                <p className="mt-1 truncate text-xs text-slate-500">
                                  {conversation.participant?.email || conversation.participant?.username || "Không có email"}
                                </p>
                              </div>
                              <div className="shrink-0 text-right">
                                <p className="text-[11px] font-medium text-slate-400">
                                  {formatSupportConversationTime(conversation.lastMessageAt)}
                                </p>
                                {Number(conversation.unreadForAdmin || 0) > 0 ? (
                                  <span className="mt-2 inline-flex min-w-[24px] items-center justify-center rounded-full bg-rose-500 px-2 py-1 text-[11px] font-black leading-none text-white">
                                    {conversation.unreadForAdmin}
                                  </span>
                                ) : null}
                              </div>
                            </div>
                            <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
                              {conversation.lastMessagePreview || "Chưa có nội dung"}
                            </p>
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <div className="px-5 py-12 text-center text-sm text-slate-500">
                      Chưa có cuộc trò chuyện nào được tạo.
                    </div>
                  )}
                </div>
              </div>

              <div className="overflow-hidden rounded-[26px] border border-[#dbe3ef] bg-white shadow-sm">
                {activeConversationSummary ? (
                  <>
                    <div className="border-b border-[#e5edf7] bg-white px-6 py-5 text-slate-950">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                            Đang hỗ trợ
                          </p>
                          <h3 className="mt-2 text-xl font-black tracking-[-0.02em] text-slate-950">
                            {activeConversationSummary.participant?.displayName || activeConversationSummary.participant?.username || "Khách hàng"}
                          </h3>
                          <p className="mt-1 text-sm text-slate-500">
                            {activeConversationSummary.participant?.email || "Không có email"}{" "}
                            {activeConversationSummary.participant?.phone ? `• ${activeConversationSummary.participant.phone}` : ""}
                          </p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right">
                          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Tin nhắn cuối</p>
                          <p className="mt-1 text-sm font-semibold text-slate-950">
                            {formatSupportConversationTime(activeConversationSummary.lastMessageAt)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[linear-gradient(180deg,#f7fbff_0%,#ffffff_18%)] px-5 py-5">
                      <div
                        ref={messagesContainerRef}
                        onScroll={() => {
                          shouldStickToBottomRef.current = isNearBottom(messagesContainerRef.current);
                        }}
                        className="h-[430px] overflow-y-auto rounded-[22px] border border-[#e8eef6] bg-white px-4 py-4"
                      >
                        {isLoadingMessages ? (
                          <div className="flex h-full items-center justify-center text-sm text-slate-500">
                            Đang tải nội dung cuộc trò chuyện...
                          </div>
                        ) : messages.length > 0 ? (
                          <div className="space-y-3">
                            {messages.map((message) => {
                              const isCustomer = message.senderRole === "user";

                              return (
                                <div
                                  key={message.id}
                                  className={`flex ${isCustomer ? "justify-start" : "justify-end"}`}
                                >
                                  <div
                                    className="max-w-[78%] rounded-[20px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm"
                                  >
                                    {message.imageUrl ? (
                                      <a
                                        href={resolveSupportImageUrl(message.imageUrl)}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="mb-2 block overflow-hidden rounded-2xl"
                                      >
                                        <img
                                          src={resolveSupportImageUrl(message.imageUrl)}
                                          alt={message.imageName || "Ảnh chat"}
                                          className="max-h-64 w-full rounded-2xl object-cover"
                                        />
                                      </a>
                                    ) : null}
                                    <p className="whitespace-pre-wrap break-words leading-6">{message.content}</p>
                                    <p
                                      className="mt-2 text-[11px] font-medium text-slate-400"
                                    >
                                      {message.senderName || (isCustomer ? "Khách hàng" : "Admin")} •{" "}
                                      {formatSupportConversationTime(message.createdAt)}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                            <div ref={messagesEndRef} />
                          </div>
                        ) : (
                          <div className="flex h-full items-center justify-center text-sm text-slate-500">
                            Cuộc trò chuyện này chưa có tin nhắn.
                          </div>
                        )}
                      </div>

                      {selectedImage ? (
                        <div className="mt-4 flex items-center justify-between rounded-2xl border border-[#dbeafe] bg-[#eff6ff] px-4 py-3 text-sm text-slate-700">
                          <span className="truncate pr-3">{selectedImage.name}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedImage(null);
                              if (fileInputRef.current) {
                                fileInputRef.current.value = "";
                              }
                            }}
                            className="inline-flex items-center gap-1 text-xs font-bold text-rose-500"
                          >
                            <X className="size-3.5" />
                            Bỏ ảnh
                          </button>
                        </div>
                      ) : null}

                      <form onSubmit={handleSendMessage} className="mt-4 flex gap-3 rounded-[22px] border border-[#dbe3ef] bg-white p-3 shadow-sm">
                        <label className="flex size-[54px] shrink-0 cursor-pointer items-center justify-center rounded-[18px] bg-slate-100 text-slate-600 transition hover:bg-slate-200">
                          <ImagePlus className="size-4" />
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </label>
                        <textarea
                          value={draft}
                          onChange={(event) => setDraft(event.target.value)}
                          rows={1}
                          placeholder="Nhập phản hồi cho khách hàng..."
                          className="max-h-28 min-h-[54px] flex-1 resize-none rounded-[18px] border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                        />
                        <button
                          type="submit"
                          disabled={isSending || (!draft.trim() && !selectedImage)}
                          className="flex size-[54px] shrink-0 items-center justify-center rounded-[18px] bg-slate-950 text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
                          aria-label="Gửi phản hồi"
                        >
                          <Send className="size-4" />
                        </button>
                      </form>
                    </div>
                  </>
                ) : (
                  <div className="flex min-h-[620px] flex-col items-center justify-center bg-[radial-gradient(circle_at_top,#dbeafe,transparent_30%),#ffffff] px-8 text-center">
                    <div className="flex size-16 items-center justify-center rounded-3xl bg-[#eef4ff] text-[#2563eb]">
                      <MessageCircleMore className="size-7" />
                    </div>
                    <h3 className="mt-5 text-xl font-bold text-slate-950">Chọn một khách hàng để mở cuộc trò chuyện</h3>
                    <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">
                      Danh sách bên trái chỉ hiển thị tóm tắt. Khi bạn bấm vào một người dùng, hệ thống mới tải toàn bộ tin nhắn của họ.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default AdminSupport;
