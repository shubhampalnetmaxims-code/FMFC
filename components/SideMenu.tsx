import React from 'react';
import type { User } from '../types';
import Icon from './Icon';

interface SideMenuProps {
    isOpen: boolean;
    currentUser: User;
    onClose: () => void;
    onNavigate: (page: string) => void;
    onLogout: () => void;
}

const MenuItem: React.FC<{ icon: any; label: string; onClick: () => void; }> = ({ icon, label, onClick }) => (
    <button onClick={onClick} className="w-full flex items-center space-x-4 px-4 py-3 text-zinc-300 hover:bg-amber-400/10 hover:text-amber-300 rounded-lg transition-colors duration-200">
        <Icon type={icon} className="w-6 h-6 text-zinc-400" />
        <span className="font-semibold">{label}</span>
    </button>
);

const SideMenu: React.FC<SideMenuProps> = ({ isOpen, currentUser, onClose, onNavigate, onLogout }) => {
    return (
        <>
            {/* Overlay */}
            <div
                className={`absolute inset-0 bg-black/60 z-40 transition-opacity duration-300 ${
                    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Side Menu Panel */}
            <aside
                className={`absolute top-0 left-0 h-full w-72 bg-zinc-900 border-r border-zinc-800 shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="sidemenu-title"
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                        <h2 id="sidemenu-title" className="text-lg font-bold text-white">Menu</h2>
                        <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
                            <Icon type="x" className="w-6 h-6" />
                        </button>
                    </div>

                    {/* User Profile */}
                    <div className="p-4 flex items-center space-x-3 border-b border-zinc-800">
                        <img src={currentUser.avatar} alt={currentUser.name} className="w-12 h-12 rounded-full object-cover" />
                        <div>
                            <p className="font-bold text-zinc-100">{currentUser.name}</p>
                            <p className="text-sm text-zinc-400">Welcome back!</p>
                        </div>
                    </div>
                    
                    {/* Navigation */}
                    <nav className="flex-grow p-4 space-y-2">
                        <MenuItem icon="cog" label="Manage Account" onClick={() => onNavigate('Manage Account')} />
                        <MenuItem icon="fire" label="My Nutrition Plans" onClick={() => onNavigate('My Nutrition Plans')} />
                        <MenuItem icon="bell" label="Notifications" onClick={() => onNavigate('Notifications')} />
                    </nav>

                    {/* Footer / Sign Out */}
                    <div className="p-4 border-t border-zinc-800">
                        <MenuItem icon="logout" label="Sign Out" onClick={onLogout} />
                    </div>
                </div>
            </aside>
        </>
    );
};

export default SideMenu;