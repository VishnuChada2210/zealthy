import { useState } from "react";
import { toast } from "react-toastify";
import { apiPaths, APPOINTMENT_REPEAT_TYPES } from "../../helpers/constants";

export default function AppointmentForm({ type, data, patientID, onSuccess }) {
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        const form = e.currentTarget;
        const formData = new FormData(form);

        try {
            const res = await fetch(`${apiPaths.appointments}/${type === "edit" ? data._id : patientID}`, {
                method: type === "edit" ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(Object.fromEntries(formData)),
            });

            const json = await res.json().catch(() => null);

            if (!res.ok) {
                const message = (json && json.message) || `Login failed (${res.status})`;
                throw new Error(message);
            }

            toast.success(json.message || "Action successful!");
            onSuccess();
        } catch (err) {
            console.error("Login error", err);
            toast.warn(err.message || "Something went wrong. Please try again");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <label htmlFor="date" className="block text-sm font-medium">
                Date and Time
            </label>
            <div className="relative mt-1">
                <input
                    id="date"
                    name="datetime"
                    type="datetime-local"
                    min={new Date().toISOString().slice(0, 16)}
                    required
                    defaultValue={data?.datetime ? new Date(data.datetime).toISOString().slice(0, 16) : ''}
                    className="block w-full accent-primary appearance-none rounded-md border border-gray-200 px-4 py-3 placeholder-gray-400 shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-required="true"
                />
            </div>

            <label htmlFor="provider" className="block text-sm font-medium">
                Provider
            </label>
            <div className="relative mt-1">
                <input
                    id="provider"
                    name="provider"
                    type="text"
                    defaultValue={data?.provider || ""}
                    required
                    className="block w-full appearance-none rounded-md border border-gray-200 px-4 py-3 placeholder-gray-400 shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-required="true"
                />
            </div>

            <label htmlFor="repeat" className="block text-sm font-medium">
                Repeat
            </label>
            <div className="relative mt-1">
                <select
                    id="repeat"
                    name="repeat"
                    defaultValue={data?.repeat || ""}
                    required
                    className="block w-full appearance-none rounded-md border border-gray-200 bg-white px-4 py-3 shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                >
                    {APPOINTMENT_REPEAT_TYPES.map((type) => (
                        <option key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                    ))}
                </select>
            </div>

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
                        {type === "edit" ? 'Updating...' : 'Creating...'}
                    </>
                ) : (
                    type === "edit" ? 'Update Appointment' : 'Create Appointment'
                )}
            </button>
        </form>
    )
}