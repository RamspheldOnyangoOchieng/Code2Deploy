import React, { useEffect } from 'react';

/**
 * Toast Notification Component
 * Types: success, error, warning, info
 */
const Toast = ({
    message,
    type = 'info',
    onClose,
    duration = 5000,
    position = 'top-right'
}) => {
    useEffect(() => {
        if (duration && duration > 0) {
            const timer = setTimeout(() => {
                onClose?.();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const typeStyles = {
        success: {
            bg: 'bg-gradient-to-r from-green-500 to-emerald-600',
            border: 'border-green-400',
            icon: (
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            ),
            iconBg: 'bg-green-600/30',
        },
        error: {
            bg: 'bg-gradient-to-r from-red-500 to-rose-600',
            border: 'border-red-400',
            icon: (
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            ),
            iconBg: 'bg-red-600/30',
        },
        warning: {
            bg: 'bg-gradient-to-r from-yellow-500 to-amber-600',
            border: 'border-yellow-400',
            icon: (
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            ),
            iconBg: 'bg-yellow-600/30',
        },
        info: {
            bg: 'bg-gradient-to-r from-blue-500 to-cyan-600',
            border: 'border-blue-400',
            icon: (
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            iconBg: 'bg-blue-600/30',
        },
    };

    const positionStyles = {
        'top-right': 'top-4 right-4',
        'top-left': 'top-4 left-4',
        'bottom-right': 'bottom-4 right-4',
        'bottom-left': 'bottom-4 left-4',
        'top-center': 'top-4 left-1/2 -translate-x-1/2',
        'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
    };

    const style = typeStyles[type] || typeStyles.info;
    const pos = positionStyles[position] || positionStyles['top-right'];

    return (
        <div
            className={`fixed ${pos} z-[9999] animate-slide-in-right`}
            role="alert"
            aria-live="polite"
        >
            <div className={`${style.bg} rounded-xl shadow-2xl overflow-hidden min-w-[320px] max-w-md transform transition-all duration-300 hover:scale-[1.02]`}>
                <div className="p-4">
                    <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full ${style.iconBg} flex items-center justify-center`}>
                            {style.icon}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 pt-0.5">
                            <p className="text-white font-semibold text-sm">
                                {type === 'success' && 'Success!'}
                                {type === 'error' && 'Error!'}
                                {type === 'warning' && 'Warning!'}
                                {type === 'info' && 'Info'}
                            </p>
                            <p className="text-white/90 text-sm mt-1 break-words">{message}</p>
                        </div>

                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="flex-shrink-0 text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
                            aria-label="Close notification"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Progress bar */}
                {duration > 0 && (
                    <div className="h-1 bg-white/20">
                        <div
                            className="h-full bg-white/50 animate-shrink-width"
                            style={{ animationDuration: `${duration}ms` }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

/**
 * Inline Alert Component for forms and sections
 */
export const Alert = ({
    message,
    type = 'info',
    onClose,
    className = ''
}) => {
    const typeStyles = {
        success: {
            bg: 'bg-green-50',
            border: 'border-green-200',
            text: 'text-green-800',
            icon: (
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            ),
        },
        error: {
            bg: 'bg-red-50',
            border: 'border-red-200',
            text: 'text-red-800',
            icon: (
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        warning: {
            bg: 'bg-yellow-50',
            border: 'border-yellow-200',
            text: 'text-yellow-800',
            icon: (
                <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            ),
        },
        info: {
            bg: 'bg-blue-50',
            border: 'border-blue-200',
            text: 'text-blue-800',
            icon: (
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
    };

    const style = typeStyles[type] || typeStyles.info;

    return (
        <div className={`${style.bg} ${style.border} border rounded-lg p-4 ${className}`}>
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0">{style.icon}</div>
                <div className="flex-1 min-w-0">
                    <p className={`${style.text} text-sm font-medium`}>{message}</p>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className={`flex-shrink-0 ${style.text} opacity-70 hover:opacity-100 transition-opacity`}
                        aria-label="Dismiss"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
};

export default Toast;
