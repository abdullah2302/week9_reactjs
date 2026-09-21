import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, customerOnly = false }) {
    const { user, isAuthenticated, loading } = useAuth();
    const location = useLocation();

    // Wait until the initial getMe() check (see AuthContext) resolves —
    // otherwise a valid session gets bounced to /login for a split second
    // on every page refresh, before the token has been verified.
    if (loading) {
        return null;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (customerOnly && user?.role === "admin") {
        return <Navigate to="/admin/orders" replace />;
    }

    return children;
}

export default ProtectedRoute;