import apiClient from "./apiClient";

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

export const getLoanById = async (id) => {
    const response = await apiClient.get(`/Loan/${id}`);
    return response.data;
};

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

export const updateLoan = async (id, loan) => {
    const response = await apiClient.put(`/Loan/${id}`, {
        ...loan,
        returnDate: loan.returnDate
            ? new Date(loan.returnDate).toISOString()
            : null,
    });
    return response.data;
};

export const deleteLoan = async (id) => {
    const response = await apiClient.delete(`/Loan/${id}`);
    return response.data;
};

export const getLoansByMemberId = async (memberId) => {
    const response = await apiClient.get(`/Loan/member/${memberId}`);
    return response.data;
};
