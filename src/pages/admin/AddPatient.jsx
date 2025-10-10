import { useState } from "react";
import { toast } from "react-toastify";

import PasswordField from "../../components/FormRelated/PasswordField";
import { apiPaths } from "../../helpers/constants";

export default function Patient() {
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        const form = e.currentTarget;
        const data = new FormData(form);
        const formDataObj = Object.fromEntries(data.entries());
        
        try {
            if (!form.name || !form.email) {
                throw new Error("Please provide both name and email.");
            }

            const res = await fetch(apiPaths.patient, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formDataObj),
            });

            const json = await res.json().catch(() => null);

            if (!res.ok) {
                const message = (json && json.message) || `Error Adding Patient (${res.status})`;
                throw new Error(message);
            }

            form.reset();
            toast.success("Patient added successfully!");
        } catch (err) {
            console.error("Login error", err);
            toast.warn(err.message || "Something went wrong. Please try again");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex items-center justify-center pt-6 px-4">
            <div className=" w-full max-w-lg">
                <div className="rounded-2xl bg-surface animate-slideUp p-8 shadow-lg">
                    <h1 className="mb-2 font-heading text-2xl md:text-3xl">Add Patient</h1>
                    <p className="mb-6 text-muted">Fill in the details below to add a new patient</p>

                    <form onSubmit={handleSubmit} className="space-y-4" aria-describedby="login">

                        <div className="relative mt-1">
                            <label htmlFor="name" className="block text-sm font-medium">
                                Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                autoComplete="name"
                                required
                                className="block w-full appearance-none rounded-md border border-gray-200 px-4 py-3 placeholder-gray-400 shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                                aria-required="true"
                            />
                        </div>

                        <div className="relative mt-1">
                            <label htmlFor="email" className="block text-sm font-medium">
                                Email address
                            </label>
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

                        <div className="relative mt-1">
                            <label htmlFor="age" className="block text-sm font-medium">
                                Age
                            </label>
                            <input
                                id="age"
                                name="age"
                                type="number"
                                autoComplete="age"
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
                                    Adding patient...
                                </>
                            ) : (
                                'Add Patient'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
