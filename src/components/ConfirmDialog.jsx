import React, { createContext, useContext, useState, useCallback } from 'react';

const ConfirmContext = createContext();

export const useConfirm = () => {
    const context = useContext(ConfirmContext);
    if (!context) {
        throw new Error('useConfirm must be used within ConfirmProvider');
    }
    return context;
};

const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel', type = 'danger' }) => {
    if (!isOpen) return null;

    const typeStyles = {
        danger: {
            confirmBg: 'bg-red-600 hover:bg-red-500',
            confirmShadow: 'shadow-red-900/20',
            icon: '⚠',
            iconBg: 'bg-red-500/20',
            iconColor: 'text-red-400'
        },
        warning: {
            confirmBg: 'bg-yellow-600 hover:bg-yellow-500',
            confirmShadow: 'shadow-yellow-900/20',
            icon: '⚠',
            iconBg: 'bg-yellow-500/20',
            iconColor: 'text-yellow-400'
        },
        info: {
            confirmBg: 'bg-blue-600 hover:bg-blue-500',
            confirmShadow: 'shadow-blue-900/20',
            icon: 'ℹ',
            iconBg: 'bg-blue-500/20',
            iconColor: 'text-blue-400'
        }
    };

    const style = typeStyles[type] || typeStyles.danger;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onCancel}
            />

            {/* Dialog */}
            <div className="relative bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl max-w-md w-full animate-scale-in">
                <div className="p-6">
                    <div className="flex items-start gap-4">
                        <div className={`${style.iconBg} w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0`}>
                            <span className={`text-2xl ${style.iconColor}`}>{style.icon}</span>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                            <p className="text-gray-400 leading-relaxed">{message}</p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 p-6 pt-0">
                    <button
                        onClick={onCancel}
                        className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl transition-all font-medium border border-gray-700"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`flex-1 px-4 py-3 ${style.confirmBg} text-white rounded-xl transition-all shadow-lg ${style.confirmShadow} font-medium`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export const ConfirmProvider = ({ children }) => {
    const [confirmState, setConfirmState] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        type: 'danger'
    });

    const confirm = useCallback(({ title, message, confirmText, cancelText, type }) => {
        return new Promise((resolve) => {
            setConfirmState({
                isOpen: true,
                title,
                message,
                confirmText: confirmText || 'Confirm',
                cancelText: cancelText || 'Cancel',
                type: type || 'danger',
                onConfirm: () => {
                    setConfirmState(prev => ({ ...prev, isOpen: false }));
                    resolve(true);
                },
                onCancel: () => {
                    setConfirmState(prev => ({ ...prev, isOpen: false }));
                    resolve(false);
                }
            });
        });
    }, []);

    return (
        <ConfirmContext.Provider value={{ confirm }}>
            {children}
            <ConfirmDialog
                isOpen={confirmState.isOpen}
                title={confirmState.title}
                message={confirmState.message}
                onConfirm={confirmState.onConfirm}
                onCancel={confirmState.onCancel}
                confirmText={confirmState.confirmText}
                cancelText={confirmState.cancelText}
                type={confirmState.type}
            />
        </ConfirmContext.Provider>
    );
};
