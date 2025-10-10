import Utils from "../../helpers/utils";

export default function PrescriptionCard({ presc }) {
    const days = Utils.daysUntil(presc.refill_on);

    return (
        <div className="relative rounded-xl shadow-lg bg-white overflow-hidden border border-gray-200 hover:shadow-xl transition transform hover:-translate-y-1">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-primary/70 px-5 py-3">
                <h3 className="text-white font-bold text-lg">{presc.medication}</h3>
            </div>

            {/* Body */}
            <div className="p-5 space-y-2">
                <div className="flex items-center gap-2 text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-capsule text-primary" viewBox="0 0 16 16">
                        <path d="M1.828 8.9 8.9 1.827a4 4 0 1 1 5.657 5.657l-7.07 7.071A4 4 0 1 1 1.827 8.9Zm9.128.771 2.893-2.893a3 3 0 1 0-4.243-4.242L6.713 5.429z" />
                    </svg>
                    <p className="m-0">Dosage: {presc.dosage}</p>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                    <svg
                        className="w-5 h-5 text-primary"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 7h18M3 12h18M3 17h18"
                        />
                    </svg>
                    <p className="m-0">Quantity: {presc.quantity}</p>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                    <svg
                        className="w-5 h-5 text-primary"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                    <p className="m-0">Refill Schedule: {presc.refill_schedule}</p>
                </div>

                <div className="flex items-center justify-between mt-3">
                    <div className="text-sm text-gray-500">
                        Next Refill: <span className="font-semibold text-primary-700">{presc.refill_on ? Utils.fmtDate(presc.refill_on) : "Unknown"}</span>
                    </div>

                    <div className="text-sm font-semibold px-3 py-1 rounded-full text-white"
                        style={{ backgroundColor: days <= 2 ? "#EF4444" : "#FACC15" }}
                    >
                        {days <= 0 ? "Due" : `${days} day${days > 1 ? "s" : ""}`}
                    </div>
                </div>
            </div>
        </div>
    );
}