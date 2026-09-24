import { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faPaperPlane, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../context/AuthContext";
import { chatApi } from "../api/chatApi";

function getEntityId(value) {
    if (!value) return "";
    if (typeof value === "string") return value;
    if (value._id) return String(value._id);
    if (value.id) return String(value.id);
    return String(value);
}

function ChatWidget() {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [draft, setDraft] = useState("");
    const [messages, setMessages] = useState([]);
    const [conversations, setConversations] = useState([]);
    const [conversationSearch, setConversationSearch] = useState("");
    const [activeCustomer, setActiveCustomer] = useState(null);
    const [productContext, setProductContext] = useState(null);
    const [adminsOnline, setAdminsOnline] = useState(false);
    const [onlineUserIds, setOnlineUserIds] = useState([]);
    const [typing, setTyping] = useState(false);
    const [error, setError] = useState("");
    const socketRef = useRef(null);
    const typingTimerRef = useRef(null);
    const handledMessageIdsRef = useRef(new Set());
    const messageInputRef = useRef(null);
    const messagesEndRef = useRef(null);
    const isAdmin = user?.role === "admin";
    const currentUserId = getEntityId(user);

    function formatMessageTime(value) {
        if (!value) return "";
        return new Date(value).toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
        });
    }

    const socketUrl = useMemo(() => {
        const apiUrl = import.meta.env.VITE_CLIENT_ORIGIN;
        return apiUrl ? new URL(apiUrl, window.location.origin).origin : window.location.origin;
    }, []);

    async function loadConversation(customerId, markAsRead = false) {
        try {
            const data = await chatApi.getMessages(customerId);

            if (markAsRead) {
                await chatApi.markRead(isAdmin ? customerId : "all");
                setMessages(
                    data.map((message) =>
                        getEntityId(message.sender) === currentUserId
                            ? message
                            : { ...message, read: true }
                    )
                );
            } else {
                setMessages(data);
            }
        } catch {
            setError("Unable to load chat history.");
        }
    }

    async function loadInbox() {
        try {
            setConversations(await chatApi.getConversations());
        } catch {
            setError("Unable to load customer conversations.");
        }
    }

    useEffect(() => {
        if (!isAuthenticated) return undefined;

        if (isAdmin) loadInbox();
        else loadConversation();

        const socket = io(socketUrl, {
            auth: { token: localStorage.getItem("token") },
            reconnection: true,
            reconnectionAttempts: Infinity,
        });
        socketRef.current = socket;

        socket.on("connect", () => {
            setError("");
            if (isAdmin) loadInbox();
            else loadConversation();
        });
        socket.on("connect_error", () => setError("Chat is reconnecting..."));
        socket.on("chat:presence", ({ adminsOnline: supportOnline, onlineUserIds: usersOnline }) => {
            setAdminsOnline(supportOnline);
            setOnlineUserIds(usersOnline || []);
        });
        socket.on("chat:typing", ({ customerId, isTyping }) => {
            if (!isAdmin || activeCustomer?.id === customerId) setTyping(isTyping);
        });
        socket.on("chat:message", (message) => {
            if (handledMessageIdsRef.current.has(message.id)) return;
            handledMessageIdsRef.current.add(message.id);
            setMessages((current) =>
                current.some((item) => item.id === message.id) ? current : [...current, message]
            );
            if (isAdmin && message.sender.role !== "admin") {
                setConversations((current) => {
                    const existing = current.find((item) => item.customer.id === message.sender.id);
                    if (existing) {
                        return current.map((item) =>
                            item.customer.id === message.sender.id
                                ? {
                                    ...item,
                                    latestMessage: message.text,
                                    updatedAt: message.createdAt,
                                    unreadCount: item.unreadCount + 1,
                                }
                                : item
                        );
                    }
                    return [
                        {
                            customer: message.sender,
                            latestMessage: message.text,
                            updatedAt: message.createdAt,
                            unreadCount: 1,
                        },
                        ...current,
                    ];
                });
                if (!activeCustomer) setActiveCustomer(message.sender);
            }
        });

        return () => {
            socket.disconnect();
            socketRef.current = null;
        };
    }, [isAuthenticated, isAdmin, socketUrl]);

    useEffect(() => {
        function handleChatOpen(event) {
            setProductContext(event.detail?.product || null);
            setIsOpen(true);
            if (!isAdmin) loadConversation(undefined, true);
        }

        window.addEventListener("chat:open", handleChatOpen);
        return () => window.removeEventListener("chat:open", handleChatOpen);
    }, []);

    useEffect(() => {
        if (isOpen) {
            messageInputRef.current?.focus();
        }
    }, [isOpen, isAdmin, activeCustomer?.id]);

    useEffect(() => {
        if (!isOpen) return;

        const frame = window.requestAnimationFrame(() => {
            messagesEndRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "end",
            });
        });

        return () => window.cancelAnimationFrame(frame);
    }, [messages, isOpen]);

    if (!isAuthenticated) return null;

    const visibleMessages =
        isAdmin && activeCustomer
            ? messages.filter(
                (message) =>
                    message.sender.id === activeCustomer.id ||
                    message.recipientId === activeCustomer.id
            )
            : messages;
    const activePartner = isAdmin
        ? Boolean(activeCustomer && onlineUserIds.includes(activeCustomer.id))
        : adminsOnline;
    const unreadCount = isAdmin
        ? conversations.reduce((total, item) => total + item.unreadCount, 0)
        : messages.filter((message) => !message.read && message.sender.id !== user.id).length;
    const filteredConversations = conversations.filter((conversation) =>
        `${conversation.customer.name} ${conversation.customer.email}`
            .toLowerCase()
            .includes(conversationSearch.toLowerCase())
    );

    async function selectCustomer(conversation) {
        setActiveCustomer(conversation.customer);
        setMessages([]);
        await loadConversation(conversation.customer.id, true);
        setConversations((current) =>
            current.map((item) =>
                item.customer.id === conversation.customer.id
                    ? { ...item, unreadCount: 0 }
                    : item
            )
        );
    }

    function sendTyping(isTyping) {
        if (!isAdmin && socketRef.current?.connected) {
            socketRef.current.emit("chat:typing", { isTyping });
            clearTimeout(typingTimerRef.current);
            if (isTyping) {
                typingTimerRef.current = setTimeout(
                    () => socketRef.current?.emit("chat:typing", { isTyping: false }),
                    1200
                );
            }
        }
    }

    function sendMessage(event) {
        event.preventDefault();
        const text = draft.trim();
        if (!text) return;
        if (!socketRef.current?.connected) return setError("Chat is unavailable right now.");

        socketRef.current.emit(
            "chat:send",
            {
                recipientId: isAdmin ? activeCustomer?.id : undefined,
                productId: productContext?.id,
                text,
            },
            (result) => {
                if (result?.error) setError(result.error);
                else {
                    setDraft("");
                    setProductContext(null);
                    setError("");
                }
            }
        );
    }

    async function toggleChat() {
        const opening = !isOpen;
        setIsOpen(opening);
        if (opening && !isAdmin) {
            await loadConversation(undefined, true);
        }
    }

    return (
        <div className="fixed bottom-5 right-5 z-40">
            {isOpen && (
                <section className="mb-3 flex h-[31rem] w-[min(28rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-xl border border-slate-300 bg-[#efeae2] shadow-2xl dark:border-slate-700 dark:bg-[#111b21]">
                    <header className="flex items-center justify-between bg-[#075e54] px-3 py-3 text-white">
                        <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#128c7e] text-sm font-semibold">
                                {(isAdmin ? activeCustomer?.name || "C" : "S").charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                                <h2 className="truncate font-semibold">
                                    {isAdmin ? activeCustomer?.name || "Customer chat" : "Shoply Support"}
                                </h2>
                                <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-300">
                                    <span
                                        className={`h-2 w-2 rounded-full ${activePartner ? "bg-[#25d366]" : "bg-slate-300"
                                            }`}
                                    />
                                    {isAdmin
                                        ? activeCustomer
                                            ? activePartner
                                                ? "Customer is active now"
                                                : "Customer is offline"
                                            : "Select a customer"
                                        : activePartner
                                            ? "Support is active now"
                                            : "Support is currently offline"}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            aria-label="Close chat"
                            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/10"
                        >
                            <FontAwesomeIcon icon={faXmark} />
                        </button>
                    </header>

                    {isAdmin && (
                        <div className="max-h-48 overflow-y-auto border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-[#202c33]">
                            <input
                                value={conversationSearch}
                                onChange={(event) => setConversationSearch(event.target.value)}
                                placeholder="Search customers"
                                className="m-2 w-[calc(100%-1rem)] rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs text-slate-800 outline-none placeholder:text-slate-400 dark:border-slate-700 dark:bg-[#111b21] dark:text-slate-100"
                            />
                            {filteredConversations.length === 0 ? (
                                <p className="p-3 text-xs text-slate-400">
                                    No customer conversations yet.
                                </p>
                            ) : (
                                filteredConversations.map((conversation) => (
                                    <button
                                        key={conversation.customer.id}
                                        onClick={() => selectCustomer(conversation)}
                                        className={`flex w-full items-center justify-between px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800 ${activeCustomer?.id === conversation.customer.id
                                            ? "bg-slate-100 dark:bg-green-800"
                                            : ""
                                            }`}
                                    >
                                        <span className="min-w-0">
                                            <span className="block truncate text-sm font-medium dark:text-white">
                                                {conversation.customer.name}
                                            </span>
                                            <span className="block truncate text-xs text-slate-400">
                                                {conversation.latestMessage}
                                            </span>
                                        </span>
                                        <span className="ml-2 flex items-center gap-1">
                                            {onlineUserIds.includes(conversation.customer.id) && (
                                                <i className="h-2 w-2 rounded-full bg-emerald-500" />
                                            )}
                                            {conversation.unreadCount > 0 && (
                                                <b className="rounded-full bg-red-500 px-1.5 text-[10px] text-white">
                                                    {conversation.unreadCount}
                                                </b>
                                            )}
                                        </span>
                                    </button>
                                ))
                            )}
                        </div>
                    )}

                    <div className="flex-1 space-y-2 overflow-y-auto bg-[#efeae2] p-3 dark:bg-[#17211b]">
                        {productContext && (
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-800">
                                <div className="flex items-center gap-2">
                                    {productContext.image && (
                                        <img
                                            src={productContext.image}
                                            alt=""
                                            className="h-10 w-10 rounded-lg object-cover"
                                        />
                                    )}
                                    <div className="min-w-0">
                                        <p className="truncate text-xs font-semibold dark:text-slate-200">
                                            {productContext.name}
                                        </p>
                                        <p className="text-xs text-slate-500">${productContext.price}</p>
                                    </div>
                                    <button
                                        onClick={() => setProductContext(null)}
                                        aria-label="Remove product reference"
                                        className="ml-auto text-slate-400"
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>
                        )}
                        {visibleMessages.length === 0 ? (
                            <p className="mt-20 text-center text-sm text-slate-400">
                                {isAdmin && !activeCustomer
                                    ? "Select a customer to start."
                                    : "Start the conversation."}
                            </p>
                        ) : (
                            visibleMessages.map((message) => {
                                const isMine = getEntityId(message.sender) === currentUserId;
                                return (
                                    <div
                                        key={message.id}
                                        className={`flex w-full ${isMine ? "justify-end" : "justify-start"
                                            }`}
                                    >
                                        <div className="w-fit max-w-[88%] sm:max-w-[75%]">
                                            <div
                                                className={`mb-1 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wide ${isMine
                                                    ? "justify-end text-slate-600 dark:text-slate-300"
                                                    : "justify-start text-slate-500 dark:text-slate-300"
                                                    }`}
                                            >
                                                <span
                                                    className={`rounded-full px-2 py-0.5 ${isMine
                                                        ? "bg-slate-700 text-white"
                                                        : "bg-green-200 text-slate-600 dark:bg-slate-700 dark:text-slate-200"
                                                        }`}
                                                >
                                                    {isMine
                                                        ? "You ·"
                                                        : `${message.sender.name} ·`}
                                                </span>
                                                <span className="normal-case tracking-normal">
                                                    {formatMessageTime(message.createdAt)}
                                                </span>
                                            </div>
                                            <div
                                                className={`rounded-2xl border px-3 py-2.5 text-sm leading-relaxed shadow-sm ${isMine
                                                    ? "rounded-br-md border-[#075e54] bg-[#005c4b] text-white"
                                                    : "rounded-bl-md border-slate-200 bg-white text-slate-800 dark:border-slate-600 dark:bg-[#202c33] dark:text-slate-100"
                                                    }`}
                                            >
                                                {message.product && (
                                                    <button
                                                        onClick={() =>
                                                            navigate(`/products/${message.product.id}`)
                                                        }
                                                        className="mb-1 block border-b border-current/20 pb-1 text-left text-xs font-semibold"
                                                    >
                                                        Product: {message.product.name}
                                                    </button>
                                                )}
                                                <p>{message.text}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                        {typing && (
                            <p className="text-xs italic text-slate-400">
                                {isAdmin ? "Customer is typing..." : "Admin is typing..."}
                            </p>
                        )}
                        <div ref={messagesEndRef} aria-hidden="true" />
                    </div>

                    <form
                        onSubmit={sendMessage}
                        className="border-t border-slate-200 bg-[#f0f2f5] p-2.5 dark:border-slate-700 dark:bg-[#202c33]"
                    >
                        {error && <p className="mb-2 px-2 text-xs text-red-500">{error}</p>}
                        <div className="flex gap-2">
                            <input
                                ref={messageInputRef}
                                value={draft}
                                onChange={(event) => {
                                    setDraft(event.target.value);
                                    sendTyping(true);
                                }}
                                disabled={isAdmin && !activeCustomer}
                                placeholder={
                                    isAdmin && !activeCustomer
                                        ? "Select a customer"
                                        : "Type a message"
                                }
                                className="min-w-0 flex-1 rounded-full border-0 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 dark:bg-[#2a3942] dark:text-white dark:placeholder:text-slate-400"
                                maxLength={1000}
                            />
                            <button
                                type="submit"
                                aria-label="Send message"
                                disabled={isAdmin && !activeCustomer}
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#128c7e] text-white transition hover:bg-[#075e54] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <FontAwesomeIcon icon={faPaperPlane} />
                            </button>
                        </div>
                    </form>
                </section>
            )}
            <button
                onClick={toggleChat}
                aria-label="Open chat"
                className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#128c7e] text-white shadow-lg transition hover:scale-105 hover:bg-[#075e54]"
            >
                <FontAwesomeIcon icon={faComments} className="text-lg" />
                {!isOpen && unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 rounded-full bg-red-500 px-1.5 text-xs text-white">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>
        </div>
    );
}

export default ChatWidget;