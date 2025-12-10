import React, { useState, useEffect } from 'react';
import api from '../api';
import { useToast } from '../components/ToastContainer';

const messagesList = [
    { key: 'WELCOME', label: 'Welcome Message' },
    { key: 'ASK_IMAGE', label: 'Ask for Receipt Image' },
    { key: 'ASK_DESC', label: 'Ask for Description' },
    { key: 'SUCCESS', label: 'Success Message' }
];

function BotMessages() {
    const [messages, setMessages] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { showSuccess, showError } = useToast();

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const response = await api.get('/admin/messages');
            const data = response.data.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.text }), {});
            setMessages(data);
        } catch (error) {
            console.error(error);
            showError('Failed to load bot messages');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (key, text) => {
        setSaving(true);
        try {
            await api.put('/admin/messages', { key, text });
            showSuccess('Message updated successfully!');
        } catch (error) {
            console.error(error);
            showError('Failed to save message. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading config...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-white">WhatsApp Bot Messages</h2>
                <p className="text-gray-400 mt-1">Customize the automated responses sent by the bot.</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {messagesList.map((item) => (
                    <div key={item.key} className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700/50 hover:border-blue-500/30 transition-colors">
                        <label className="block text-sm font-medium text-blue-400 mb-2">{item.label}</label>
                        <textarea
                            className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 text-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder-gray-600"
                            rows="3"
                            value={messages[item.key] || ''}
                            onChange={(e) => setMessages({ ...messages, [item.key]: e.target.value })}
                        />
                        <div className="mt-3 flex justify-end">
                            <button
                                onClick={() => handleSave(item.key, messages[item.key])}
                                disabled={saving}
                                className="bg-blue-600/80 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors backdrop-blur-sm"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-blue-900/20 border border-blue-900/50 p-4 rounded-xl flex items-start gap-3">
                <svg className="w-6 h-6 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm text-blue-200">
                    <p className="font-semibold mb-1">Integration Note</p>
                    <p>To connect your WhatsApp Business Account, update the <code>VERIFY_TOKEN</code> and <code>WHATSAPP_TOKEN</code> in your backend environment variables or Secrets Manager. The webhook URL is <code>https://.../webhook</code>.</p>
                </div>
            </div>
        </div>
    );
}

export default BotMessages;
