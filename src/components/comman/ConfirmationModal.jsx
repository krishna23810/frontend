import React from 'react';

export default function ConfirmationModal({ modalData }) {
    if (!modalData) return null;

    const { text1, text2, btn1Text, btn2Text, btn1Handler, btn2Handler } = modalData;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Confirmation</h2>
                <p className="text-gray-700 mb-2">{text1}</p>
                <p className="text-gray-600 mb-4">{text2}</p>
                <div className="flex justify-end gap-3">
                    <button 
                        onClick={btn2Handler} 
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors"
                    >
                        {btn2Text}
                    </button>
                    <button 
                        onClick={btn1Handler} 
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    >
                        {btn1Text}
                    </button>
                </div>
            </div>
        </div>
    )
}
