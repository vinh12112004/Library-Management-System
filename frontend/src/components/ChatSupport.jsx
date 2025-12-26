import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Send } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getConversations, getMessages } from "../services/chatService";
import {
    startConnection,
    joinConversation,
    leaveConversation,
    onReceiveMessage,
    sendMessage,
} from "../services/signalrService";
import "./ChatSupport.css";

export function ChatSupport() {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [messagesMap, setMessagesMap] = useState({});
    const [selectedUser, setSelectedUser] = useState(null);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef(null);
    const connectionStarted = useRef(false);
    const prevConversationId = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messagesMap, selectedUser]);

    useEffect(() => {
        if (!isAuthenticated) navigate("/login");
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        if (!isAuthenticated) return;

        const token =
            localStorage.getItem("token") || sessionStorage.getItem("token");

        getConversations()
            .then((data) => {
                const mappedUsers = (data || []).map((c) => ({
                    id: c.id,
                    name: c.readerName || "?",
                    lastMessage: c.lastMessage || "",
                }));
                setUsers(mappedUsers);
                if (mappedUsers.length > 0) setSelectedUser(mappedUsers[0]);
                return startConnection(token);
            })
            .then(() => {
                connectionStarted.current = true;

                onReceiveMessage((message) => {
                    console.log("Received message:", message); // Debug log

                    setMessagesMap((prev) => {
                        const convId = message.conversationId;
                        const existingMsgs = prev[convId] || [];

                        // Tránh duplicate - check theo id
                        if (existingMsgs.some((m) => m.id === message.id)) {
                            console.log("Duplicate message detected, skipping");
                            return prev;
                        }

                        console.log(
                            "Adding new message to conversation:",
                            convId
                        );
                        return {
                            ...prev,
                            [convId]: [...existingMsgs, message],
                        };
                    });

                    // Update last message in users list
                    setUsers((prev) =>
                        prev.map((u) =>
                            u.id === message.conversationId
                                ? { ...u, lastMessage: message.content }
                                : u
                        )
                    );
                });
            })
            .catch(console.error);
    }, [isAuthenticated, navigate]);

    // Join/Leave conversation và load messages khi đổi selectedUser
    useEffect(() => {
        if (!selectedUser?.id || !connectionStarted.current) return;

        const loadMessagesForConversation = async (conversationId) => {
            console.log("Loading messages for conversation:", conversationId);

            try {
                const msgs = await getMessages(conversationId);
                console.log("Loaded messages:", msgs);

                setMessagesMap((prev) => ({
                    ...prev,
                    [conversationId]: msgs || [],
                }));
            } catch (error) {
                console.error("Error loading messages:", error);
            }
        };

        // Leave previous conversation
        if (
            prevConversationId.current &&
            prevConversationId.current !== selectedUser.id
        ) {
            leaveConversation(prevConversationId.current);
        }

        // Join new conversation
        joinConversation(selectedUser.id);
        prevConversationId.current = selectedUser.id;

        // Load messages - LUÔN LOAD để đảm bảo có data mới nhất
        loadMessagesForConversation(selectedUser.id);

        return () => {
            if (selectedUser.id) {
                leaveConversation(selectedUser.id);
            }
        };
    }, [selectedUser]);

    const messages = selectedUser ? messagesMap[selectedUser.id] || [] : [];

    const handleSend = async () => {
        if (!input.trim() || !selectedUser) return;

        try {
            console.log("Sending message:", {
                ConversationId: selectedUser.id,
                Content: input,
            });

            await sendMessage({
                ConversationId: selectedUser.id,
                Content: input,
            });

            setInput("");
        } catch (err) {
            console.error("Error sending message:", err);
        }
    };

    if (!selectedUser) return null;

    return (
        <div style={{ display: "flex", height: "calc(100vh - 7.5rem)" }}>
            <div
                style={{
                    width: 400,
                    borderRight: "1px solid #e5e7eb",
                    background: "#fff",
                }}
            >
                <div
                    style={{
                        padding: "16px 24px",
                        borderBottom: "1px solid #e5e7eb",
                    }}
                >
                    <h2>Tin nhắn</h2>
                    <p>{users.length} cuộc hội thoại</p>
                </div>
                <div className="chat-user-list">
                    {users.map((u) => (
                        <button
                            key={u.id}
                            className={`chat-user-btn ${
                                selectedUser?.id === u.id ? "selected" : ""
                            }`}
                            onClick={() => setSelectedUser(u)}
                        >
                            <div>
                                <div className="chat-user-name">{u.name}</div>
                                <div className="chat-user-lastmsg">
                                    {u.lastMessage}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <div
                    style={{
                        padding: "16px 24px",
                        borderBottom: "1px solid #e5e7eb",
                        fontWeight: "600",
                    }}
                >
                    {selectedUser.name}
                </div>

                <div className="chat-messages">
                    {messages.map((m) => (
                        <div
                            key={m.id}
                            className={`chat-message-wrapper ${
                                m.senderType === "Staff" ? "staff" : "user"
                            }`}
                        >
                            <div className="chat-message">{m.content}</div>
                            <span className="chat-message-time">
                                {m.createdAt
                                    ? new Date(m.createdAt).toLocaleTimeString(
                                          [],
                                          {
                                              hour: "2-digit",
                                              minute: "2-digit",
                                          }
                                      )
                                    : ""}
                            </span>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <div className="chat-input-area">
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
        </div>
    );
}
