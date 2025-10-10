import { useEffect, useState } from "react";
import AppointmentForm from "./AppointmentForm";
import { toast } from "react-toastify";
import Modal from "../Modal";
import { apiPaths } from "../../helpers/constants";

const PAGE_LIMIT = 5;

export default function AppointmentsBlock({ patientID }) {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [totalCount, setTotalCount] = useState(0);

    const [modalOpen, setModalOpen] = useState(false);
    const [editingAppointment, setEditingAppointment] = useState(null);

    // Fetch appointments
    const fetchAppointments = async (pageNumber = 0) => {
        setLoading(true);
        try {
            const res = await fetch(apiPaths.appointments + `/${patientID}?skip=${pageNumber * PAGE_LIMIT}&limit=${PAGE_LIMIT}`);

            const json = await res.json();
            if (!res.ok) throw new Error(json.message || "Failed to fetch appointments");

            setAppointments(json.appointments);
            setTotalCount(json.count);
        } catch (err) {
            console.error(err);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments(page);
    }, [page]);

    // Delete appointment
    const handleDelete = async (id) => {
        try {
            const res = await fetch(`${apiPaths.appointments}/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete appointment");

            toast.success("Appointment deleted successfully!");
            fetchAppointments(page);
        } catch (err) {
            console.error(err);
            toast.error(err.message);
        }
    };

    // Open modal for add
    const handleAdd = () => {
        setEditingAppointment(null);
        setModalOpen(true);
    };

    // Open modal for edit
    const handleEdit = (appointment) => {
        setEditingAppointment(appointment);
        setModalOpen(true);
    };

    // After add/update submit
    const handleFormSubmit = async () => {
        setModalOpen(false);
        fetchAppointments(page);
    };

    // Pagination
    const totalPages = Math.ceil(totalCount / PAGE_LIMIT);

    return (
        <div className="p-6 mb-10 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-heading font-semibold text-primary-700 mb-4">Appointments</h2>

                <button
                    onClick={handleAdd}
                    className="px-4 py-2 bg-primary text-white rounded transition-colors hover:bg-primary-700"
                >
                    Add Appointment
                </button>
            </div>

            {loading ? (
                <div className="text-center py-10">Loading...</div>
            ) : appointments.length === 0 ? (
                <div className="text-center py-10">No appointments found.</div>
            ) : (
                <table className="min-w-full table-auto text-left border border-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 border-b">Date & Time</th>
                            <th className="px-4 py-2 border-b">Provider</th>
                            <th className="px-4 py-2 border-b">Repeat</th>
                            <th className="px-4 py-2 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map((appt) => (
                            <tr key={appt._id} className="hover:bg-gray-100">
                                <td className="px-4 py-2 border-b">{new Date(appt.datetime).toLocaleString()}</td>
                                <td className="px-4 py-2 border-b">{appt.provider}</td>
                                <td className="px-4 py-2 border-b">{appt.repeat}</td>
                                <td className="px-4 py-2 border-b space-x-2">
                                    <button
                                        onClick={() => handleEdit(appt)}
                                        className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(appt._id)}
                                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-4 flex justify-center space-x-2">
                    {Array.from({ length: totalPages }).map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setPage(idx)}
                            className={`px-3 py-1 rounded border ${page === idx ? "bg-primary text-white" : "bg-white text-gray-700"
                                }`}
                        >
                            {idx + 1}
                        </button>
                    ))}
                </div>
            )}

            {/* Modal for Add/Edit */}
            {modalOpen && (
                <Modal show={modalOpen} title={editingAppointment ? "Edit Appointment" : "Add Appointment"} onClose={() => setModalOpen(false)}>
                    <AppointmentForm
                        type={editingAppointment ? "edit" : "add"}
                        data={editingAppointment}
                        patientID={patientID}
                        onSuccess={handleFormSubmit}
                    />
                </Modal>
            )}
        </div>
    );
}
