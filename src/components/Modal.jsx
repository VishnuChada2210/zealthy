import { useEffect } from "react";
import { createPortal } from "react-dom";

export default function Modal({ show, onClose, title, children }) {
    // ESC key to close
    useEffect(() => {
        const handleEsc = (e) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    if (!show) return null;

    // Modal content
    const modalContent = (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 animate-slideUp"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b px-4 py-3">
                    <h2 className="text-lg font-semibold">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-xl leading-none"
                    >
                        &times;
                    </button>
                </div>

                {/* Body */}
                <div className="p-4">{children}</div>
            </div>
        </div>
    );

    // Render inside #modal
    const modalRoot = document.getElementById("modal");
    return modalRoot ? createPortal(modalContent, modalRoot) : null;
}
