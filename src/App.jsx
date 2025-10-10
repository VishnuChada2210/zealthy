import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React, { Suspense } from "react";
import { ToastContainer } from "react-toastify";

// Shared Components
import Loader from "./components/Loader";
import NotFound from "./components/NotFound";
import RouteError from "./components/RouteError";

// Layouts
import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";

// Lazy Imports (Dynamic Loading)
const Login = React.lazy(() => import("./pages/auth/Login"));
const UserDashboard = React.lazy(() => import("./pages/user/Dashboard"));
const UserAppointments = React.lazy(() => import("./pages/user/Appointments"));
const UserMedications = React.lazy(() => import("./pages/user/Medications"));

const AdminDashboard = React.lazy(() => import("./pages/admin/Dashboard"));
const AdminPatient = React.lazy(() => import("./pages/admin/Patient"));
const AdminAddPatient = React.lazy(() => import("./pages/admin/AddPatient"));

const App = () => {
    const router = createBrowserRouter([
        // LOGIN
        {
            path: "/",
            errorElement: <RouteError />,
            shouldRevalidate: () => false,
            loader: () => import("./pages/auth/Login").then((m) => m.loader?.()),
            element: (
                <Suspense fallback={<Loader />}>
                    <Login />
                </Suspense>
            ),
        },

        // USER SECTION
        {
            path: "/user",
            element: <UserLayout />,
            children: [
                {
                    index: true,
                    errorElement: <RouteError />,
                    loader: () => import("./pages/user/Dashboard").then((m) => m.loader?.()),
                    element: (
                        <Suspense fallback={<Loader />}>
                            <UserDashboard />
                        </Suspense>
                    ),
                    handle: { name: "User Dashboard" },
                },
                {
                    path: "appointments",
                    errorElement: <RouteError />,
                    loader: () => import("./pages/user/Appointments").then((m) => m.loader?.()),
                    element: (
                        <Suspense fallback={<Loader />}>
                            <UserAppointments />
                        </Suspense>
                    ),
                    handle: { name: "User Appointments" },
                },
                {
                    path: "medications",
                    errorElement: <RouteError />,
                    loader: () => import("./pages/user/Medications").then((m) => m.loader?.()),
                    element: (
                        <Suspense fallback={<Loader />}>
                            <UserMedications />
                        </Suspense>
                    ),
                    handle: { name: "User Medications" },
                },
            ],
        },

        // ADMIN SECTION
        {
            path: "/admin",
            element: <AdminLayout />,
            children: [
                {
                    index: true,
                    errorElement: <RouteError />,
                    loader: () => import("./pages/admin/Dashboard").then((m) => m.loader?.()),
                    element: (
                        <Suspense fallback={<Loader />}>
                            <AdminDashboard />
                        </Suspense>
                    ),
                    handle: { name: "Admin Dashboard" },
                },
                {
                    path: "patient",
                    errorElement: <RouteError />,
                    loader: (meta) => import("./pages/admin/Patient").then((m) => m.loader?.(meta)),
                    element: (
                        <Suspense fallback={<Loader />}>
                            <AdminPatient />
                        </Suspense>
                    ),
                    handle: { name: "Admin Patient" },
                },
                {
                    path: "add-patient",
                    errorElement: <RouteError />,
                    loader: () => import("./pages/admin/AddPatient").then((m) => m.loader?.()),
                    element: (
                        <Suspense fallback={<Loader />}>
                            <AdminAddPatient />
                        </Suspense>
                    ),
                    handle: { name: "Admin Add Patient" },
                },
            ],
        },

        // 404
        {
            path: "*",
            element: <NotFound />,
        },
    ]);

    return (
        <>
            <RouterProvider router={router} hydrateFallbackElement={<Loader />} />
            <ToastContainer
                position="top-center"
                autoClose={4000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover={false}
                theme="dark"
            />
        </>
    );
};

export default App;
