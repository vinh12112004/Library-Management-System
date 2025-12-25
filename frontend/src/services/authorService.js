import apiClient from "./apiClient";

// Lấy authors: hỗ trợ gọi kiểu (pageNumber, pageSize) hoặc object { pageNumber, pageSize, ... }
export const getAuthors = async (pageNumberOrOptions = 1, pageSize = 10) => {
    let params;

    if (
        typeof pageNumberOrOptions === "object" &&
        pageNumberOrOptions !== null
    ) {
        params = { pageNumber: 1, pageSize: 10, ...pageNumberOrOptions };
    } else {
        params = { pageNumber: pageNumberOrOptions, pageSize };
    }

    const response = await apiClient.get("/Author", { params });
    return response.data;
};

export const getAuthorById = async (id) => {
    const response = await apiClient.get(`/Author/${id}`);
    return response.data;
};

export const createAuthor = async (author) => {
    const response = await apiClient.post("/Author", author);
    return response.data;
};

export const updateAuthor = async (id, author) => {
    const response = await apiClient.put(`/Author/${id}`, {
        ...author,
        dateOfBirth: author.dateOfBirth
            ? new Date(author.dateOfBirth).toISOString()
            : null,
    });
    return response.data;
};

export const deleteAuthor = async (id) => {
    const response = await apiClient.delete(`/Author/${id}`);
    return response.data;
};

export const getBooksByAuthorId = async (authorId) => {
    const response = await apiClient.get(`/Author/${authorId}/books`);
    return response.data;
};
