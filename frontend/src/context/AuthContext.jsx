import {
    createContext,
    useContext,
    useMemo,
    useState,
    useEffect,
    useCallback,
} from "react";
import { decodeToken } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [refreshKey, setRefreshKey] = useState(0);

    // Force refresh when token changes (from other tabs)
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === "token" || e.key === "expiresAt") {
                setRefreshKey((prev) => prev + 1);
            }
        };
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    // Also listen for custom event for same-tab updates
    useEffect(() => {
        const handleAuthChange = () => {
            setRefreshKey((prev) => prev + 1);
        };
        window.addEventListener("auth-change", handleAuthChange);
        return () =>
            window.removeEventListener("auth-change", handleAuthChange);
    }, []);

    const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
    const expiresAt =
        localStorage.getItem("expiresAt") ||
        sessionStorage.getItem("expiresAt");

    const logout = useCallback(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("expiresAt");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("expiresAt");
        // Trigger refresh
        window.dispatchEvent(new Event("auth-change"));
        setRefreshKey((prev) => prev + 1);
    }, []);

    const refresh = useCallback(() => {
        setRefreshKey((prev) => prev + 1);
        window.dispatchEvent(new Event("auth-change"));
    }, []);

    const value = useMemo(() => {
        if (!token) {
            return {
                isAuthenticated: false,
                roles: [],
                user: null,
                logout,
                refresh,
            };
        }

        // Kiểm tra token có hết hạn không
        if (expiresAt && new Date() > new Date(expiresAt)) {
            localStorage.removeItem("token");
            localStorage.removeItem("expiresAt");
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("expiresAt");
            return {
                isAuthenticated: false,
                roles: [],
                user: null,
                logout,
                refresh,
            };
        }

        const decoded = decodeToken(token);
        if (!decoded) {
            return {
                isAuthenticated: false,
                roles: [],
                user: null,
                logout,
                refresh,
            };
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
            logout,
            refresh,
        };
    }, [token, expiresAt, refreshKey, logout, refresh]);

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
