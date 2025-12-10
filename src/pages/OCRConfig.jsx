import React, { useRef, useState, useEffect } from 'react';
import api from '../api';
import { useToast } from '../components/ToastContainer';
import { useConfirm } from '../components/ConfirmDialog';

function OCRConfig() {
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [scanResult, setScanResult] = useState(null);
    const [templates, setTemplates] = useState([]);
    const [newTemplateName, setNewTemplateName] = useState('');
    const [mapping, setMapping] = useState({ rut: null, number: null, amount: null });
    const { showError, showSuccess } = useToast();
    const { confirm } = useConfirm();

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            const res = await api.get('/admin/ocr-templates');
            setTemplates(res.data);
        } catch (e) {
            console.error(e);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            processFile(file);
        }
    };

    const processFile = (file) => {
        setUploading(true);
        setScanResult(null);
        setMapping({ rut: null, number: null, amount: null });

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64 = reader.result;
            try {
                const response = await api.post('/admin/ocr-debug', { imageBase64: base64 });
                setScanResult(response.data);
                showSuccess('Document analyzed successfully!');
            } catch (error) {
                console.error(error);
                showError('Failed to analyze document.');
            } finally {
                setUploading(false);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleAssign = (field, key, value) => {
        setMapping(prev => ({
            ...prev,
            [field]: { key, value }
        }));
    };

    const saveTemplate = async () => {
        // We need at least a RUT to identify the vendor
        const vendorRut = mapping.rut?.value || scanResult?.rut;

        if (!vendorRut) {
            return showError('Error: Could not identify a RUT for this vendor. Please assign the RUT field first.');
        }

        try {
            await api.post('/admin/ocr-templates', {
                name: `Template for ${vendorRut}`,
                vendorRut: vendorRut,
                mapping: {
                    rut_key: mapping.rut?.key,
                    number_key: mapping.number?.key,
                    amount_key: mapping.amount?.key
                }
            });
            showSuccess(`Template saved for ${vendorRut}!`);
            setMapping({ rut: null, number: null, amount: null });
            fetchTemplates();
        } catch (e) {
            showError('Failed to save template');
        }
    };

    const deleteTemplate = async (id) => {
        const isConfirmed = await confirm({
            title: 'Delete Template',
            message: 'Are you sure you want to delete this OCR template? This action cannot be undone.',
            confirmText: 'Delete',
            type: 'danger'
        });

        if (!isConfirmed) return;

        try {
            console.log("Deleting template ID:", id);
            await api.delete(`/admin/ocr-templates/${id}`);
            showSuccess('Template deleted');
            fetchTemplates();
        } catch (e) {
            console.error(e);
            showError('Failed to delete template');
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-white">OCR Templates</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Upload Section */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 shadow-xl p-8">
                    <h3 className="text-xl font-bold text-white mb-4">1. Upload Sample & Map Fields</h3>
                    <p className="text-gray-400 mb-6">Upload a receipt. If values are wrong, assign the correct fields from the list below.</p>

                    <div
                        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 mb-8 ${uploading ? 'border-blue-500/50 bg-blue-500/5' : 'border-gray-600 hover:border-gray-500 hover:bg-gray-800'}`}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/*"
                        />

                        {uploading ? (
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                                <p className="text-blue-400 animate-pulse">Analyzing...</p>
                            </div>
                        ) : (
                            <button
                                onClick={handleUploadClick}
                                className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-500 transition-all font-medium"
                            >
                                Select Receipt Image
                            </button>
                        )}
                    </div>

                    {scanResult && (
                        <div className="space-y-6">
                            {/* Draft Mapping Display */}
                            <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
                                <h4 className="text-sm font-bold text-blue-400 uppercase mb-3">Target Mapping</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400">Vendor RUT:</span>
                                        <span className={`font-mono ${mapping.rut || scanResult.rut ? 'text-green-400' : 'text-red-400'}`}>
                                            {mapping.rut?.value || scanResult.rut || 'Not assigned'}
                                            {mapping.rut && <span className="text-gray-600 text-xs ml-2">(Key: {mapping.rut.key})</span>}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400">Document No:</span>
                                        <span className={`font-mono ${mapping.number || scanResult.number ? 'text-green-400' : 'text-red-400'}`}>
                                            {mapping.number?.value || scanResult.number || 'Not assigned'}
                                            {mapping.number && <span className="text-gray-600 text-xs ml-2">(Key: {mapping.number.key})</span>}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400">Amount:</span>
                                        <span className={`font-mono ${mapping.amount || scanResult.amount ? 'text-green-400' : 'text-red-400'}`}>
                                            {mapping.amount?.value || scanResult.amount || 'Not assigned'}
                                            {mapping.amount && <span className="text-gray-600 text-xs ml-2">(Key: {mapping.amount.key})</span>}
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-800 flex justify-end">
                                    <button
                                        onClick={saveTemplate}
                                        disabled={!mapping.rut && !scanResult.rut}
                                        className="bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg hover:bg-green-500 text-sm font-medium transition-colors"
                                    >
                                        Save Mapping Template
                                    </button>
                                </div>
                            </div>

                            {/* KV List */}
                            <div>
                                <p className="text-blue-400 font-bold mb-2 text-sm uppercase flex justify-between">
                                    <span>Detected Fields</span>
                                    <span className="text-xs normal-case text-gray-500">Click buttons to map</span>
                                </p>
                                <div className="max-h-96 overflow-y-auto bg-gray-900 rounded-lg border border-gray-700 text-sm">
                                    {Object.entries(scanResult.all_pairs || {}).length === 0 ? (
                                        <p className="text-gray-600 italic p-4">No key-value pairs detected.</p>
                                    ) : (
                                        Object.entries(scanResult.all_pairs).map(([key, val]) => (
                                            <div key={key} className="flex flex-col sm:flex-row border-b border-gray-800 p-2 gap-2 hover:bg-gray-800/50 transition-colors">
                                                <div className="flex-1 min-w-0">
                                                    <span className="text-orange-400 font-mono text-xs block truncate" title={key}>{key}</span>
                                                    <span className="text-gray-200 break-words">{val}</span>
                                                </div>
                                                <div className="flex gap-1 shrink-0">
                                                    <button
                                                        onClick={() => handleAssign('rut', key, val)}
                                                        className={`px-2 py-1 rounded text-xs font-bold border transition-colors ${mapping.rut?.key === key ? 'bg-blue-500 text-white border-blue-500' : 'text-gray-500 border-gray-700 hover:border-gray-500 hover:text-gray-300'}`}
                                                        title="Assign as Vendor RUT"
                                                    >
                                                        RUT
                                                    </button>
                                                    <button
                                                        onClick={() => handleAssign('number', key, val)}
                                                        className={`px-2 py-1 rounded text-xs font-bold border transition-colors ${mapping.number?.key === key ? 'bg-blue-500 text-white border-blue-500' : 'text-gray-500 border-gray-700 hover:border-gray-500 hover:text-gray-300'}`}
                                                        title="Assign as Doc Number"
                                                    >
                                                        No.
                                                    </button>
                                                    <button
                                                        onClick={() => handleAssign('amount', key, val)}
                                                        className={`px-2 py-1 rounded text-xs font-bold border transition-colors ${mapping.amount?.key === key ? 'bg-blue-500 text-white border-blue-500' : 'text-gray-500 border-gray-700 hover:border-gray-500 hover:text-gray-300'}`}
                                                        title="Assign as Amount"
                                                    >
                                                        $
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Templates List */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 shadow-xl p-8">
                    <h3 className="text-xl font-bold text-white mb-4">2. Active Templates</h3>
                    <div className="space-y-3">
                        {templates.length === 0 && <p className="text-gray-500 text-center py-4">No templates yet.</p>}
                        {templates.map(t => (
                            <div key={t.SK} className="bg-gray-900/50 p-4 rounded-xl border border-gray-700 hover:border-gray-600 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className="text-white font-medium">{t.name}</h4>
                                        <p className="text-xs text-gray-500 font-mono mt-1">ID: {t.vendorRut}</p>
                                    </div>
                                    <button
                                        onClick={() => deleteTemplate(t.templateId)}
                                        className="text-red-400 hover:text-red-300 p-1.5 hover:bg-red-400/10 rounded-lg transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-xs border-t border-gray-800 pt-2 mt-2">
                                    <div>
                                        <span className="text-gray-500 block">RUT Key</span>
                                        <span className="text-blue-400 font-mono truncate block">{t.mapping?.rut_key || '-'}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 block">Num Key</span>
                                        <span className="text-blue-400 font-mono truncate block">{t.mapping?.number_key || '-'}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 block">Amt Key</span>
                                        <span className="text-blue-400 font-mono truncate block">{t.mapping?.amount_key || '-'}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OCRConfig;
