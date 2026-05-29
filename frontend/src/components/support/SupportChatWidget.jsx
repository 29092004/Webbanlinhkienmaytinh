import { Headset, ImagePlus, MessageCircle, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import { getStoredUser, subscribeToAuthState } from "@/lib/auth";
import {
  buildSupportMessageFormData,
  fetchSupportConversationSummary,
  fetchSupportMessages,
  formatSupportConversationTime,
  isSupportedImageFile,
  markSupportConversationRead,
  resolveSupportImageUrl,
  sendUserSupportMessage,
} from "@/lib/support";
import { showToast } from "@/lib/toast";

const STICKY_SCROLL_THRESHOLD = 40;

function isNearBottom(element) {
  if (!element) {
    return true;
  }

  return element.scrollHeight - element.scrollTop - element.clientHeight <= STICKY_SCROLL_THRESHOLD;
}

export function SupportChatWidget() {
  const location = useLocation();
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  const shouldStickToBottomRef = useRef(true);
  const previousMessageCountRef = useRef(0);
  const [authUser, setAuthUser] = useState(() => getStoredUser());
  const [isOpen, setIsOpen] = useState(false);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isBootstrapping, setIsBootstrapping] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const isAdminArea = location.pathname.startsWith("/admin");
  const isAuthRoute = ["/login", "/register", "/otp"].includes(location.pathname);
  const isVisible = authUser?.role === "user" && !isAdminArea && !isAuthRoute;

  useEffect(() => {
    return subscribeToAuthState(() => {
      setAuthUser(getStoredUser());
    });
  }, []);

  const loadConversation = async ({ withMessages = false } = {}) => {
    try {
      if (withMessages) {
        setIsBootstrapping(true);
      }

      const nextConversation = await fetchSupportConversationSummary();
      setConversation(nextConversation);

      if (withMessages && nextConversation?.id) {
        setIsLoadingMessages(true);
        const { conversation: detailedConversation, messages: nextMessages } = await fetchSupportMessages(nextConversation.id);
        setConversation(detailedConversation || nextConversation);
        setMessages(nextMessages);

        if (Number(nextConversation.unreadForUser || 0) > 0) {
          await markSupportConversationRead(nextConversation.id);
          setConversation((current) => (current ? { ...current, unreadForUser: 0 } : current));
        }
      } else if (withMessages) {
        setMessages([]);
      }
    } catch (error) {
      console.error("Failed to load support conversation", error);
    } finally {
      setIsBootstrapping(false);
      setIsLoadingMessages(false);
    }
  };

  useEffect(() => {
    if (!isVisible) {
      setIsOpen(false);
      setConversation(null);
      setMessages([]);
      return undefined;
    }

    loadConversation();

    const intervalId = window.setInterval(() => {
      loadConversation({ withMessages: isOpen });
    }, isOpen ? 6000 : 12000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isVisible, isOpen]);

  useEffect(() => {
    if (!isOpen || !isVisible) {
      return;
    }

    loadConversation({ withMessages: true });
  }, [isOpen, isVisible]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const hasNewMessage = messages.length > previousMessageCountRef.current;
    const shouldAutoScroll = shouldStickToBottomRef.current || hasNewMessage;

    if (shouldAutoScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: hasNewMessage ? "smooth" : "auto", block: "end" });
    }

    previousMessageCountRef.current = messages.length;
  }, [isOpen, messages]);

  useEffect(() => {
    if (!isOpen) {
      previousMessageCountRef.current = 0;
      shouldStickToBottomRef.current = true;
      return;
    }

    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [isOpen]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const content = draft.trim();

    if ((!content && !selectedImage) || isSending) {
      return;
    }

    setIsSending(true);

    try {
      const formData = buildSupportMessageFormData({ content, imageFile: selectedImage });
      const { conversation: nextConversation } = await sendUserSupportMessage(formData);

      setConversation(nextConversation);
      setDraft("");
      setSelectedImage(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      await loadConversation({ withMessages: true });
    } catch (error) {
      showToast({
        message: error.response?.data?.message || "Không gửi được tin nhắn hỗ trợ.",
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

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-5 right-5 z-[70] flex flex-col items-end gap-3">
      {isOpen ? (
        <div className="w-[calc(100vw-24px)] max-w-[340px] overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.14)]">
          <div className="border-b border-slate-200 bg-white px-4 py-3 text-slate-950">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">
                  EXO CORE Support
                </p>
                
                <p className="mt-1 text-sm text-slate-500">Nhắn với đội ngũ hỗ trợ tại đây.</p>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex size-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700"
                aria-label="Đóng chat"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          <div className="bg-[radial-gradient(circle_at_top,#e0f2fe,transparent_38%),linear-gradient(180deg,#f8fcff_0%,#ffffff_30%)] px-4 py-3">
            <div
              ref={messagesContainerRef}
              onScroll={() => {
                shouldStickToBottomRef.current = isNearBottom(messagesContainerRef.current);
              }}
              className="h-[240px] overflow-y-auto rounded-[22px] border border-slate-100 bg-white/90 px-3 py-3 shadow-inner sm:h-[260px]"
            >
              {isBootstrapping || isLoadingMessages ? (
                <div className="flex h-full items-center justify-center text-sm font-medium text-slate-500">
                  Đang tải cuộc trò chuyện...
                </div>
              ) : messages.length > 0 ? (
                <div className="space-y-3">
                  {messages.map((message) => {
                    const isUserMessage = message.senderRole === "user";

                    return (
                      <div
                        key={message.id}
                        className={`flex ${isUserMessage ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className="max-w-[82%] rounded-[20px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm"
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
                                className="max-h-56 w-full rounded-2xl object-cover"
                              />
                            </a>
                          ) : null}
                          <p className="whitespace-pre-wrap break-words leading-6">{message.content}</p>
                          <p
                            className="mt-2 text-[11px] font-medium text-slate-400"
                          >
                            {isUserMessage ? "Bạn" : message.senderName || "Hỗ trợ"} •{" "}
                            {formatSupportConversationTime(message.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center px-5 text-center text-slate-500">
                  <div className="flex size-14 items-center justify-center rounded-full bg-sky-50 text-sky-700">
                    <Headset className="size-6" />
                  </div>
                  <p className="mt-4 text-base font-bold text-slate-900">Bắt đầu cuộc trò chuyện mới</p>
                  <p className="mt-2 text-sm leading-6">
                    Hãy mô tả vấn đề của bạn, lịch sử chat sẽ được lưu lại để admin hỗ trợ tiếp khi cần.
                  </p>
                </div>
              )}
            </div>

            

            {selectedImage ? (
              <div className="mt-3 flex items-center justify-between rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-slate-700">
                <span className="truncate pr-3">{selectedImage.name}</span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedImage(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                  className="text-xs font-bold text-rose-500"
                >
                  Bỏ ảnh
                </button>
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="mt-3 flex gap-2 rounded-[22px] border border-slate-200 bg-white p-2 shadow-sm">
              <label className="flex size-[52px] shrink-0 cursor-pointer items-center justify-center rounded-[18px] bg-slate-100 text-slate-600 transition hover:bg-slate-200">
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
                placeholder="Nhập tin nhắn"
                className="max-h-28 min-h-[52px] flex-1 resize-none rounded-[18px] border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
              <button
                type="submit"
                disabled={isSending || (!draft.trim() && !selectedImage)}
                className="flex size-[52px] shrink-0 items-center justify-center rounded-[18px] bg-slate-950 text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Gửi tin nhắn"
              >
                <Send className="size-4" />
              </button>
            </form>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="group relative flex size-[68px] items-center justify-center rounded-full bg-[linear-gradient(135deg,#0f172a_0%,#0284c7_55%,#38bdf8_100%)] text-white shadow-[0_20px_45px_rgba(3,105,161,0.4)] transition hover:-translate-y-0.5"
        aria-label="Mở chat hỗ trợ"
      >
        <span className="absolute inset-0 rounded-full bg-white/0 transition group-hover:bg-white/6" />
        <MessageCircle className="relative size-7" />
        {Number(conversation?.unreadForUser || 0) > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 inline-flex min-w-[24px] items-center justify-center rounded-full border-2 border-white bg-rose-500 px-1.5 py-1 text-[11px] font-black leading-none text-white">
            {conversation.unreadForUser > 9 ? "9+" : conversation.unreadForUser}
          </span>
        ) : null}
      </button>
    </div>
  );
}
