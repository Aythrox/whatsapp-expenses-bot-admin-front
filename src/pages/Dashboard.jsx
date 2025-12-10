import React, { useState } from 'react';
import { useToast } from '../components/ToastContainer';

function Dashboard() {
    const [generatingReport, setGeneratingReport] = useState(false);
    const [reportStatus, setReportStatus] = useState('');
    const { showSuccess } = useToast();

    const handleGenerateReport = () => {
        setGeneratingReport(true);
        setReportStatus('');

        // Simulate PDF generation
        setTimeout(() => {
            setGeneratingReport(false);
            setReportStatus('Report generated successfully! (Mock download)');
            // In a real app, this would trigger a file download
            showSuccess('Report downloaded: Expenses_Report_2025.pdf');
        }, 1500);
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
                    <p className="text-gray-400 text-sm mt-1">Welcome back, here's what's happening today.</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <button
                        onClick={handleGenerateReport}
                        disabled={generatingReport}
                        className="bg-gray-800 border border-gray-700 text-gray-200 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors shadow-lg shadow-gray-900/20 disabled:opacity-50 disabled:cursor-wait flex items-center gap-2"
                    >
                        {generatingReport ? (
                            <>
                                <svg className="animate-spin h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Generating...
                            </>
                        ) : 'Generate Report'}
                    </button>
                    {reportStatus && <p className="text-xs text-green-400">{reportStatus}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 shadow-xl hover:border-gray-600 transition-all duration-300 group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <span className="text-xs font-semibold text-green-400 bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20">+12%</span>
                    </div>
                    <h3 className="text-gray-400 text-sm font-medium">Total Expenses</h3>
                    <p className="text-3xl font-bold text-white mt-2">128</p>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 shadow-xl hover:border-gray-600 transition-all duration-300 group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-yellow-500/10 rounded-lg group-hover:bg-yellow-500/20 transition-colors">
                            <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <span className="text-xs font-semibold text-yellow-400 bg-yellow-500/10 px-2 py-1 rounded-full border border-yellow-500/20">Action Needed</span>
                    </div>
                    <h3 className="text-gray-400 text-sm font-medium">Pending Review</h3>
                    <p className="text-3xl font-bold text-white mt-2">12</p>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 shadow-xl hover:border-gray-600 transition-all duration-300 group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-green-500/10 rounded-lg group-hover:bg-green-500/20 transition-colors">
                            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <span className="text-xs font-semibold text-gray-400 bg-gray-700/50 px-2 py-1 rounded-full border border-gray-600">Last 30 days</span>
                    </div>
                    <h3 className="text-gray-400 text-sm font-medium">Approved</h3>
                    <p className="text-3xl font-bold text-white mt-2">110</p>
                </div>
            </div>

            {/* Recent Activity Section */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700 p-6">
                <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-xl hover:bg-gray-700/50 transition-colors cursor-pointer border border-transparent hover:border-gray-600">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold text-sm border border-blue-500/20">JS</div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-200">John Smith submitted an expense</p>
                                    <p className="text-xs text-gray-500">2 hours ago</p>
                                </div>
                            </div>
                            <span className="text-sm font-bold text-gray-300">$45.00</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
