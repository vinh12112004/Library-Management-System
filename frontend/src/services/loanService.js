import apiClient from "./apiClient";

// Lấy loans với pagination và filters (Admin/Librarian)
export const getLoans = async (pageNumberOrOptions = 1, pageSize = 10) => {
    let params;

    if (
        typeof pageNumberOrOptions === "object" &&
        pageNumberOrOptions !== null
    ) {
        params = { pageNumber: 1, pageSize: 10, ...pageNumberOrOptions };
    } else {
        params = { pageNumber: pageNumberOrOptions, pageSize };
    }

    const response = await apiClient.get("/Loan", { params });
    return response.data;
};

// Lấy loan theo ID
export const getLoanById = async (id) => {
    const response = await apiClient.get(`/Loan/${id}`);
    return response.data;
};

// Tạo loan mới
export const createLoan = async (loan) => {
    const response = await apiClient.post("/Loan", {
        ...loan,
        loanDate: loan.loanDate
            ? new Date(loan.loanDate).toISOString()
            : new Date().toISOString(),
        dueDate: loan.dueDate ? new Date(loan.dueDate).toISOString() : null,
    });
    return response.data;
};

// Cập nhật loan
export const updateLoan = async (id, loan) => {
    const response = await apiClient.put(`/Loan/${id}`, {
        ...loan,
        returnDate: loan.returnDate
            ? new Date(loan.returnDate).toISOString()
            : null,
    });
    return response.data;
};

// Xóa loan
export const deleteLoan = async (id) => {
    const response = await apiClient.delete(`/Loan/${id}`);
    return response.data;
};

// Lấy loans của chính mình (Reader) - Tự động từ token
export const getMyLoans = async () => {
    const response = await apiClient.get("/Loan/my-loans");
    return response.data;
};
