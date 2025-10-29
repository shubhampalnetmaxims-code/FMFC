
import React, { useEffect, useState } from 'react';
import Icon from './Icon';
import { Toast as ToastType } from '../types';

interface ToastProps {
    toast: ToastType;
    onRemove: (id: number) => void;
    duration?: number;
}

const Toast: React.FC<ToastProps> = ({ toast, onRemove, duration = 5000 }) => {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        if (duration === Infinity) return;

        const exitTimer = setTimeout(() => {
            setIsExiting(true);
        }, duration - 500); // Start exit animation 500ms before removal

        const removeTimer = setTimeout(() => {
            onRemove(toast.id);
        }, duration);

        return () => {
            clearTimeout(exitTimer);
            clearTimeout(removeTimer);
        };
    }, [toast.id, duration, onRemove]);

    const handleRemove = () => {
        setIsExiting(true);
        setTimeout(() => onRemove(toast.id), 500); // Wait for animation to finish
    };

    const icons: Record<ToastType['type'], React.ReactNode> = {
        success: <Icon type="check" className="w-5 h-5" />,
        error: <Icon type="x" className="w-5 h-5" />,
        warning: <Icon type="bolt" className="w-5 h-5" />,
        info: <Icon type="bell" className="w-5 h-5" />,
    };

    const colors: Record<ToastType['type'], string> = {
        success: 'bg-green-500 border-green-600',
        error: 'bg-red-600 border-red-700',
        warning: 'bg-amber-500 border-amber-600',
        info: 'bg-sky-500 border-sky-600',
    };

    return (
        <div 
            className={`
                flex items-start p-4 rounded-lg shadow-lg text-white border w-full
                transition-all duration-500 ease-in-out transform
                ${isExiting ? 'animate-slide-out' : 'animate-slide-in'}
                ${colors[toast.type]}
            `}
        >
            <div className="flex-shrink-0 mr-3 mt-0.5">
                {icons[toast.type]}
            </div>
            <div className="flex-grow text-sm font-medium break-words">
                {toast.message}
            </div>
            <button onClick={handleRemove} className="ml-4 -mr-2 -mt-2 p-2 rounded-full hover:bg-white/20 shrink-0">
                <Icon type="x" className="w-4 h-4" />
            </button>
        </div>
    );
};

export default Toast;
