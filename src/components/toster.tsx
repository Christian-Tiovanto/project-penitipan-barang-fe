import React, { useEffect, useState } from "react";

interface ToasterProps {
    message: string;
    variant?: "success" | "danger" | "warning" | "info";
    show: boolean;
    onClose: () => void;
}

const Toaster: React.FC<ToasterProps> = ({ message, variant = "success", show, onClose }) => {
    const [isVisible, setIsVisible] = useState(show);

    useEffect(() => {
        if (show) {
            setIsVisible(true);  // Tampilkan toaster dan animasi slide-in
        } else {
            // Tunda hingga animasi slide-out selesai, kemudian sembunyikan
            const timer = setTimeout(() => {
                setIsVisible(false);  // Sembunyikan setelah animasi selesai
            }, 500);  // Durasi animasi slide-out (500ms)
            return () => clearTimeout(timer);
        }
    }, [show]);

    return (
        <div
            className={`toast-container position-fixed top-0 end-0 p-3 ${isVisible ? "d-block" : "d-none"}`}
            style={{
                zIndex: 1050,
                animation: show ? "slideIn 0.5s ease-out" : "slideOut 0.5s ease-in", // Terapkan animasi
            }}
        >
            <div className={`toast show bg-${variant} text-white`} role="alert">
                <div className="toast-body d-flex justify-content-between">
                    <span>
                        {message.split("\n").map((line, index) => (
                            <React.Fragment key={index}>
                                {line}
                                <br />
                            </React.Fragment>
                        ))}
                    </span>
                    <button
                        type="button"
                        className="btn-close btn-close-white ms-2"
                        onClick={() => {
                            onClose();
                            setIsVisible(false); // Hentikan animasi slide-out dan sembunyikan toaster
                        }}
                    ></button>
                </div>
            </div>
        </div>
    );
};

export default Toaster;
