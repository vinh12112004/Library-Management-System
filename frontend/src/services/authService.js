import apiClient from "./apiClient";

export const registerStaff = async (staffData) => {
    const response = await apiClient.post("/Auth/register-staff", staffData);
    return response.data;
};

export const login = async (credentials) => {
    const response = await apiClient.post("/Auth/login", credentials);
    return response.data;
};

export const registerMember = async (memberData) => {
    const response = await apiClient.post("/Auth/register-member", {
        ...memberData,
        dateOfBirth: memberData.dateOfBirth
            ? new Date(memberData.dateOfBirth).toISOString()
            : null,
    });
    return response.data;
};

export const loginMember = async (credentials) => {
    const response = await apiClient.post("/Auth/login-member", credentials);
    return response.data;
};
