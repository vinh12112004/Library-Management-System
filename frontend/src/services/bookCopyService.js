import apiClient from "./apiClient";

export const getBookCopies = async () => {
    const response = await apiClient.get("/BookCopy");
    return response.data;
};

export const getBookCopyById = async (id) => {
    const response = await apiClient.get(`/BookCopy/${id}`);
    return response.data;
};

export const createBookCopy = async (bookCopy) => {
    const response = await apiClient.post("/BookCopy", bookCopy);
    return response.data;
};

export const updateBookCopy = async (id, bookCopy) => {
    const response = await apiClient.put(`/BookCopy/${id}`, bookCopy);
    return response.data;
};

export const deleteBookCopy = async (id) => {
    const response = await apiClient.delete(`/BookCopy/${id}`);
    return response.data;
};
