import React, { createContext, useState, useContext, useEffect } from 'react';
import api, { setAuthToken } from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            setAuthToken(token);
            const savedUser = localStorage.getItem('user');
            if (savedUser) {
                try {
                    setUser(JSON.parse(savedUser));
                } catch (e) {
                    console.error("Failed to parse user from local storage", e);
                }
            }
        }
        setLoading(false);

        // Listen for unauthorized events (dispatched by api interceptor)
        const handleUnauthorized = () => {
            console.warn("Session expired. Logging out in 2s.");
            // Wait a bit to let the user see the Toast
            setTimeout(() => {
                logout();
            }, 2000);
        };

        window.addEventListener('auth:unauthorized', handleUnauthorized);

        return () => {
            window.removeEventListener('auth:unauthorized', handleUnauthorized);
        };
    }, [token]);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            setToken(token);
            setUser(user);
            setAuthToken(token);
            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        setAuthToken(null);
    };

    const [activeTenantId, setActiveTenantId] = useState(localStorage.getItem('activeTenantId'));

    useEffect(() => {
        if (activeTenantId) {
            localStorage.setItem('activeTenantId', activeTenantId);
        } else {
            localStorage.removeItem('activeTenantId');
        }
    }, [activeTenantId]);

    const impersonateTenant = (tenantId) => {
        setActiveTenantId(tenantId);
    };

    const [tenants, setTenants] = useState([]);
    const [loadingTenants, setLoadingTenants] = useState(false);

    const fetchTenants = async () => {
        // Only fetch if we have a user and they are super_admin
        // We check 'user' from state, but inside useEffect we might want to check the immediate value or rely on the effect dependency.
        // It's safer to check inside the function or trust the caller.
        try {
            setLoadingTenants(true);
            const response = await api.get('/admin/tenants');
            setTenants(response.data);
        } catch (error) {
            console.error("Failed to fetch tenants", error);
        } finally {
            setLoadingTenants(false);
        }
    };

    useEffect(() => {
        if (user?.role === 'super_admin') {
            fetchTenants();
        }
    }, [user]);

    return (
        <AuthContext.Provider value={{
            user,
            token,
            login,
            logout,
            loading,
            activeTenantId,
            impersonateTenant,
            tenants,
            fetchTenants,
            loadingTenants
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
