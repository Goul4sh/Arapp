import { Navigate } from "react-router-dom";
import { useAuth } from "./auth";
import type {JSX} from "react";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const { user , loading} = useAuth();

    if (loading) return <div></div>;
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
