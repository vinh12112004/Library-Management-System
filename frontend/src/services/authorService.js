import apiClient from "./apiClient";

export const getAuthors = async () => {
    const response = await apiClient.get("/Author");
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
