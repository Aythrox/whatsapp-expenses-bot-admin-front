import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import config from './config';

// Pages
import Dashboard from './pages/Dashboard';
import Departments from './pages/Departments';
import Expenses from './pages/Expenses';
import OCRConfig from './pages/OCRConfig';

Amplify.configure({
    Auth: {
        region: config.cognito.REGION,
        userPoolId: config.cognito.USER_POOL_ID,
        userPoolWebClientId: config.cognito.APP_CLIENT_ID,
    }
});

function App() {
    return (
        <Authenticator>
            {({ signOut, user }) => (
                <Router>
                    <div className="min-h-screen bg-gray-100 flex">
                        {/* Sidebar */}
                        <aside className="w-64 bg-white shadow-md">
                            <div className="p-6">
                                <h1 className="text-2xl font-bold text-gray-800">Expenses Bot</h1>
                                <p className="text-sm text-gray-500">Admin Panel</p>
                            </div>
                            <nav className="mt-6">
                                <Link to="/" className="block px-6 py-3 text-gray-700 hover:bg-gray-50">Dashboard</Link>
                                <Link to="/expenses" className="block px-6 py-3 text-gray-700 hover:bg-gray-50">Expenses</Link>
                                <Link to="/departments" className="block px-6 py-3 text-gray-700 hover:bg-gray-50">Departments</Link>
                                <Link to="/ocr-config" className="block px-6 py-3 text-gray-700 hover:bg-gray-50">OCR Config</Link>
                            </nav>
                            <div className="absolute bottom-0 w-64 p-6">
                                <button onClick={signOut} className="w-full px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600">Sign Out</button>
                            </div>
                        </aside>

                        {/* Main Content */}
                        <main className="flex-1 p-8 overflow-y-auto">
                            <Routes>
                                <Route path="/" element={<Dashboard />} />
                                <Route path="/expenses" element={<Expenses />} />
                                <Route path="/departments" element={<Departments />} />
                                <Route path="/ocr-config" element={<OCRConfig />} />
                            </Routes>
                        </main>
                    </div>
                </Router>
            )}
        </Authenticator>
    );
}

export default App;
