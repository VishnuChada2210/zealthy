import { useState } from "react";

export default function PasswordField() {
    const [show, setShow] = useState(false);

    return (
        <div>
            <label htmlFor="password" className="block text-sm font-medium">
                Password
            </label>
            <div className="relative mt-1">
                <input
                    id="password"
                    name="password"
                    type={show ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    className="block w-full appearance-none rounded-md border border-gray-200 px-4 py-3 placeholder-gray-400 shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-required="true"
                />

                <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    aria-pressed={show}
                    aria-label={show ? "Hide password" : "Show password"}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-sm text-muted">
                    {show ? "Hide" : "Show"}
                </button>
            </div>
        </div>
    );
}
