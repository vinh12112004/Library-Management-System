import apiClient from "./apiClient";

// Lấy tất cả conversations (dành cho staff)
export const getConversations = async () => {
    const response = await apiClient.get("/Chat/conversations");
    return response.data;
};

// Lấy conversation theo ID
export const getConversationById = async (id) => {
    const response = await apiClient.get(`/Chat/conversations/${id}`);
    return response.data;
};

// Lấy hoặc tạo conversation cho reader
export const getOrCreateConversation = async () => {
    const response = await apiClient.get(`/Chat/conversations/me`);
    return response.data;
};

// Lấy messages của một conversation
export const getMessages = async (conversationId) => {
    const response = await apiClient.get(
        `/Chat/conversations/${conversationId}/messages`
    );
    return response.data;
};

// Gửi message
export const sendMessage = async (messageData) => {
    const response = await apiClient.post("/Chat/messages", messageData);
    return response.data;
};
