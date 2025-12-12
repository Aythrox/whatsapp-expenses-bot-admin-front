import React, { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ToastContainer';

function Tenants() {
    const { user, impersonateTenant, tenants, fetchTenants, loadingTenants } = useAuth();
    const [newTenant, setNewTenant] = useState('');
    const [creating, setCreating] = useState(false);

    // User Creation State
    const [selectedTenantUser, setSelectedTenantUser] = useState(null); // ID of tenant to add user to
    const [newUserEmail, setNewUserEmail] = useState('');
    const [newUserPhone, setNewUserPhone] = useState('');
    const [newUserPassword, setNewUserPassword] = useState('');
    const [newUserRole, setNewUserRole] = useState('admin');
    const [creatingUser, setCreatingUser] = useState(false);

    // Edit Tenant State
    const [editingTenant, setEditingTenant] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', plan: 'starter', whatsappPhoneId: '' });
    const [updating, setUpdating] = useState(false);

    const { showSuccess, showError } = useToast();

    const handleCreateTenant = async (e) => {
        e.preventDefault();
        if (!newTenant.trim()) return;

        try {
            setCreating(true);
            await api.post('/admin/tenants', { name: newTenant, plan: 'starter' });
            await fetchTenants(); // Refresh global list
            setNewTenant('');
            showSuccess('Tenant created successfully');
        } catch (error) {
            console.error(error);
            showError('Failed to create tenant');
        } finally {
            setCreating(false);
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        if (!newUserEmail || !newUserPassword || !selectedTenantUser) return;

        try {
            setCreatingUser(true);
            await api.post('/admin/users', {
                email: newUserEmail,
                password: newUserPassword,
                role: newUserRole,
                tenantId: selectedTenantUser,
                phoneNumber: newUserPhone
            });
            showSuccess('User created successfully');
            setNewUserEmail('');
            setNewUserPhone('');
            setNewUserPassword('');
            setSelectedTenantUser(null);
        } catch (error) {
            console.error(error);
            showError(error.response?.data?.message || 'Failed to create user');
        } finally {
            setCreatingUser(false);
        }
    };

    const handleEditClick = (tenant) => {
        setEditingTenant(tenant);
        setEditForm({
            name: tenant.name,
            plan: tenant.plan || 'starter',
            whatsappPhoneId: tenant.whatsappPhoneId || ''
        });
    };

    const handleUpdateTenant = async (e) => {
        e.preventDefault();
        if (!editingTenant) return;

        try {
            setUpdating(true);
            // Send ID in body. Using PUT on the collection root is a valid pattern for batch/id-payload updates.
            await api.put(`/admin/tenants`, { id: editingTenant.id, ...editForm });

            // Refresh global list
            await fetchTenants();

            showSuccess('Tenant updated successfully');
            setEditingTenant(null);
        } catch (error) {
            console.error(error);
            showError('Failed to update tenant');
        } finally {
            setUpdating(false);
        }
    };

    if (user?.role !== 'super_admin') {
        return (
            <div className="text-center p-12">
                <h2 className="text-xl text-red-400">Access Denied</h2>
                <p className="text-gray-400">Only Super Admins can access this page.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-white mb-2">Tenant Management</h2>
                <p className="text-gray-400">
                    Create and manage client companies. Use
                    <span className="text-blue-400 font-medium bg-blue-500/10 px-2 py-0.5 rounded mx-1">Manage As</span>
                    to access their dashboard and see exactly what they see (previously 'Impersonate').
                </p>
            </div>

            {/* Create Tenant */}
            <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700 shadow-xl">
                <h3 className="text-lg font-semibold text-blue-400 mb-4">Create New Company</h3>
                <form onSubmit={handleCreateTenant} className="flex gap-4">
                    <input
                        type="text"
                        value={newTenant}
                        onChange={(e) => setNewTenant(e.target.value)}
                        placeholder="Company Name"
                        className="flex-1 bg-gray-900 border border-gray-700 text-gray-200 p-3 rounded-xl focus:border-blue-500 outline-none"
                    />
                    <button
                        type="submit"
                        disabled={creating || !newTenant.trim()}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-medium disabled:opacity-50"
                    >
                        {creating ? 'Creating...' : 'Create Company'}
                    </button>
                </form>
            </div>

            {/* Tenants List */}
            <div className="bg-gray-800/50 rounded-2xl border border-gray-700 shadow-xl overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-900/50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Name</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">ID</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Plan</th>
                            <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700/50">
                        {tenants.map((tenant) => (
                            <tr key={tenant.id} className="hover:bg-gray-700/20">
                                <td className="px-6 py-4 text-gray-200 font-medium">{tenant.name}</td>
                                <td className="px-6 py-4 text-gray-500 font-mono text-xs">{tenant.id}</td>
                                <td className="px-6 py-4 text-gray-400 text-sm">{tenant.plan}</td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button
                                        onClick={() => impersonateTenant(tenant.id)}
                                        className="text-blue-400 hover:text-blue-300 text-sm border border-blue-500/30 px-3 py-1 rounded hover:bg-blue-500/10 transition-colors"
                                        title="Switch to this company's dashboard to manage their data directly."
                                    >
                                        Manage As
                                    </button>
                                    <button
                                        onClick={() => handleEditClick(tenant)}
                                        className="text-yellow-400 hover:text-yellow-300 text-sm border border-yellow-500/30 px-3 py-1 rounded hover:bg-yellow-500/10 transition-colors"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => setSelectedTenantUser(tenant.id)}
                                        className="text-green-400 hover:text-green-300 text-sm"
                                    >
                                        Add User
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add User Modal (Simple inline for now) */}
            {selectedTenantUser && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-800 p-8 rounded-2xl w-full max-w-md border border-gray-700 shadow-2xl">
                        <h3 className="text-xl font-bold text-white mb-4">Add User to Tenant</h3>
                        <form onSubmit={handleCreateUser} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={newUserEmail}
                                    onChange={(e) => setNewUserEmail(e.target.value)}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Password</label>
                                <input
                                    type="password"
                                    value={newUserPassword}
                                    onChange={(e) => setNewUserPassword(e.target.value)}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Phone Number (WhatsApp, e.g. 52155...)</label>
                                <input
                                    type="text"
                                    value={newUserPhone}
                                    onChange={(e) => setNewUserPhone(e.target.value)}
                                    placeholder="Optional"
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Role</label>
                                <select
                                    value={newUserRole}
                                    onChange={(e) => setNewUserRole(e.target.value)}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white"
                                >
                                    <option value="admin">Admin</option>
                                    <option value="viewer">Viewer</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setSelectedTenantUser(null)}
                                    className="px-4 py-2 text-gray-400 hover:text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={creatingUser}
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg"
                                >
                                    {creatingUser ? 'Creating...' : 'Create User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Edit Tenant Modal */}
            {editingTenant && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-800 p-8 rounded-2xl w-full max-w-md border border-gray-700 shadow-2xl">
                        <h3 className="text-xl font-bold text-white mb-4">Edit Subscription & Config</h3>
                        <form onSubmit={handleUpdateTenant} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Company Name</label>
                                <input
                                    type="text"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:border-blue-500 outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Subscription Plan</label>
                                <select
                                    value={editForm.plan}
                                    onChange={(e) => setEditForm({ ...editForm, plan: e.target.value })}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:border-blue-500 outline-none"
                                >
                                    <option value="starter">Starter (OCR Tier 1 - Basic)</option>
                                    <option value="pro">Pro (OCR Tier 2 - Enhanced)</option>
                                    <option value="enterprise">Enterprise (OCR Tier 3 - AWS Textract)</option>
                                </select>
                                <p className="text-xs text-gray-500 mt-1">
                                    Determines the OCR accuracy and cost level.
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">WhatsApp Phone ID (Bot ID)</label>
                                <input
                                    type="text"
                                    value={editForm.whatsappPhoneId}
                                    onChange={(e) => setEditForm({ ...editForm, whatsappPhoneId: e.target.value })}
                                    placeholder="e.g. 100012345678901"
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:border-blue-500 outline-none"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    The unique Phone Number ID from Meta used for this tenant's bot.
                                </p>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setEditingTenant(null)}
                                    className="px-4 py-2 text-gray-400 hover:text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={updating}
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                                >
                                    {updating ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Tenants;
