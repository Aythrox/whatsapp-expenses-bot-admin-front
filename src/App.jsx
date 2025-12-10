import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import BackgroundParticles from './components/BackgroundParticles';
import { ToastProvider } from './components/ToastContainer';
import { ConfirmProvider } from './components/ConfirmDialog';

// Pages
import Dashboard from './pages/Dashboard';
import Departments from './pages/Departments';
import Expenses from './pages/Expenses';
import OCRConfig from './pages/OCRConfig';
import Login from './pages/Login';
import BotMessages from './pages/BotMessages'; // New page
import ToastDemo from './pages/ToastDemo'; // Demo page

const NavItem = ({ to, label }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link to={to} className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${isActive ? 'bg-blue-600/10 text-blue-400' : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'}`}>
            <span className="font-medium">{label}</span>
            {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>}
        </Link>
    );
}

const Layout = () => {
    const { user, logout } = useAuth();

    return (
        <div className="flex h-screen overflow-hidden text-gray-100 font-sans selection:bg-blue-500/30">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900/80 backdrop-blur-xl border-r border-gray-800 z-10 flex flex-col shadow-2xl">
                <div className="p-6 border-b border-gray-800/50">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                        Expenses Bot
                    </h1>
                    <div className="flex items-center gap-2 mt-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <p className="text-xs text-gray-500 font-medium tracking-wide">SYSTEM ONLINE</p>
                    </div>
                </div>
                <nav className="flex-1 overflow-y-auto py-6">
                    <ul className="space-y-1 px-3">
                        <li><NavItem to="/" label="Dashboard" /></li>
                        <li><NavItem to="/expenses" label="Expenses" /></li>
                        <li><NavItem to="/departments" label="Departments" /></li>
                        <li><NavItem to="/bot-messages" label="Bot Messages" /></li>
                        <li><NavItem to="/ocr-config" label="OCR Config" /></li>
                        <li><NavItem to="/toast-demo" label="Toast Demo" /></li>
                    </ul>
                </nav>
                <div className="p-4 border-t border-gray-800/50 bg-gray-900/50">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                            {user?.email?.[0]?.toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium text-gray-200 truncate">{user?.email}</p>
                            <p className="text-xs text-gray-500">{user?.role || 'Admin'}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="w-full px-4 py-2 text-sm font-medium text-red-400 bg-red-500/10 rounded-lg hover:bg-red-500/20 transition-all duration-200 flex items-center justify-center gap-2 border border-red-500/10 hover:border-red-500/20"
                    >
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative z-10">
                <div className="max-w-7xl mx-auto p-8">
                    <div className="bg-gray-900/40 backdrop-blur-md rounded-3xl border border-gray-800 p-8 shadow-xl min-h-[calc(100vh-4rem)]">
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/expenses" element={<Expenses />} />
                            <Route path="/departments" element={<Departments />} />
                            <Route path="/bot-messages" element={<BotMessages />} />
                            <Route path="/ocr-config" element={<OCRConfig />} />
                            <Route path="/toast-demo" element={<ToastDemo />} />
                        </Routes>
                    </div>
                </div>
            </main>
        </div>
    );
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <ToastProvider>
                    <ConfirmProvider>
                        <BackgroundParticles />
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route element={<ProtectedRoute />}>
                                <Route path="/*" element={<Layout />} />
                            </Route>
                        </Routes>
                    </ConfirmProvider>
                </ToastProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
