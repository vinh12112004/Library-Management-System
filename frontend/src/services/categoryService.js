import apiClient from "./apiClient";

// Lấy tất cả category
export const getCategories = async () => {
    const response = await apiClient.get("/Category?pageSize=10000");
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
