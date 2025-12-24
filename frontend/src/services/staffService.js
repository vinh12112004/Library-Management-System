import apiClient from "./apiClient";

export const getStaffs = async () => {
    const response = await apiClient.get("/Staff");
    return response.data;
};

export const getStaffById = async (id) => {
    const response = await apiClient.get(`/Staff/${id}`);
    return response.data;
};

export const updateStaff = async (id, staff) => {
    const response = await apiClient.put(`/Staff/${id}`, staff);
    return response.data;
};

export const deleteStaff = async (id) => {
    const response = await apiClient.delete(`/Staff/${id}`);
    return response.data;
};
