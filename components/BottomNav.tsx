
import React from 'react';
import type { NavItemType } from '../types';
import Icon from './Icon';

interface BottomNavProps {
    navItems: { id: NavItemType; label: string }[];
    activeTab: NavItemType;
    setActiveTab: (tab: NavItemType) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ navItems, activeTab, setActiveTab }) => {
    const getIcon = (id: NavItemType, isActive: boolean) => {
        const iconColor = isActive ? 'text-amber-400' : 'text-zinc-500';
        switch (id) {
            case 'Community':
                return <Icon type="community" className={`w-6 h-6 ${iconColor}`} />;
            case 'Session':
                return <Icon type="session" className={`w-6 h-6 ${iconColor}`} />;
            case 'Goals':
                return <Icon type="goals" className={`w-6 h-6 ${iconColor}`} />;
            case 'Workouts':
                return <Icon type="workouts" className={`w-6 h-6 ${iconColor}`} />;
            case 'Profile':
                return <Icon type="profile" className={`w-6 h-6 ${iconColor}`} />;
            default:
                return null;
        }
    };
    
    return (
        <footer className="fixed bottom-0 left-0 right-0 bg-black border-t border-zinc-800 shadow-lg">
            <nav className="flex justify-around items-center h-16 max-w-lg mx-auto">
                {navItems.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className="flex flex-col items-center justify-center w-full text-center transition-colors duration-200"
                            aria-current={isActive ? 'page' : undefined}
                        >
                            {getIcon(item.id, isActive)}
                            <span className={`text-xs mt-1 ${isActive ? 'text-amber-400 font-semibold' : 'text-zinc-500'}`}>
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </nav>
        </footer>
    );
};

export default BottomNav;