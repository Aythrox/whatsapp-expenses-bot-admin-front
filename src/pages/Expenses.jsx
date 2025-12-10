import React, { useState, useEffect } from 'react';
import api from '../api';
import { useToast } from '../components/ToastContainer';
import { useConfirm } from '../components/ConfirmDialog';

function Expenses() {
    const [expenses, setExpenses] = useState([]);
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [loading, setLoading] = useState(true);
    const { showError, showSuccess } = useToast();
    const { confirm } = useConfirm();

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/expenses');
            setExpenses(response.data);
        } catch (error) {
            console.error('Error fetching expenses:', error);
            showError('Failed to load expenses. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleView = (expense) => {
        setSelectedExpense(expense);
    };

    const handleCloseModal = () => {
        setSelectedExpense(null);
    };

    const handleApprove = async () => {
        if (!selectedExpense) return;

        const isConfirmed = await confirm({
            title: 'Approve Expense',
            message: 'Are you sure you want to approve this expense?',
            confirmText: 'Approve',
            type: 'info'
        });

        if (!isConfirmed) return;

        try {
            await api.put(`/admin/expenses/${selectedExpense.userId}/${selectedExpense.timestamp}`, {
                status: 'APPROVED'
            });

            showSuccess('Expense approved successfully');

            // Update local state
            const updatedExpense = { ...selectedExpense, status: 'APPROVED' };
            setSelectedExpense(updatedExpense);
            setExpenses(expenses.map(e =>
                e.PK === selectedExpense.PK && e.SK === selectedExpense.SK ? updatedExpense : e
            ));

        } catch (error) {
            console.error(error);
            showError('Failed to approve expense');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading expenses...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 text-white">Expenses History</h2>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 shadow-xl overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-900/50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Description</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700/50">
                        {expenses.map((expense) => (
                            <tr key={expense.timestamp} className="hover:bg-gray-700/20 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-gray-300">{new Date(parseInt(expense.timestamp) * 1000).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-300">{expense.userId}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-300">{expense.description}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-300 font-medium">${expense.amount}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${expense.status === 'APPROVED' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                        expense.status === 'PROCESSING' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                                            'bg-red-500/10 text-red-400 border border-red-500/20'
                                        }`}>
                                        {expense.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => handleView(expense)}
                                        className="text-blue-400 hover:text-blue-300 transition-colors"
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Expense Detail Modal */}
            {selectedExpense && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={handleCloseModal}>
                    <div className="bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-gray-700" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="text-xl font-bold text-white">Expense Details</h3>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-white">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-gray-500 uppercase">User ID</label>
                                <p className="text-gray-200">{selectedExpense.userId}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase">Description</label>
                                <p className="text-gray-200">{selectedExpense.description}</p>
                            </div>
                            <div className="flex gap-4">
                                <div>
                                    <label className="text-xs text-gray-500 uppercase">Amount</label>
                                    <p className="text-2xl font-bold text-white">${selectedExpense.amount}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase">Status</label>
                                    <p className="text-gray-200 mt-2">{selectedExpense.status}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 bg-gray-900/50 p-3 rounded-lg border border-gray-700/50">
                                <div>
                                    <label className="text-xs text-blue-400 uppercase font-semibold">Start Date (Extracted)</label>
                                    <p className="text-gray-300 text-sm">{selectedExpense.timestamp ? new Date(parseInt(selectedExpense.timestamp) * 1000).toLocaleDateString() : 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-blue-400 uppercase font-semibold">R.U.T</label>
                                    <p className="text-gray-300 text-sm">{selectedExpense.extractedData?.rut || 'Not detected'}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-blue-400 uppercase font-semibold">Document No.</label>
                                    <p className="text-gray-300 text-sm">{selectedExpense.extractedData?.number || 'Not detected'}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-blue-400 uppercase font-semibold">Total (Extracted)</label>
                                    <p className="text-gray-300 text-sm">{selectedExpense.extractedData?.amount ? `$${selectedExpense.extractedData.amount}` : 'Not detected'}</p>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase mb-2 block">Receipt Image</label>
                                {selectedExpense.imageUrl ? (
                                    <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700 relative group">
                                        <img
                                            src={selectedExpense.imageUrl}
                                            alt="Receipt"
                                            className="w-full h-64 object-contain bg-black/50"
                                        />
                                        <a
                                            href={selectedExpense.imageUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <span className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">Open Full Size</span>
                                        </a>
                                    </div>
                                ) : (
                                    <div className="bg-gray-900 rounded-lg h-40 flex items-center justify-center border border-gray-700">
                                        <span className="text-gray-600 italic">No image available</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end gap-3">
                            <button onClick={handleCloseModal} className="px-4 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors">Close</button>
                            {selectedExpense.status !== 'APPROVED' ? (
                                <button
                                    onClick={handleApprove}
                                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/20"
                                >
                                    Approve Expense
                                </button>
                            ) : (
                                <button
                                    disabled
                                    className="px-4 py-2 rounded-lg bg-green-500/20 text-green-400 border border-green-500/30 cursor-default"
                                >
                                    Approved
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Expenses;
