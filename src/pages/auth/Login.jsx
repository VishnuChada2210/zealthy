import { toast } from "react-toastify";
import PasswordField from "../../components/FormRelated/PasswordField";
import { apiPaths, storageKey } from "../../helpers/constants";
import { useNavigate, redirect } from "react-router-dom";
import { useState } from "react";

export default function Login() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        const form = e.currentTarget;
        const data = new FormData(form);
        const email = data.get("email").trim();
        const password = data.get("password");

        try {
            if (!email || !password) {
                throw new Error("Please provide both email and password.");
            }

            const res = await fetch(apiPaths.login, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const json = await res.json().catch(() => null);

            if (!res.ok) {
                const message = (json && json.message) || `Login failed (${res.status})`;
                throw new Error(message);
            }

            const payload = JSON.stringify(json ?? { status: "ok" });

            localStorage.setItem(storageKey, payload);
            console.log(payload);

            setTimeout(() => navigate('/user'), 200);
        } catch (err) {
            console.error("Login error", err);
            toast.warn(err.message || "Something went wrong. Please try again");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-bg px-4">
            <div className="grid w-full max-w-4xl grid-cols-1 items-center gap-6 md:grid-cols-2">
                <div className="hidden items-center justify-center md:flex">
                    <div className="flex text-white h-80 w-80 transform items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-xl transition-transform duration-500 hover:scale-105">
                        <h1>Zealthy</h1>
                    </div>
                </div>

                <div className="rounded-2xl bg-surface p-8 shadow-lg">
                    <h1 className="mb-2 font-heading text-2xl md:text-3xl">Welcome back</h1>
                    <p className="mb-6 text-muted">Sign in to access your dashboard</p>

                    <form onSubmit={handleSubmit} className="space-y-4" aria-describedby="login">

                        <label htmlFor="email" className="block text-sm font-medium">
                            Email address
                        </label>
                        <div className="relative mt-1">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="block w-full appearance-none rounded-md border border-gray-200 px-4 py-3 placeholder-gray-400 shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                                aria-required="true"
                            />
                        </div>

                        <PasswordField />

                        <button
                            type="submit"
                            disabled={loading}
                            aria-busy={loading}
                            className={`hover:bg-primary-600 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-primary px-4 py-3 text-sm font-medium text-white shadow-sm transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                        >
                            {loading ? (
                                <>
                                    <svg className="-ml-1 mr-2 h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                    </svg>
                                    Signing in...
                                </>
                            ) : (
                                'Sign in'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export async function loader() {
    try {
        const localData = typeof localStorage !== "undefined" ? localStorage.getItem(storageKey) : undefined;

        if (localData) {
            return redirect("/user");
        }
    } catch (err) {
        console.debug("Loader storage check failed", err);
    }

    return {};
}
