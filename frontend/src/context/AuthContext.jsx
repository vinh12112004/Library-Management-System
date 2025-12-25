import { createContext, useContext, useMemo } from "react";
import { decodeToken } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
    const expiresAt =
        localStorage.getItem("expiresAt") ||
        sessionStorage.getItem("expiresAt");

    const value = useMemo(() => {
        if (!token) {
            return { isAuthenticated: false, roles: [], user: null };
        }

        // Kiểm tra token có hết hạn không
        if (expiresAt && new Date() > new Date(expiresAt)) {
            localStorage.removeItem("token");
            localStorage.removeItem("expiresAt");
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("expiresAt");
            return { isAuthenticated: false, roles: [], user: null };
        }

        const decoded = decodeToken(token);
        if (!decoded) {
            return { isAuthenticated: false, roles: [], user: null };
        }

        const roles =
            decoded[
                "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
            ];

        return {
            isAuthenticated: true,
            roles: Array.isArray(roles) ? roles : [roles],
            user: {
                id: decoded.sub,
                email: decoded.unique_name,
            },
        };
    }, [token, expiresAt]);

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
