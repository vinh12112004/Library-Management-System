import axios from "axios";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5280/api",
    headers: { "Content-Type": "application/json" },
});

// Add JWT token to requests
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 errors
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("expiresAt");
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("expiresAt");
            window.dispatchEvent(new Event("auth-change"));
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default apiClient;
