import React, { useState, useEffect } from 'react';
import api from '../api';
import { useToast } from '../components/ToastContainer';
import { useConfirm } from '../components/ConfirmDialog';

function Departments() {
    const [departments, setDepartments] = useState([]);
    const [newDept, setNewDept] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const { showSuccess, showError } = useToast();
    const { confirm } = useConfirm();

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            setFetching(true);
            const response = await api.get('/admin/departments');
            setDepartments(response.data);
        } catch (error) {
            console.error('Error fetching departments:', error);
            showError(error.response?.data?.message || 'Failed to load departments');
        } finally {
            setFetching(false);
        }
    };

    const handleAdd = async () => {
        if (!newDept.trim()) {
            showError('Please enter a department name');
            return;
        }

        setLoading(true);
        try {
            const response = await api.post('/admin/departments', { name: newDept.trim() });
            setDepartments([...departments, response.data]);
            setNewDept('');
            showSuccess('Department added successfully!');
        } catch (error) {
            console.error('Error adding department:', error);
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                'Failed to add department. Please try again.';
            showError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, name) => {
        const confirmed = await confirm({
            title: 'Delete Department',
            message: `Are you sure you want to delete "${name}"? This action cannot be undone.`,
            confirmText: 'Delete',
            cancelText: 'Cancel',
            type: 'danger'
        });

        if (!confirmed) return;

        try {
            await api.delete(`/admin/departments/${id}`);
            setDepartments(departments.filter(d => d.id !== id));
            showSuccess('Department deleted successfully');
        } catch (error) {
            console.error('Error deleting department:', error);
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                'Failed to delete department. Please try again.';
            showError(errorMessage);
        }
    };

    if (fetching) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading departments...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 text-white">Departments</h2>

            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 shadow-xl mb-6">
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={newDept}
                        onChange={(e) => setNewDept(e.target.value)}
                        placeholder="New Department Name"
                        className="flex-1 bg-gray-900 border border-gray-700 text-gray-200 p-3 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder-gray-600"
                        onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
                    />
                    <button
                        onClick={handleAdd}
                        disabled={loading || !newDept.trim()}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl transition-all shadow-lg shadow-blue-900/20 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Adding...' : 'Add Department'}
                    </button>
                </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 shadow-xl overflow-hidden">
                {departments.length === 0 ? (
                    <div className="p-12 text-center">
                        <p className="text-gray-500">No departments yet. Add one above!</p>
                    </div>
                ) : (
                    <table className="min-w-full">
                        <thead className="bg-gray-900/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700/50">
                            {departments.map((dept) => (
                                <tr key={dept.id} className="hover:bg-gray-700/20 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-300 font-medium">{dept.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleDelete(dept.id, dept.name)}
                                            className="text-red-400 hover:text-red-300 transition-colors bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-lg border border-red-500/10"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default Departments;
