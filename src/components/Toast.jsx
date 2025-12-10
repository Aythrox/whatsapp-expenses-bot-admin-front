import React, { useEffect, useState } from 'react';

const Toast = ({ message, type = 'info', onClose, duration = 4000 }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Trigger animation
        setIsVisible(true);

        if (duration > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const typeStyles = {
        success: {
            bg: 'bg-gradient-to-r from-green-500/20 to-emerald-500/20',
            border: 'border-green-500/50',
            icon: '✓',
            iconBg: 'bg-green-500',
            text: 'text-green-400'
        },
        error: {
            bg: 'bg-gradient-to-r from-red-500/20 to-rose-500/20',
            border: 'border-red-500/50',
            icon: '✕',
            iconBg: 'bg-red-500',
            text: 'text-red-400'
        },
        warning: {
            bg: 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20',
            border: 'border-yellow-500/50',
            icon: '⚠',
            iconBg: 'bg-yellow-500',
            text: 'text-yellow-400'
        },
        info: {
            bg: 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20',
            border: 'border-blue-500/50',
            icon: 'ℹ',
            iconBg: 'bg-blue-500',
            text: 'text-blue-400'
        }
    };

    const style = typeStyles[type] || typeStyles.info;

    return (
        <div className={`${style.bg} ${style.border} backdrop-blur-xl border rounded-2xl p-4 shadow-2xl min-w-[320px] max-w-md animate-slide-in-right`}>
            <div className="flex items-start gap-3">
                <div className={`${style.iconBg} w-8 h-8 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 shadow-lg`}>
                    {style.icon}
                </div>
                <div className="flex-1 pt-0.5">
                    <p className={`${style.text} font-medium leading-relaxed`}>{message}</p>
                </div>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-200 transition-colors flex-shrink-0 ml-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            {duration > 0 && (
                <div className="mt-3 h-1 bg-gray-700/30 rounded-full overflow-hidden">
                    <div
                        className={`h-full ${style.iconBg}`}
                        style={{
                            width: '100%',
                            animation: `shrink ${duration}ms linear forwards`
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default Toast;
