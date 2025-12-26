import apiClient from "./apiClient";

// Lấy dashboard statistics
export const getDashboardStats = async () => {
    const response = await apiClient.get("/Dashboard");
    return response.data;
};
