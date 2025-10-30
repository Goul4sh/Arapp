import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import ProtectedRoute from "../../features/auth/Protectedroute";

const ProtectedDashboardLayout: React.FC = () => (
    <ProtectedRoute>
        <DashboardLayout>
            <Outlet />
        </DashboardLayout>
    </ProtectedRoute>
);

export default ProtectedDashboardLayout;