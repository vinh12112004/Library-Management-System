import apiClient from "./apiClient";

export const getBooks = async (queryParameters = {}) => {
    const params = new URLSearchParams();

    if (queryParameters.pageNumber)
        params.append("pageNumber", queryParameters.pageNumber);
    if (queryParameters.pageSize)
        params.append("pageSize", queryParameters.pageSize);
    if (queryParameters.searchTerm)
        params.append("searchTerm", queryParameters.searchTerm);
    if (queryParameters.sortBy) params.append("sortBy", queryParameters.sortBy);
    if (queryParameters.sortOrder)
        params.append("sortOrder", queryParameters.sortOrder);

    const response = await apiClient.get(`/Book?${params.toString()}`);
    return response.data;
};

export const getBookById = async (id) => {
    const response = await apiClient.get(`/Book/${id}`);
    return response.data;
};

export const createBook = async (bookData) => {
    const formData = new FormData();

    Object.keys(bookData).forEach((key) => {
        const value = bookData[key];

        if (value === null || value === undefined) return;

        // ✅ xử lý array đúng cách
        if (Array.isArray(value)) {
            value.forEach((v) => formData.append(key, v));
        }
        // ✅ xử lý file
        else {
            formData.append(key, value);
        }
    });

    const response = await apiClient.post("/Book", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
};

export const updateBook = async (id, bookData) => {
    const response = await apiClient.put(`/Book/${id}`, bookData);
    return response.data;
};

export const deleteBook = async (id) => {
    const response = await apiClient.delete(`/Book/${id}`);
    return response.data;
};
