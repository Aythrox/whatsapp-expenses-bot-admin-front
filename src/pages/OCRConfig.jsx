import React from 'react';

function OCRConfig() {
    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">OCR Configuration</h2>
            <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-gray-600 mb-4">Upload a sample document to define extraction templates.</p>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                    <button className="bg-gray-800 text-white px-6 py-3 rounded hover:bg-gray-700">
                        Upload Sample Document
                    </button>
                </div>
            </div>
        </div>
    );
}

export default OCRConfig;
