export const storageKey = "zealthy_data";

export const backendUrl = "https://thedeadcoder.com";

export const apiPaths = {
    login: backendUrl + "/auth/login",
    userDashboard: backendUrl + "/user/dashboard",
    adminDashboard: backendUrl + "/admin/dashboard",
    patient: backendUrl + "/patient",
    appointments: backendUrl + "/appointments",
    prescriptions: backendUrl + "/prescriptions",
};

export const userNavItems = [
    { to: "/user", label: "Dashboard" },
    { to: "/user/appointments", label: "Appointments" },
    { to: "/user/medications", label: "Medications" },
];

export const adminNavItems = [
    { to: "/admin", label: "Dashboard" },
    { to: "/admin/add-patient", label: "Add Patient" },
];

export const APPOINTMENT_REPEAT_TYPES = ['none', 'weekly', 'monthly', 'yearly'];
export const PRESCRIPTION_SCHEDULES = ['none', 'weekly', 'monthly'];
export const MEDICATIONS = [
    'Diovan',
    'Lexapro',
    'Metformin',
    'Ozempic',
    'Prozac',
    'Seroquel',
    'Tegretol',
];
export const DOSAGES = [
    '1mg',
    '2mg',
    '3mg',
    '5mg',
    '10mg',
    '25mg',
    '50mg',
    '100mg',
    '250mg',
    '500mg',
    '1000mg',
];