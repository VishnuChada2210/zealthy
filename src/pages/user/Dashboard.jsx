import { Link, redirect, useLoaderData } from "react-router-dom";
import { apiPaths, storageKey } from "../../helpers/constants";
import Utils from "../../helpers/utils";
import AppointmentCard from "../../components/appointment/AppointmentCard";
import PrescriptionCard from "../../components/prescription/PrescriptionCard";


export default function Dashboard() {
    const { profile, dashboard } = useLoaderData() || {};

    const appointments = dashboard?.appointments || [];
    const prescriptions = dashboard?.prescriptions || [];

    return (
        <div className="p-6 md:p-8">
            {/* HEADER SECTION */}
            <div className="mb-8 flex border-b border-primary-100 pb-3 flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-heading font-bold text-primary-800">
                        Welcome{profile?.name ? `, ${profile.name}` : ""}
                    </h1>
                    {profile?.email && (
                        <p className="text-sm text-muted mt-1">{profile.email}</p>
                    )}
                </div>

                {/* Quick summary cards */}
                <div className="flex gap-4">
                    <div className="rounded-xl bg-surface border border-primary-100 shadow-sm px-5 py-3 text-center hover:shadow-md transition">
                        <div className="text-xs text-muted uppercase tracking-wide">
                            Appointments
                        </div>
                        <div className="text-xl font-semibold text-primary-700">
                            {dashboard?.totalAppointments || appointments.length}
                        </div>
                    </div>
                    <div className="rounded-xl bg-surface border border-primary-100 shadow-sm px-5 py-3 text-center hover:shadow-md transition">
                        <div className="text-xs text-muted uppercase tracking-wide">
                            Refill Alerts
                        </div>
                        <div className="text-xl font-semibold text-primary-700">
                            {dashboard?.totalPrescriptions || prescriptions.length}
                        </div>
                    </div>
                </div>
            </div>

            {/* GRID SECTION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* --- UPCOMING APPOINTMENTS --- */}
                <section className="space-y-5">
                    <div className="flex gap-3 items-center justify-between">
                        <h2 className="text-xl font-semibold text-primary-900 border-l-4 border-primary-500 pl-3">
                            Upcoming Appointments (Next 7 Days)
                        </h2>

                        <Link className="px-4 py-2 bg-primary text-white rounded transition-colors hover:bg-primary-700" to="/user/appointments">View All</Link>
                    </div>

                    {appointments.length === 0 ? (
                        <div className="rounded-lg border border-dashed border-primary-100 bg-primary-100 p-6 text-sm text-muted">
                            No upcoming appointments in the next 7 days.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {appointments.map((a) => (
                                <AppointmentCard key={a._id} appointment={a} />
                            ))}
                        </div>
                    )}
                </section>

                {/* --- REFILL ALERTS --- */}
                <section className="space-y-5">

                    <div className="flex gap-3 items-center justify-between">
                        <h2 className="text-xl font-semibold text-primary-900 border-l-4 border-accent pl-3">
                            Medication Refill Alerts
                        </h2>

                        <Link className="px-4 py-2 bg-primary text-white rounded transition-colors hover:bg-primary-700" to="/user/medications">View All</Link>
                    </div>

                    {prescriptions.length === 0 ? (
                        <div className="rounded-lg border border-dashed border-primary-100 bg-primary-100 p-6 text-sm text-muted">
                            No medication refill alerts.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6">
                            {prescriptions.map((presc, i) => {
                                return <PrescriptionCard presc={presc} key={presc._id} />
                            })}
                        </div>
                    )}
                </section>
            </div>
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

        if (!parsed || !parsed.token) {
            Utils.logoutAction();
            return redirect('/');
        }
        const res = await fetch(apiPaths.userDashboard, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${parsed.token}`,
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

        console.log(parsed, response);

        return { profile: parsed, dashboard: response };
    } catch (err) {
        console.debug("Dashboard loader storage check failed", err);
        throw new Response(JSON.stringify({ message: err.message || "Something went wrong. Please try again!" }), { status: 500 });
    }
}
