import React, { useState, useEffect } from 'react';

function Expenses() {
    const [expenses, setExpenses] = useState([]);

    useEffect(() => {
        // Mock data
        setExpenses([
            { userId: '56912345678', timestamp: '1638200000', description: 'Compra de materiales', amount: 15000, status: 'PROCESSING' },
            { userId: '56987654321', timestamp: '1638201000', description: 'Almuerzo equipo', amount: 25000, status: 'APPROVED' },
        ]);
    }, []);

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Expenses History</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {expenses.map((expense) => (
                            <tr key={expense.timestamp}>
                                <td className="px-6 py-4 whitespace-nowrap">{new Date(parseInt(expense.timestamp) * 1000).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{expense.userId}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{expense.description}</td>
                                <td className="px-6 py-4 whitespace-nowrap">${expense.amount}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${expense.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                            expense.status === 'PROCESSING' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                        {expense.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button className="text-indigo-600 hover:text-indigo-900">View</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Expenses;
