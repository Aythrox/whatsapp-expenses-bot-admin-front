import React from 'react';

function Dashboard() {
    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-500 text-sm font-medium">Total Expenses</h3>
                    <p className="text-3xl font-bold">128</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-500 text-sm font-medium">Pending Review</h3>
                    <p className="text-3xl font-bold text-yellow-500">12</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-500 text-sm font-medium">Approved</h3>
                    <p className="text-3xl font-bold text-green-500">110</p>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
