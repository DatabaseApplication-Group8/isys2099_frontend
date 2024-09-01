// AppoinmentStatusModal.tsx
import React from 'react';

interface AppointmentStatusModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirmCancellation: () => Promise<void>;
}

const AppoinmentStatusModal: React.FC<AppointmentStatusModalProps> = ({ isOpen, onClose, onConfirmCancellation }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>

            {/* Modal Content */}
            <div className="relative bg-white p-6 rounded-lg shadow-lg z-60">
                <h2 className="text-xl font-semibold mb-4">Cancel Appointment</h2>
                <p>Are you sure you want to cancel appointment?</p>
                <div className="mt-4 flex justify-end">
                    <button onClick={onClose} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md mr-2 hover:bg-gray-200">Cancel</button>
                    <button onClick={onConfirmCancellation} className="border-[2px] border-red-500 text-black px-4 py-2 rounded-md hover:bg-red-500">Confirm</button>
                </div>
            </div>
        
        </div>
    );
};

export default AppoinmentStatusModal;

