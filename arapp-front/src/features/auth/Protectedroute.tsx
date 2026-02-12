import {Navigate} from "react-router-dom";
import {useAuth} from "./auth";
import type {JSX} from "react";

interface ProtectedRouteProps {
    children: JSX.Element;
    requiredRole?: 'ADMIN' | 'USER';
}

const ProtectedRoute = ({children, requiredRole}: ProtectedRouteProps) => {
    const {user, loading} = useAuth();
    if (loading){
        return <div>Ładowanie...</div>;
    }
    if (!user) {
        return <Navigate to="/login" replace/>;
    }

    if (requiredRole && user.role !== requiredRole) {
        return <Navigate to={user.role === 'ADMIN' ? "/admin/dashboard" : "/dashboard"} replace/>;
    }

    return children;
};

export default ProtectedRoute;
