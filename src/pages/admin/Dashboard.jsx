import { Link, redirect, useLoaderData } from "react-router-dom";
import { apiPaths } from "../../helpers/constants";
import Utils from "../../helpers/utils";
import { useState, useEffect } from "react";

export default function Dashboard() {
    const { dashboard } = useLoaderData() || {};

    const [patients, setPatients] = useState(dashboard?.data || []);
    const [totalCount, setTotalCount] = useState(dashboard?.totalCount || 0);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const limit = 10;

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const skip = (page - 1) * limit;
                const query = new URLSearchParams({ skip, limit, search }).toString();
                const res = await fetch(`${apiPaths.adminDashboard}?${query}`);
                const data = await res.json();
                setPatients(data?.data || []);
                setTotalCount(data?.totalCount || 0);
            } catch (err) {
                console.error("Error fetching patients:", err);
            }
        };
        fetchPatients();
    }, [page, search]);

    const totalPages = Math.ceil(totalCount / limit);

    return (
        <div className="p-6">
            {/* Header + Search */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
                <h1 className="text-2xl font-heading text-primary-800">Patient Records</h1>
                <div className="relative w-full sm:w-64">
                    <input
                        type="text"
                        placeholder="Search patients..."
                        value={search}
                        onChange={(e) => {
                            setPage(1);
                            setSearch(e.target.value);
                        }}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <span className="absolute right-3 top-2.5 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                        </svg>
                    </span>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-lg shadow-md bg-surface">
                <table className="min-w-full border border-gray-200">
                    <thead className="bg-gray-50 text-gray-700 text-sm uppercase">
                        <tr>
                            <th className="px-6 py-3 text-left">Name</th>
                            <th className="px-6 py-3 text-left">Email</th>
                            <th className="px-6 py-3 text-left">Next Appointment</th>
                            <th className="px-6 py-3 text-left">Medications</th>
                            <th className="px-6 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patients.length > 0 ? (
                            patients.map((p) => (
                                <tr
                                    key={p._id}
                                    className="border-b hover:bg-gray-100 transition-colors"
                                >
                                    <td className="px-6 py-4 font-medium text-text">{p.name}</td>
                                    <td className="px-6 py-4 text-muted">{p.email}</td>
                                    <td className="px-6 py-4">
                                        {p.nextAppointment ? (
                                            <span className="text-success font-medium">
                                                {new Date(p.nextAppointment?.datetime || "").toLocaleDateString()}
                                            </span>
                                        ) : (
                                            <span className="text-muted italic">No upcoming</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {p.prescriptions?.length || 0}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <Link
                                            to={`/admin/patient?patient_id=${p._id}`}
                                            className="text-primary-700 hover:text-primary-900 font-semibold"
                                        >
                                            View Details
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="text-center py-6 text-muted italic"
                                >
                                    No patients found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6">
                <p className="text-sm text-muted">
                    Showing {(page - 1) * limit + 1}–
                    {Math.min(page * limit, totalCount)} of {totalCount}
                </p>
                <div className="flex items-center gap-2">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                        className={`px-3 py-1 rounded-md border ${page === 1
                            ? "text-gray-400 border-gray-200 cursor-not-allowed"
                            : "text-primary-700 border-primary-300 hover:bg-primary-100"
                            }`}
                    >
                        Prev
                    </button>
                    <span className="text-sm font-medium text-text">
                        Page {page} of {totalPages || 1}
                    </span>
                    <button
                        disabled={totalPages === 0 || page === totalPages}
                        onClick={() => setPage((p) => p + 1)}
                        className={`px-3 py-1 rounded-md border ${(page === totalPages || totalPages === 0)
                            ? "text-gray-400 border-gray-200 cursor-not-allowed"
                            : "text-primary-700 border-primary-300 hover:bg-primary-100"
                            }`}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}

export async function loader() {
    try {
        const errorResponse = {};

        const res = await fetch(apiPaths.adminDashboard, {
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

        return { dashboard: response };
    } catch (err) {
        console.debug("Dashboard loader storage check failed", err);
        throw new Response(JSON.stringify({ message: err.message || "Something went wrong. Please try again!" }), { status: 500 });
    }
}