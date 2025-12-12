import React, { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ToastContainer';
import { useConfirm } from '../components/ConfirmDialog';

const Employees = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ phone: '', name: '' });
    const [csvFile, setCsvFile] = useState(null);
    const { addToast } = useToast();
    const { confirm } = useConfirm();

    const { activeTenantId } = useAuth(); // Assuming useAuth is imported or available

    useEffect(() => {
        if (activeTenantId) {
            fetchEmployees();
        } else {
            setLoading(false);
        }
    }, [activeTenantId]);

    const fetchEmployees = async () => {
        if (!activeTenantId) return;
        try {
            setLoading(true);
            const response = await api.get('/admin/employees');
            setEmployees(response.data);
        } catch (error) {
            console.error('Error fetching employees:', error);
            addToast('Error fetching employees', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSingleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!formData.phone) return;

            await api.post('/admin/employees', {
                employees: [{ phone: formData.phone, name: formData.name }]
            });

            addToast('Employee added successfully', 'success');
            setFormData({ phone: '', name: '' });
            fetchEmployees();
        } catch (error) {
            console.error('Error adding employee:', error);
            addToast('Failed to add employee', 'error');
        }
    };

    const handleCsvUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            const text = event.target.result;
            const lines = text.split('\n');
            const data = [];

            lines.forEach(line => {
                const parts = line.split(',');
                if (parts.length >= 1) {
                    const phone = parts[0].trim();
                    // Basic cleaning
                    if (phone) {
                        data.push({
                            phone: phone,
                            name: parts[1] ? parts[1].trim() : ''
                        });
                    }
                }
            });

            if (data.length === 0) {
                addToast('No valid data found in CSV', 'warning');
                return;
            }

            const isConfirmed = await confirm({
                title: 'Confirm Upload',
                message: `Are you sure you want to upload ${data.length} employees?`
            });

            if (isConfirmed) {
                try {
                    await api.post('/admin/employees', { employees: data });
                    addToast(`Successfully verified/added ${data.length} employees`, 'success');
                    fetchEmployees();
                } catch (error) {
                    console.error("Upload error", error);
                    addToast('Failed to upload employees', 'error');
                }
            }
            e.target.value = null; // Reset input
        };
        reader.readAsText(file);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    Employees
                </h2>
            </div>

            {!activeTenantId ? (
                <div className="bg-yellow-500/10 border border-yellow-500/20 p-6 rounded-2xl text-center text-yellow-200">
                    Please select a company from the top-left dropdown to manage employees.
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Single Add Form */}
                        <div className="bg-gray-900/50 backdrop-blur border border-gray-800 p-6 rounded-2xl">
                            <h3 className="text-lg font-semibold text-gray-200 mb-4">Add Single Employee</h3>
                            <form onSubmit={handleSingleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Phone Number</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="e.g. 56912345678"
                                        className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Name (Optional)</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="e.g. John Doe"
                                        className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 rounded-lg transition-colors shadow-lg shadow-blue-500/20"
                                >
                                    Add Employee
                                </button>
                            </form>
                        </div>

                        {/* CSV Upload */}
                        <div className="bg-gray-900/50 backdrop-blur border border-gray-800 p-6 rounded-2xl">
                            <h3 className="text-lg font-semibold text-gray-200 mb-4">Bulk Upload (CSV)</h3>
                            <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center hover:border-blue-500/50 transition-colors">
                                <p className="text-gray-400 mb-2">Upload a CSV file with format:</p>
                                <code className="bg-gray-800 px-2 py-1 rounded text-sm text-blue-300 font-mono">phone,name</code>
                                <div className="mt-6">
                                    <input
                                        type="file"
                                        accept=".csv"
                                        onChange={handleCsvUpload}
                                        className="hidden"
                                        id="csv-upload"
                                    />
                                    <label
                                        htmlFor="csv-upload"
                                        className="cursor-pointer bg-gray-800 hover:bg-gray-700 text-gray-300 px-6 py-2 rounded-lg border border-gray-600 transition-all inline-flex items-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                        Select CSV File
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* List */}
                    <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
                        <div className="px-6 py-4 border-b border-gray-800">
                            <h3 className="text-lg font-semibold text-gray-200">Authorized Employees</h3>
                        </div>
                        {loading ? (
                            <div className="p-8 text-center text-gray-500">Loading...</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-800/30 text-gray-400 text-sm uppercase tracking-wider">
                                            <th className="px-6 py-3 font-medium">Phone</th>
                                            <th className="px-6 py-3 font-medium">Name</th>
                                            <th className="px-6 py-3 font-medium">Verified At</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-800">
                                        {employees.length > 0 ? (
                                            employees.map((emp, index) => (
                                                <tr key={index} className="hover:bg-gray-800/20 transition-colors">
                                                    <td className="px-6 py-4 text-gray-300 font-mono">{emp.phone}</td>
                                                    <td className="px-6 py-4 text-gray-300">{emp.name || '-'}</td>
                                                    <td className="px-6 py-4 text-gray-500 text-sm">
                                                        {emp.createdAt ? new Date(parseInt(emp.createdAt) * 1000).toLocaleDateString() : '-'}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3" className="px-6 py-8 text-center text-gray-500 italic">
                                                    No employees found. Start by adding one.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default Employees;
