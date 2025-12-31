import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { hasRole } from "../utils/permission";

export function ProtectedRoute({ children, requiredRoles }) {
    const { isAuthenticated, roles } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!hasRole(roles, requiredRoles)) {
        return <Navigate to="/" replace />;
    }

    return children;
}
