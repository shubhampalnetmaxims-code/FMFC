
import React from 'react';
import Toast from './Toast';
import { Toast as ToastType } from '../types';

interface ToastContainerProps {
    toasts: ToastType[];
    onRemove: (id: number) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
    return (
        <div className="fixed top-4 right-4 z-[100] w-full max-w-sm space-y-3">
            {toasts.map(toast => (
                <Toast key={toast.id} toast={toast} onRemove={onRemove} />
            ))}
        </div>
    );
};

export default ToastContainer;
