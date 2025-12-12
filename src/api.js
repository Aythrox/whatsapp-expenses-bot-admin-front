import axios from 'axios';
import config from './config';

const api = axios.create({
    baseURL: config.apiGateway.URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

// Add interceptor to inject Tenant ID
api.interceptors.request.use((config) => {
    const tenantId = localStorage.getItem('activeTenantId');
    // Don't send Tenant ID for auth endpoints to prevent CORS issues with preflight
    if (tenantId && !config.url.includes('/auth/')) {
        config.headers['X-Tenant-ID'] = tenantId;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Add interceptor to handle 401 Unauthorized
api.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if (error.response && error.response.status === 401) {
        // Token expired or invalid
        // Dispatch event for UI to handle (show toast then redirect)
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }
    return Promise.reject(error);
});

export default api;
