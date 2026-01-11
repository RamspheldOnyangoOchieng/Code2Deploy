import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/Toast';

const ToastContext = createContext(null);

/**
 * Toast Provider - Wrap your app with this to enable toast notifications
 */
export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info', duration = 5000) => {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev, { id, message, type, duration }]);
        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const success = useCallback((message, duration) => {
        return addToast(message, 'success', duration);
    }, [addToast]);

    const error = useCallback((message, duration) => {
        return addToast(message, 'error', duration);
    }, [addToast]);

    const warning = useCallback((message, duration) => {
        return addToast(message, 'warning', duration);
    }, [addToast]);

    const info = useCallback((message, duration) => {
        return addToast(message, 'info', duration);
    }, [addToast]);

    const clearAll = useCallback(() => {
        setToasts([]);
    }, []);

    return (
        <ToastContext.Provider value={{ addToast, removeToast, success, error, warning, info, clearAll }}>
            {children}

            {/* Toast Container */}
            <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3">
                {toasts.map((toast, index) => (
                    <div
                        key={toast.id}
                        style={{
                            transform: `translateY(${index * 10}px)`,
                            animation: 'slideInRight 0.3s ease-out forwards'
                        }}
                    >
                        <Toast
                            message={toast.message}
                            type={toast.type}
                            duration={toast.duration}
                            onClose={() => removeToast(toast.id)}
                            position="static"
                        />
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

/**
 * Hook to use toast notifications
 * @returns {{ success, error, warning, info, addToast, removeToast, clearAll }}
 */
export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export default ToastProvider;
