import { useLoaderData } from "react-router-dom";
import { apiPaths } from "../../helpers/constants";
import AppointmentsBlock from "../../components/appointment/AppointmentsBlock";
import { Suspense } from "react";
import PrescriptionBlock from "../../components/prescription/PrescriptionBlock";

export default function Patient() {
    const { patient = {} } = useLoaderData();

    return (
        <div className="p-8 text-text">
            {/* Header */}
            <div className="mb-8 border-b border-gray-200 pb-4">
                <h1 className="text-3xl font-heading font-bold text-primary-700">Patient Profile</h1>
            </div>

            {/* Profile Card */}
            <div className="shadow-lg border border-gray-100 rounded-2xl p-6 mb-10">
                <h2 className="text-xl font-heading font-semibold text-primary-700 mb-4">Profile</h2>
                <div className="grid sm:grid-cols-3 gap-4 text-sm">
                    <p><span className="font-semibold">Name:</span> {patient?.name}</p>
                    <p><span className="font-semibold">Email:</span> {patient?.email}</p>
                    <p><span className="font-semibold">Age:</span> {patient?.age || "—"}</p>
                </div>
            </div>

            {/* Appointments */}
            <Suspense fallback={<div>Loading appointments...</div>}>
                <AppointmentsBlock patientID={patient._id} />
            </Suspense>

            {/* Prescriptions */}
            <Suspense fallback={<div>Loading Prescriptions...</div>}>
                <PrescriptionBlock patientID={patient._id} />
            </Suspense>
        </div>
    );
}

export async function loader({ request }) {
    const url = new URL(request.url);
    const patientId = url.searchParams.get("patient_id");
    if (!patientId)
        throw new Response(JSON.stringify({ message: "Patient ID is required" }), { status: 400 });

    const res = await fetch(`${apiPaths.patient}/${patientId}`);
    const response = await res.json();

    if (!res.ok) {
        throw new Response(JSON.stringify({ message: response.message }), { status: res.status });
    }

    return response;
}
