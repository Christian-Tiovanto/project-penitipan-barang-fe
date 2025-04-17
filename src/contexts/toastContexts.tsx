// src/context/ToastContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import Toaster from '../components/toster';

interface ToastContextType {
    showToast: (message: string, variant: "success" | "danger" | "warning" | "info") => void;
    hideToast: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};

interface ToastProviderProps {
    children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
    const [message, setMessage] = useState("");
    const [variant, setVariant] = useState<"success" | "danger" | "warning" | "info">("success");
    const [show, setShow] = useState(false);

    const showToast = (message: string, variant: "success" | "danger" | "warning" | "info") => {
        setMessage(message);
        setVariant(variant);
        setShow(true);
        setTimeout(() => setShow(false), 3000); // Hide after 3 seconds
    };

    const hideToast = () => setShow(false);

    return (
        <ToastContext.Provider value={{ showToast, hideToast }}>
            {children}
            <Toaster message={message} variant={variant} show={show} onClose={hideToast} />
        </ToastContext.Provider>
    );
};
