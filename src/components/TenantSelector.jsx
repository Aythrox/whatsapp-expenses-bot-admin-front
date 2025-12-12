import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { useToast } from './ToastContainer';

function TenantSelector() {
    const { user, activeTenantId, impersonateTenant, tenants, loadingTenants } = useAuth();
    // const [tenants, setTenants] = useState([]); // Removed local state
    // const [loading, setLoading] = useState(false); // Removed local state
    // const { showError } = useToast();

    // Only fetch if super_admin
    const isSuperAdmin = user?.role === 'super_admin';

    // useEffect(() => { ... }, [isSuperAdmin]); // Removed local fetch

    // const fetchTenants = async () => { ... }; // Removed local fetch

    if (!isSuperAdmin) return null;

    return (
        <div className="mb-4 px-2">
            <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">
                Select Company
            </label>
            <select
                value={activeTenantId || ''}
                onChange={(e) => impersonateTenant(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none"
                disabled={loadingTenants}
            >
                <option value="">-- Select Company --</option>
                {tenants.map((tenant) => (
                    <option key={tenant.id} value={tenant.id}>
                        {tenant.name}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default TenantSelector;
