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

// Decode JWT token to get user info
export const decodeToken = (token) => {
    try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map(
                    (c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
                )
                .join("")
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }
};

export const changePassword = async ({ currentPassword, newPassword }) => {
    const response = await apiClient.post("/Auth/change-password", {
        currentPassword,
        newPassword,
    });
    return response.data;
};

export const resetPasswordMember = async (memberId) => {
    const response = await apiClient.post(
        `/Auth/reset-password-member/${memberId}`
    );
    return response.data;
};

export const resetPasswordStaff = async (staffId) => {
    const response = await apiClient.post(
        `/Auth/reset-password-staff/${staffId}`
    );
    return response.data;
};
