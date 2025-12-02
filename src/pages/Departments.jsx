import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';

function Departments() {
    const [departments, setDepartments] = useState([]);
    const [newDept, setNewDept] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            // const response = await axios.get(`${config.apiGateway.URL}/departments`);
            // setDepartments(response.data);
            // Mock data for now
            setDepartments([
                { id: '1', name: 'Gastos de iglesia' },
                { id: '2', name: 'Ministerio personal' },
                { id: '3', name: 'Ministerio de la mujer' }
            ]);
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    const handleAdd = async () => {
        if (!newDept) return;
        setLoading(true);
        try {
            // await axios.post(`${config.apiGateway.URL}/departments`, { name: newDept });
            // fetchDepartments();
            setDepartments([...departments, { id: Date.now().toString(), name: newDept }]);
            setNewDept('');
        } catch (error) {
            console.error('Error adding department:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Departments</h2>

            <div className="bg-white p-6 rounded-lg shadow mb-6">
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={newDept}
                        onChange={(e) => setNewDept(e.target.value)}
                        placeholder="New Department Name"
                        className="flex-1 border p-2 rounded"
                    />
                    <button
                        onClick={handleAdd}
                        disabled={loading}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        {loading ? 'Adding...' : 'Add Department'}
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {departments.map((dept) => (
                            <tr key={dept.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{dept.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button className="text-red-600 hover:text-red-900">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Departments;
