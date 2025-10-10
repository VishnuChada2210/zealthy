import { useState } from "react";
import { toast } from "react-toastify";
import { apiPaths, MEDICATIONS, DOSAGES, PRESCRIPTION_SCHEDULES } from "../../helpers/constants";

export default function PrescriptionForm({ type, data, patientID, onSuccess }) {
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        const form = e.currentTarget;
        const formData = new FormData(form);

        try {
            const res = await fetch(`${apiPaths.prescriptions}/${type === "edit" ? data._id : patientID}`, {
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
            {/* Medication */}
            <div className="relative mt-1">
                <label htmlFor="medication" className="block text-sm font-medium">
                    Medication
                </label>
                <select
                    id="medication"
                    name="medication"
                    defaultValue={data?.medication || ""}
                    required
                    className="block w-full appearance-none rounded-md border border-gray-200 bg-white px-4 py-3 shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                >
                    {MEDICATIONS.map((med) => (
                        <option key={med} value={med}>
                            {med}
                        </option>
                    ))}
                </select>
            </div>

            {/* Dosage */}
            <div className="relative mt-1">
                <label htmlFor="dosage" className="block text-sm font-medium">
                    Dosage
                </label>
                <select
                    id="dosage"
                    name="dosage"
                    defaultValue={data?.dosage || ""}
                    required
                    className="block w-full appearance-none rounded-md border border-gray-200 bg-white px-4 py-3 shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                >
                    {DOSAGES.map((dose) => (
                        <option key={dose} value={dose}>
                            {dose}
                        </option>
                    ))}
                </select>
            </div>

            {/* Quantity */}
            <div className="relative mt-1">
                <label htmlFor="quantity" className="block text-sm font-medium">
                    Quantity
                </label>
                <input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min={1}
                    required
                    defaultValue={data?.quantity || 1}
                    className="block w-full appearance-none rounded-md border border-gray-200 px-4 py-3 placeholder-gray-400 shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>

            {/* Refill On */}
            <div className="relative mt-1">
                <label htmlFor="refill_on" className="block text-sm font-medium">
                    Refill Date
                </label>
                <input
                    id="refill_on"
                    name="refill_on"
                    type="date"
                    required
                    defaultValue={data?.refill_on ? new Date(data.refill_on).toISOString().slice(0, 10) : ""}
                    className="block w-full appearance-none rounded-md border border-gray-200 px-4 py-3 placeholder-gray-400 shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>

            {/* Refill Schedule */}
            <div className="relative mt-1">
                <label htmlFor="refill_schedule" className="block text-sm font-medium">
                    Refill Schedule
                </label>
                <select
                    id="refill_schedule"
                    name="refill_schedule"
                    defaultValue={data?.refill_schedule || "none"}
                    className="block w-full appearance-none rounded-md border border-gray-200 bg-white px-4 py-3 shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                >
                    {PRESCRIPTION_SCHEDULES.map((schedule) => (
                        <option key={schedule} value={schedule}>
                            {schedule.charAt(0).toUpperCase() + schedule.slice(1)}
                        </option>
                    ))}
                </select>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={loading}
                aria-busy={loading}
                className={`hover:bg-primary-600 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-primary px-4 py-3 text-sm font-medium text-white shadow-sm transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
            >
                {loading ? (
                    <>
                        <svg
                            className="-ml-1 mr-2 h-5 w-5 animate-spin"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                            ></path>
                        </svg>
                        {type === "edit" ? "Updating..." : "Creating..."}
                    </>
                ) : type === "edit" ? (
                    "Update Prescription"
                ) : (
                    "Create Prescription"
                )}
            </button>
        </form>
    )
}