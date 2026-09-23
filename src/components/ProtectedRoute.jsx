import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, customerOnly = false }) {
    const { user, isAuthenticated, loading } = useAuth();
    const location = useLocation();

    
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