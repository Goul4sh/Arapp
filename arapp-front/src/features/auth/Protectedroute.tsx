import { Navigate } from "react-router-dom";
import { useAuth } from "./auth";
import type {JSX} from "react";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }
    // TODO nie przekierowywac od razu do loginu jesli uzytkownik byl zalogowany i ma aktywny token
    return children;
};

export default ProtectedRoute;
