import React from 'react';
import { useToast } from '../components/ToastContainer';
import { useConfirm } from '../components/ConfirmDialog';

function ToastDemo() {
    const { showSuccess, showError, showWarning, showInfo } = useToast();
    const { confirm } = useConfirm();

    const handleConfirmDemo = async () => {
        const confirmed = await confirm({
            title: 'Delete Item',
            message: 'Are you sure you want to delete this item? This action cannot be undone.',
            confirmText: 'Delete',
            cancelText: 'Cancel',
            type: 'danger'
        });

        if (confirmed) {
            showSuccess('Item deleted successfully!');
        } else {
            showInfo('Deletion cancelled');
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold mb-6 text-white">Toast & Dialog Demo</h2>

            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 shadow-xl">
                <h3 className="text-xl font-semibold text-white mb-4">Toast Notifications</h3>
                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={() => showSuccess('Operation completed successfully!')}
                        className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-xl transition-all shadow-lg font-medium"
                    >
                        Show Success Toast
                    </button>
                    <button
                        onClick={() => showError('Something went wrong! Please try again.')}
                        className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-xl transition-all shadow-lg font-medium"
                    >
                        Show Error Toast
                    </button>
                    <button
                        onClick={() => showWarning('Warning: This action requires attention.')}
                        className="bg-yellow-600 hover:bg-yellow-500 text-white px-6 py-3 rounded-xl transition-all shadow-lg font-medium"
                    >
                        Show Warning Toast
                    </button>
                    <button
                        onClick={() => showInfo('Here is some useful information for you.')}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl transition-all shadow-lg font-medium"
                    >
                        Show Info Toast
                    </button>
                </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 shadow-xl">
                <h3 className="text-xl font-semibold text-white mb-4">Confirmation Dialog</h3>
                <button
                    onClick={handleConfirmDemo}
                    className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-xl transition-all shadow-lg font-medium"
                >
                    Show Confirmation Dialog
                </button>
            </div>
        </div>
    );
}

export default ToastDemo;
