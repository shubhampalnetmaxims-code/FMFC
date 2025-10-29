
import React, { createContext, useContext, useState, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { Toast as ToastType } from '../types';
import ToastContainer from './ToastContainer';

interface ToastContextType {
    addToast: (message: string, type: ToastType['type']) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastType[]>([]);

    const removeToast = useCallback((id: number) => {
        setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    }, []);

    const addToast = useCallback((message: string, type: ToastType['type'] = 'info') => {
        const id = Date.now() + Math.random();
        setToasts(prevToasts => [...prevToasts, { id, message, type }]);
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            {ReactDOM.createPortal(
                <ToastContainer toasts={toasts} onRemove={removeToast} />,
                document.getElementById('toast-root')!
            )}
        </ToastContext.Provider>
    );
};
