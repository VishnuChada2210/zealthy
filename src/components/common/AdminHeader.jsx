import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { adminNavItems } from "../../helpers/constants";

export default function AdminHeader() {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    function handleLogout() {
        navigate("/");
    }

    return (
        <header className="border-b bg-surface shadow-md sticky top-0 z-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex gap-3 items-center">
                        <Link to="/admin">
                            <div className="rounded-md px-3 py-1 bg-gradient-to-br from-primary to-accent font-heading text-lg text-white">
                                <h4 className="m-0">
                                    Zealthy
                                </h4>
                            </div>
                        </Link>

                        {/* Greeting */}
                        <div className="mr-2 flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <div className="hidden items-center justify-center rounded-full bg-primary text-white md:flex" style={{ width: 32, height: 32 }}>
                                    A
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: desktop nav */}
                    <nav className="hidden items-center gap-3 md:flex">

                        {adminNavItems.map((n) => (
                            <NavLink
                                key={n.to}
                                to={n.to}
                                end
                                className={({ isActive }) =>
                                    `rounded-md px-3 py-2 text-sm font-medium transition-colors ${isActive ? "text-primary font-semibold hover:bg-primary-100 underline" : "text-muted hover:bg-primary-100 hover:text-text"
                                    }`
                                }>
                                {n.label}
                            </NavLink>
                        ))}

                        <button
                            onClick={handleLogout}
                            className="ml-2 rounded-md bg-accent px-3 py-2 text-sm font-medium text-white hover:opacity-95">
                            Logout
                        </button>
                    </nav>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setOpen((s) => !s)}
                            aria-label="Open menu"
                            className="inline-flex items-center justify-center rounded-md p-2 text-muted hover:bg-gray-100">
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu panel */}
            {open && (
                <div className="border-t bg-surface md:hidden">
                    <div className="space-y-1 px-2 pb-3 pt-2">
                        {adminNavItems.map((n) => (
                            <NavLink
                                key={n.to}
                                to={n.to}
                                end
                                onClick={() => setOpen(false)}
                                className={({ isActive }) =>
                                    `block rounded-md px-3 py-2 text-base font-medium ${isActive ? "text-primary" : "text-text"}`
                                }>
                                {n.label}
                            </NavLink>
                        ))}
                        <button onClick={handleLogout} className="w-fit ml-3 rounded-md bg-accent px-3 py-2 text-left text-sm font-medium text-white">
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
}
