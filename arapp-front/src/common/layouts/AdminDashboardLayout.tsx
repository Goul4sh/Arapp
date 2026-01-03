import type {JSX} from "react";
import Header from "../../features/home/pages/Header.tsx";

function AdminDashboardLayout({children}: { children: JSX.Element }) {
    return (
        <div>
            <Header/>
            <main>{children}</main>
        </div>

    );

}

export default AdminDashboardLayout;