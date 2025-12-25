import apiClient from "./apiClient";

// Lấy categories: hỗ trợ gọi kiểu (pageNumber, pageSize) hoặc object { pageNumber, pageSize, ... }
export const getCategories = async (pageNumberOrOptions = 1, pageSize = 10) => {
    let params;

    if (
        typeof pageNumberOrOptions === "object" &&
        pageNumberOrOptions !== null
    ) {
        params = { pageNumber: 1, pageSize: 10, ...pageNumberOrOptions };
    } else {
        params = { pageNumber: pageNumberOrOptions, pageSize };
    }

    const response = await apiClient.get("/Category", { params });
    return response.data;
};

// Lấy category theo ID
export const getCategoryById = async (id) => {
    const response = await apiClient.get(`/Category/${id}`);
    return response.data;
};

// Tạo category mới
export const createCategory = async (category) => {
    const response = await apiClient.post("/Category", category);
    return response.data;
};

// Cập nhật category theo ID
export const updateCategory = async (id, category) => {
    const response = await apiClient.put(`/Category/${id}`, category);
    return response.data;
};

// Xóa category theo ID
export const deleteCategory = async (id) => {
    const response = await apiClient.delete(`/Category/${id}`);
    return response.data;
};
