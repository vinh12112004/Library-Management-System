import apiClient from "./apiClient";

export const getMembers = async () => {
    const response = await apiClient.get("/Member");
    return response.data;
};

export const getMemberById = async (id) => {
    const response = await apiClient.get(`/Member/${id}`);
    return response.data;
};

export const updateMember = async (id, member) => {
    const response = await apiClient.put(`/Member/${id}`, {
        ...member,
        dateOfBirth: member.dateOfBirth
            ? new Date(member.dateOfBirth).toISOString()
            : null,
        expiryDate: member.expiryDate
            ? new Date(member.expiryDate).toISOString()
            : null,
    });
    return response.data;
};

export const deleteMember = async (id) => {
    const response = await apiClient.delete(`/Member/${id}`);
    return response.data;
};
