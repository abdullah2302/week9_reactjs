
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSkeleton from "./LoadingSkeleton";

function AdminRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return <LoadingSkeleton rows={2} />;
    }

    // Not logged in
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Logged in but not admin
    if (user.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default AdminRoute;

