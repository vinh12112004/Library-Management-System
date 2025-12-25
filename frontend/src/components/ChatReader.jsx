import { useEffect, useState, useRef } from "react";
import { Send } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getOrCreateConversation, getMessages } from "../services/chatService";
import {
    startConnection,
    joinConversation,
    leaveConversation,
    onReceiveMessage,
    sendMessage,
} from "../services/signalrService";
import "./ChatReader.css";

export function ChatReader() {
    const { isAuthenticated } = useAuth();
    const [conversationId, setConversationId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (!isAuthenticated) return;

        const token =
            localStorage.getItem("token") || sessionStorage.getItem("token");

        getOrCreateConversation()
            .then((conv) => {
                setConversationId(conv.id);
                return getMessages(conv.id).then((msgs) => {
                    setMessages(msgs || []);
                    return conv.id;
                });
            })
            .then(async (convId) => {
                await startConnection(token);
                joinConversation(convId);

                onReceiveMessage((message) => {
                    if (message.conversationId === convId) {
                        setMessages((prev) => {
                            // Tránh duplicate
                            if (prev.some((m) => m.id === message.id)) {
                                return prev;
                            }
                            return [...prev, message];
                        });
                    }
                });
            })
            .catch(console.error);

        return () => {
            if (conversationId) leaveConversation(conversationId);
        };
    }, [isAuthenticated]);

    const handleSend = async () => {
        if (!input.trim() || !conversationId) return;

        try {
            await sendMessage({
                ConversationId: conversationId,
                Content: input,
            });

            setInput("");
        } catch (err) {
            console.error("Error sending message:", err);
        }
    };

    if (!conversationId) return <div>Loading chat...</div>;

    return (
        <div className="chat-reader-container">
            <div className="chat-reader-header">
                <h2>Hỗ trợ trực tuyến</h2>
            </div>

            <div className="chat-reader-messages">
                {messages.map((m) => (
                    <div
                        key={m.id}
                        className={`chat-message-wrapper ${
                            m.senderType === "Reader" ? "reader" : "staff"
                        }`}
                    >
                        <div className="chat-message">{m.content}</div>
                        <span className="chat-message-time">
                            {m.createdAt
                                ? new Date(m.createdAt).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                  })
                                : ""}
                        </span>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="chat-reader-input">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Nhập tin nhắn..."
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <button onClick={handleSend} disabled={!input.trim()}>
                    <Send size={20} />
                </button>
            </div>
        </div>
    );
}
