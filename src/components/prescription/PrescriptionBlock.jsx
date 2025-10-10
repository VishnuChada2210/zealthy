import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Modal from "../Modal";
import { apiPaths } from "../../helpers/constants";
import PrescriptionForm from "./PrescriptionForm";

const PAGE_LIMIT = 5;

export default function PrescriptionBlock({ patientID }) {
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [totalCount, setTotalCount] = useState(0);

    const [modalOpen, setModalOpen] = useState(false);
    const [editingPrescription, setEditingPrescription] = useState(null);

    // Fetch prescriptions
    const fetchPrescriptions = async (pageNumber = 0) => {
        setLoading(true);
        try {
            const res = await fetch(apiPaths.prescriptions + `/${patientID}?skip=${pageNumber * PAGE_LIMIT}&limit=${PAGE_LIMIT}`);

            const json = await res.json();
            if (!res.ok) throw new Error(json.message || "Failed to fetch prescriptions");

            setPrescriptions(json.prescriptions);
            setTotalCount(json.count);
        } catch (err) {
            console.error(err);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPrescriptions(page);
    }, [page]);

    // Delete appointment
    const handleDelete = async (id) => {
        try {
            const res = await fetch(`${apiPaths.prescriptions}/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete appointment");

            toast.success("Appointment deleted successfully!");
            fetchPrescriptions(page);
        } catch (err) {
            console.error(err);
            toast.error(err.message);
        }
    };

    // Open modal for add
    const handleAdd = () => {
        setEditingPrescription(null);
        setModalOpen(true);
    };

    // Open modal for edit
    const handleEdit = (appointment) => {
        setEditingPrescription(appointment);
        setModalOpen(true);
    };

    // After add/update submit
    const handleFormSubmit = async () => {
        setModalOpen(false);
        fetchPrescriptions(page);
    };

    // Pagination
    const totalPages = Math.ceil(totalCount / PAGE_LIMIT);

    return (
        <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-heading font-semibold text-primary-700 mb-4">Prescriptions</h2>
                <button
                    onClick={handleAdd}
                    className="px-4 py-2 bg-primary text-white rounded transition-colors hover:bg-primary-700"
                >
                    Add Prescription
                </button>
            </div>

            {loading ? (
                <div className="text-center py-10">Loading...</div>
            ) : prescriptions.length === 0 ? (
                <div className="text-center py-10">No prescriptions found.</div>
            ) : (
                <table className="min-w-full table-auto text-left border border-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 border-b">Medication</th>
                            <th className="px-4 py-2 border-b">Dosage</th>
                            <th className="px-4 py-2 border-b">Quantity</th>
                            <th className="px-4 py-2 border-b">Refill On</th>
                            <th className="px-4 py-2 border-b">Refill Schedule</th>
                            <th className="px-4 py-2 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {prescriptions.map((presc) => (
                            <tr key={presc._id} className="hover:bg-gray-100">
                                <td className="px-4 py-2 border-b">{presc.medication}</td>
                                <td className="px-4 py-2 border-b">{presc.dosage}</td>
                                <td className="px-4 py-2 border-b">{presc.quantity}</td>
                                <td className="px-4 py-2 border-b">
                                    {new Date(presc.refill_on).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-2 border-b">{presc.refill_schedule}</td>
                                <td className="px-4 py-2 border-b space-x-2">
                                    <button
                                        onClick={() => handleEdit(presc)}
                                        className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(presc._id)}
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
                <Modal show={modalOpen} title={editingPrescription ? "Edit Prescription" : "Add Prescription"} onClose={() => setModalOpen(false)}>
                    <PrescriptionForm
                        type={editingPrescription ? "edit" : "add"}
                        data={editingPrescription}
                        patientID={patientID}
                        onSuccess={handleFormSubmit}
                    />
                </Modal>
            )}
        </div>
    );
}
