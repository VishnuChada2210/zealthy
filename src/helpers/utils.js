import { toast } from "react-toastify";
import { storageKey } from "./constants";

const Utils = {};

Utils.logoutAction = () => {
    localStorage.removeItem(storageKey);
    toast.warn("Please login again, or try refreshing the page!");
    return;
}

Utils.fmtDate = (d) => {
    try {
        const date = new Date(d);
        return date.toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
    } catch (e) {
        return d;
    }
}

Utils.daysUntil = (d) => {
    try {
        const ms = new Date(d) - new Date();
        return Math.ceil(ms / (1000 * 60 * 60 * 24));
    } catch (e) {
        return null;
    }
}

export default Utils;
