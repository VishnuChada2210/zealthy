import { Outlet } from "react-router-dom";
import AdminHeader from "../components/common/AdminHeader";

export default function AdminLayout() {
    return (
        <div className="admin-layout">
            <AdminHeader />
            <main className="main"><Outlet /></main>
        </div>
    );
}
