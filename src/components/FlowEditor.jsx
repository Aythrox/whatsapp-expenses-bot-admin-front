import React, { useState, useEffect } from 'react';
import { TrashIcon, PlusIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const NODE_TYPES = [
    { value: 'message', label: 'Simple Message' },
    { value: 'interactive', label: 'Interactive (Buttons)' },
    { value: 'input', label: 'Wait for Input' },
    { value: 'action', label: 'Trigger Action' },
];

const ACTIONS = [
    { value: 'save_expense', label: 'Save Expense' },
    { value: 'get_history', label: 'Get History' },
];

function FlowEditor({ initialConfig, onSave, onCancel }) {
    const [config, setConfig] = useState(initialConfig || { nodes: {}, start_node: '' });
    const [selectedNodeId, setSelectedNodeId] = useState(null);
    const [nodes, setNodes] = useState([]);

    useEffect(() => {
        if (initialConfig && initialConfig.nodes) {
            setNodes(Object.entries(initialConfig.nodes).map(([id, node]) => ({ id, ...node })));
            if (!selectedNodeId && initialConfig.start_node) {
                setSelectedNodeId(initialConfig.start_node);
            }
        }
    }, [initialConfig]);

    const handleAddNode = () => {
        const id = `node_${Date.now()}`;
        const newNode = { id, type: 'message', text: 'New Message', next: '' };
        const newNodes = [...nodes, newNode];
        setNodes(newNodes);
        setSelectedNodeId(id);
        updateConfig(newNodes);
    };

    const handleDeleteNode = (id) => {
        if (window.confirm('Delete this node?')) {
            const newNodes = nodes.filter(n => n.id !== id);
            setNodes(newNodes);
            if (selectedNodeId === id) setSelectedNodeId(null);
            updateConfig(newNodes);
        }
    };

    const updateConfig = (currentNodes) => {
        const nodesObj = currentNodes.reduce((acc, curr) => {
            const { id, ...rest } = curr;
            acc[id] = rest;
            return acc;
        }, {});
        setConfig(prev => ({ ...prev, nodes: nodesObj }));
    };

    const handleNodeChange = (id, field, value) => {
        const updatedNodes = nodes.map(n => {
            if (n.id === id) {
                return { ...n, [field]: value };
            }
            return n;
        });
        setNodes(updatedNodes);
        updateConfig(updatedNodes);
    };

    const handleOptionChange = (nodeId, optionIndex, field, value) => {
        const updatedNodes = nodes.map(n => {
            if (n.id === nodeId) {
                const newOptions = [...(n.options || [])];
                newOptions[optionIndex] = { ...newOptions[optionIndex], [field]: value };
                return { ...n, options: newOptions };
            }
            return n;
        });
        setNodes(updatedNodes);
        updateConfig(updatedNodes);
    };

    const addOption = (nodeId) => {
        const updatedNodes = nodes.map(n => {
            if (n.id === nodeId) {
                const newOptions = [...(n.options || []), { id: `opt_${Date.now()}`, label: 'Option', next: '' }];
                return { ...n, options: newOptions };
            }
            return n;
        });
        setNodes(updatedNodes);
        updateConfig(updatedNodes);
    };

    const deleteOption = (nodeId, index) => {
        const updatedNodes = nodes.map(n => {
            if (n.id === nodeId) {
                const newOptions = n.options.filter((_, i) => i !== index);
                return { ...n, options: newOptions };
            }
            return n;
        });
        setNodes(updatedNodes);
        updateConfig(updatedNodes);
    };

    const handleSave = () => {
        onSave(config);
    };

    const renderNodeEditor = () => {
        const node = nodes.find(n => n.id === selectedNodeId);
        if (!node) return <div className="text-gray-500 text-center mt-20">Select a node to edit</div>;

        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                    <h3 className="text-lg font-medium text-white">Edit Node: <span className="text-blue-400 font-mono text-sm">{node.id}</span></h3>
                    <button onClick={() => handleDeleteNode(node.id)} className="text-red-400 hover:text-red-300">
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Type */}
                <div>
                    <label className="block text-xs uppercase text-gray-400 mb-1">Type</label>
                    <select
                        value={node.type}
                        onChange={(e) => handleNodeChange(node.id, 'type', e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-white text-sm"
                    >
                        {NODE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                </div>

                {/* Text / Body */}
                {node.type !== 'action' && (
                    <div>
                        <label className="block text-xs uppercase text-gray-400 mb-1">
                            {node.type === 'interactive' ? 'Body Text (displayed above buttons)' : 'Message Text / Question'}
                        </label>
                        <textarea
                            value={node.text || ''}
                            onChange={(e) => handleNodeChange(node.id, 'text', e.target.value)}
                            className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-white text-sm h-24"
                            placeholder={node.type === 'interactive' ? 'Enter the text explaining the options...' : 'Enter message text...'}
                        />
                        <p className="text-xs text-gray-500 mt-1">Use {'{variable}'} to insert dynamic data.</p>
                    </div>
                )}

                {/* Variable Name (Input only) */}
                {node.type === 'input' && (
                    <div>
                        <label className="block text-xs uppercase text-gray-400 mb-1">Save to Variable</label>
                        <input
                            type="text"
                            value={node.variable || ''}
                            onChange={(e) => handleNodeChange(node.id, 'variable', e.target.value)}
                            className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-white text-sm"
                            placeholder="e.g. user_age"
                        />
                    </div>
                )}

                {/* Action (Action only) */}
                {node.type === 'action' && (
                    <div>
                        <label className="block text-xs uppercase text-gray-400 mb-1">Action Function</label>
                        <select
                            value={node.action || ''}
                            onChange={(e) => handleNodeChange(node.id, 'action', e.target.value)}
                            className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-white text-sm"
                        >
                            <option value="">Select Action...</option>
                            {ACTIONS.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
                        </select>

                        <div className="mt-2">
                            <label className="block text-xs uppercase text-gray-400 mb-1">Next Step (After Action)</label>
                            <select
                                value={node.next || ''}
                                onChange={(e) => handleNodeChange(node.id, 'next', e.target.value)}
                                className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-white text-sm"
                            >
                                <option value="">End Flow</option>
                                {nodes.filter(n => n.id !== node.id).map(n => (
                                    <option key={n.id} value={n.id}>{n.id} ({n.type})</option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}

                {/* Interactive Options */}
                {node.type === 'interactive' && (
                    <div className="border border-gray-700 p-3 rounded bg-gray-800/30">
                        <div className="flex justify-between mb-2">
                            <label className="block text-xs uppercase text-gray-400">Buttons / Options</label>
                            <button onClick={() => addOption(node.id)} className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                                <PlusIcon className="w-3 h-3" /> Add
                            </button>
                        </div>

                        <div className="space-y-2">
                            {(node.options || []).map((opt, idx) => (
                                <div key={idx} className="flex gap-2 items-start">
                                    <div className="flex-1 space-y-1">
                                        <input
                                            placeholder="Label"
                                            value={opt.label || ''}
                                            onChange={(e) => handleOptionChange(node.id, idx, 'label', e.target.value)}
                                            className="w-full bg-gray-900 border border-gray-600 rounded px-2 py-1 text-xs text-white"
                                        />
                                        <input
                                            placeholder="ID (internal)"
                                            value={opt.id || ''}
                                            onChange={(e) => handleOptionChange(node.id, idx, 'id', e.target.value)}
                                            className="w-full bg-gray-900 border border-gray-600 rounded px-2 py-1 text-xs text-gray-400"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <select
                                            value={opt.next || ''}
                                            onChange={(e) => handleOptionChange(node.id, idx, 'next', e.target.value)}
                                            className="w-full bg-gray-900 border border-gray-600 rounded px-2 py-1 text-xs text-white"
                                        >
                                            <option value="">Next: None</option>
                                            {nodes.filter(n => n.id !== node.id).map(n => (
                                                <option key={n.id} value={n.id}>{n.id}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <button onClick={() => deleteOption(node.id, idx)} className="text-gray-500 hover:text-red-400 mt-1">
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="mt-3 pt-3 border-t border-gray-700">
                            <label className="block text-xs text-gray-400 mb-1">Dynamic Source (Optional)</label>
                            <select
                                value={node.start_dynamic_options || ''}
                                onChange={(e) => handleNodeChange(node.id, 'start_dynamic_options', e.target.value)}
                                className="w-full bg-gray-900 border border-gray-600 rounded p-1 text-xs text-white"
                            >
                                <option value="">None</option>
                                <option value="departments">Departments List</option>
                            </select>
                            {node.start_dynamic_options && (
                                <div className="mt-2">
                                    <label className="block text-xs text-gray-400 mb-1">Next Step (After Dynamic Selection)</label>
                                    <select
                                        value={node.next_after_selection || ''}
                                        onChange={(e) => handleNodeChange(node.id, 'next_after_selection', e.target.value)}
                                        className="w-full bg-gray-900 border border-gray-600 rounded p-1 text-xs text-white"
                                    >
                                        <option value="">End</option>
                                        {nodes.filter(n => n.id !== node.id).map(n => (
                                            <option key={n.id} value={n.id}>{n.id}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Next Node (Linear flow) */}
                {(node.type === 'message' || node.type === 'input') && (
                    <div>
                        <label className="block text-xs uppercase text-gray-400 mb-1">Next Step</label>
                        <select
                            value={node.next || ''}
                            onChange={(e) => handleNodeChange(node.id, 'next', e.target.value)}
                            className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-white text-sm"
                        >
                            <option value="">End Flow</option>
                            {nodes.filter(n => n.id !== node.id).map(n => (
                                <option key={n.id} value={n.id}>{n.id} ({n.type})</option>
                            ))}
                        </select>
                    </div>
                )}

            </div>
        );
    };

    return (
        <div className="grid grid-cols-12 gap-6 h-[600px] border border-gray-700 rounded-xl bg-gray-900/50 backdrop-blur overflow-hidden">
            {/* Sidebar List */}
            <div className="col-span-4 bg-gray-900/80 border-r border-gray-700 flex flex-col">
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="font-semibold text-white">Flow Nodes</h3>
                    <button onClick={handleAddNode} className="p-1 rounded hover:bg-gray-700 text-blue-400">
                        <PlusIcon className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {nodes.map(node => (
                        <div
                            key={node.id}
                            onClick={() => setSelectedNodeId(node.id)}
                            className={`p-3 rounded-lg cursor-pointer border transition-all ${selectedNodeId === node.id
                                ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/10'
                                : 'bg-gray-800/40 border-gray-700 text-gray-300 hover:bg-gray-800'
                                }`}
                        >
                            <div className="flex justify-between items-start">
                                <span className="font-mono text-xs text-blue-300 opacity-70">{node.id}</span>
                                {config.start_node === node.id && (
                                    <span className="text-[10px] bg-green-500/20 text-green-400 px-1 rounded uppercase">Start</span>
                                )}
                            </div>
                            <div className="font-medium truncate">{node.text || node.type}</div>
                            <div className="text-xs text-gray-500 mt-1 uppercase tracking-wider">{node.type}</div>
                        </div>
                    ))}
                </div>
                <div className="p-4 border-t border-gray-700 bg-gray-900">
                    <label className="block text-xs text-gray-400 mb-1">Start Node Rule</label>
                    <select
                        value={config.start_node || ''}
                        onChange={(e) => setConfig({ ...config, start_node: e.target.value })}
                        className="w-full bg-gray-800 border border-gray-600 rounded p-1 text-xs text-white"
                    >
                        <option value="">Select Start Node...</option>
                        {nodes.map(n => <option key={n.id} value={n.id}>{n.id}</option>)}
                    </select>
                </div>
            </div>

            {/* Editor Area */}
            <div className="col-span-8 p-6 overflow-y-auto">
                {renderNodeEditor()}

                <div className="mt-8 pt-6 border-t border-gray-700 flex justify-end gap-3">
                    <button onClick={onCancel} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium shadow-lg shadow-blue-500/20 transition-all">
                        Save Flow Configuration
                    </button>
                </div>
            </div>
        </div>
    );
}

export default FlowEditor;
