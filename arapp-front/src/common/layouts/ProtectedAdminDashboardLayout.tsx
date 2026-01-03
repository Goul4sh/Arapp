import React from 'react';
import { Outlet } from 'react-router-dom';
import ProtectedRoute from "../../features/auth/Protectedroute";
import AdminDashboardLayout from "./AdminDashboardLayout.tsx";

const ProtectedAdminDashboardLayout: React.FC = () => (
    <ProtectedRoute requiredRole={"ADMIN"}>
        <AdminDashboardLayout>
            <Outlet />
        </AdminDashboardLayout>
    </ProtectedRoute>
);

export default ProtectedAdminDashboardLayout;