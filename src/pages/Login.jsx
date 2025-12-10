import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// BackgroundWaves removed
import { useAuth } from '../context/AuthContext';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, password);

        if (result.success) {
            navigate('/');
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden text-white font-sans selection:bg-blue-500/30">

            {/* Abstract Background Shapes (Optional layer on top of waves) */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/20 rounded-full mix-blend-screen filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2 animate-blob pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full mix-blend-screen filter blur-3xl opacity-20 translate-x-1/2 translate-y-1/2 animate-blob animation-delay-2000 pointer-events-none"></div>

            <div className="max-w-md w-full bg-gray-900/60 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-gray-800 relative z-10 transition-all duration-300 hover:shadow-blue-900/20 hover:border-gray-700">
                <div className="text-center mb-10">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-blue-600/20 rounded-2xl shadow-lg shadow-blue-600/10 border border-blue-500/20">
                            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                        Welcome Back
                    </h2>
                    <p className="text-gray-400 mt-2 text-sm">Enter your credentials to access the admin panel</p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1 ml-1">Email Address</label>
                            <input
                                type="email"
                                required
                                className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 focus:border-blue-500 focus:bg-gray-800 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 outline-none text-gray-200 placeholder-gray-600"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1 ml-1">Password</label>
                            <input
                                type="password"
                                required
                                className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 focus:border-blue-500 focus:bg-gray-800 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 outline-none text-gray-200 placeholder-gray-600"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 animate-shake">
                            <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span className="text-sm text-red-400 font-medium">{error}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 hover:-translate-y-0.5 focus:ring-4 focus:ring-blue-600/20 disabled:opacity-70 disabled:hover:translate-y-0 text-center transition-all duration-200 border border-white/10"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Signing in...</span>
                            </div>
                        ) : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;
