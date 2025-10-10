import { useState } from "react";
import { redirect, useLoaderData } from "react-router-dom";

import { apiPaths, storageKey } from "../../helpers/constants";
import Utils from "../../helpers/utils";
import { toast } from "react-toastify";
import PrescriptionCard from "../../components/prescription/PrescriptionCard";

const limit = 5;

export default function Medications() {
    const { profile, prescriptions, count } = useLoaderData() || {};
    const [medicationList, setMedicationList] = useState(prescriptions || []);
    const [totalCount, setTotalCount] = useState(count || 0);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);

    async function fetchMedications(newPage = 1) {
        try {
            setLoading(true);
            const skip = (newPage - 1) * limit;

            const res = await fetch(
                `${apiPaths.prescriptions}/${profile._id}?skip=${skip}&limit=${limit}`,
                { method: "GET", headers: { "Content-Type": "application/json" } }
            );

            const response = await res.json().catch(() => null);
            if (!res.ok)
                throw new Error(response?.message || "Something went wrong. Please try again!");

            setMedicationList(response.prescriptions || []);
            setTotalCount(response.count || 0);
        } catch (error) {
            console.error("Error fetching medications:", error);
            toast.error(error.message || "Failed to load medications!");
        } finally {
            setLoading(false);
        }
    }

    const handleNext = () => {
        if (page * limit < totalCount) {
            const newPage = page + 1;
            setPage(newPage);
            fetchMedications(newPage);
        }
    };

    const handlePrev = () => {
        if (page > 1) {
            const newPage = page - 1;
            setPage(newPage);
            fetchMedications(newPage);
        }
    };

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-heading font-bold text-primary-700">Your Medications</h1>
                <p className="text-muted mt-1">Review and manage your upcoming medications.</p>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="text-center text-muted py-10">
                    <span className="animate-pulse text-primary-600 font-medium">Loading medications...</span>
                </div>
            )}

            {/* Medication List */}
            {!loading && (
                <>
                    {medicationList?.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {medicationList.map((medication) => (
                                <PrescriptionCard key={medication._id} presc={medication} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-muted py-10">No medications found.</div>
                    )}

                    {/* Pagination Controls */}
                    {totalCount > limit && (
                        <div className="flex justify-between items-center mt-8">
                            <button
                                onClick={handlePrev}
                                disabled={page <= 1}
                                className="px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
                            >
                                Previous
                            </button>

                            <div className="text-muted">
                                Page <span className="font-semibold">{page}</span> of{" "}
                                {Math.ceil(totalCount / limit)}
                            </div>

                            <button
                                onClick={handleNext}
                                disabled={page * limit >= totalCount}
                                className="px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export async function loader() {
    try {
        const localData = typeof localStorage !== "undefined" ? localStorage.getItem(storageKey) : undefined;

        if (!localData) {
            Utils.logoutAction();
            return redirect('/');
        }

        const parsed = JSON.parse(localData);
        const errorResponse = {};

        if (!parsed || !parsed._id) {
            Utils.logoutAction();
            return redirect('/');
        }
        const res = await fetch(apiPaths.prescriptions + "/" + parsed._id + "?skip=0&limit=" + limit, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const response = await res.json().catch(() => null);

        if (!res.ok) {
            if (res.status === 401) {
                Utils.logoutAction();
                return redirect('/');
            }
            errorResponse["message"] = response.message || res.message || "Something went wrong. Please try again!";
            throw new Response(JSON.stringify(errorResponse), { status: res.status });
        }

        return { profile: parsed, prescriptions: response?.prescriptions || [], count: response?.count || 0 };
    } catch (err) {
        console.debug("Dashboard loader storage check failed", err);
        throw new Response(JSON.stringify({ message: err.message || "Something went wrong. Please try again!" }), { status: 500 });
    }
}
