import React, { useRef, useEffect } from 'react';
import { Notification } from '../types';
import Icon from './Icon';

interface NotificationsPanelProps {
    notifications: Notification[];
    onClose: () => void;
    onMarkAllAsRead: () => void;
}

const NotificationItem: React.FC<{ notification: Notification }> = ({ notification }) => {
    const getIcon = (type: Notification['type']) => {
        const commonClass = "w-6 h-6";
        switch (type) {
            case 'community': return <Icon type="community" className={`${commonClass} text-sky-400`} />;
            case 'goal': return <Icon type="goals" className={`${commonClass} text-green-400`} />;
            case 'mention': return <Icon type="users" className={`${commonClass} text-purple-400`} />;
            case 'like': return <Icon type="like-filled" className={`${commonClass} text-red-400`} />;
            default: return null;
        }
    };

    return (
        <div className="flex items-start space-x-3 p-3 hover:bg-zinc-700/50 rounded-lg">
            {!notification.isRead && <div className="w-2 h-2 rounded-full bg-amber-400 mt-2 shrink-0"></div>}
            <div className={`shrink-0 ${notification.isRead ? 'ml-5' : ''}`}>{getIcon(notification.type)}</div>
            <div className="flex-grow">
                <p className={`text-sm ${notification.isRead ? 'text-zinc-400' : 'text-zinc-100'}`}>{notification.text}</p>
                <p className="text-xs text-zinc-500">{notification.timestamp}</p>
            </div>
        </div>
    );
};

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ notifications, onClose, onMarkAllAsRead }) => {
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    return (
        <div ref={panelRef} className="fixed top-20 right-4 w-full max-w-sm bg-zinc-800 border border-zinc-700 rounded-2xl shadow-2xl z-50 flex flex-col max-h-[70vh]">
            <header className="flex items-center justify-between p-4 border-b border-zinc-700 shrink-0">
                <h2 className="text-lg font-bold text-white">Notifications</h2>
                <button
                    onClick={onMarkAllAsRead}
                    className="text-sm font-semibold text-amber-400 hover:text-amber-300"
                >
                    Mark all as read
                </button>
            </header>
            <main className="flex-grow overflow-y-auto">
                {notifications.length > 0 ? (
                    notifications.map(n => <NotificationItem key={n.id} notification={n} />)
                ) : (
                    <div className="text-center py-16 text-zinc-500">
                        <p>No notifications yet.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default NotificationsPanel;
