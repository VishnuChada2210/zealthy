import { Outlet } from "react-router-dom";
import UserHeader from "../components/common/UserHeader";

export default function UserLayout() {
    return (
        <div className="user-layout min-h-screen bg-bg text-text">
            <UserHeader />
            <main className="main"><Outlet /></main>
        </div>
    );
}
