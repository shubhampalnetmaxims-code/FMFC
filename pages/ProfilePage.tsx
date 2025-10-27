
import React, { useState } from 'react';
import type { User } from '../types';
import UnderDevelopmentPage from './UnderDevelopmentPage';

type ProfileSubTab = 'Nutrition' | 'Photos' | 'Measurements' | 'Notes';

const SUB_TABS: ProfileSubTab[] = ['Nutrition', 'Photos', 'Measurements', 'Notes'];

interface ProfilePageProps {
    currentUser: User;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ currentUser }) => {
    const [activeSubTab, setActiveSubTab] = useState<ProfileSubTab>('Nutrition');

    const renderContent = () => {
        // For now, all tabs lead to the under development page
        return <UnderDevelopmentPage pageName={activeSubTab} />;
    };

    return (
        <div className="w-full max-w-lg mx-auto h-full flex flex-col">
            {/* Header */}
            <header className="p-4 text-center space-y-3">
                <img 
                    src={currentUser.avatar} 
                    alt={currentUser.name}
                    className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-zinc-800"
                />
                <h1 className="text-2xl font-bold text-zinc-100">{currentUser.name}</h1>
                <p className="text-sm text-zinc-400">Forge Your Fitness</p>
            </header>

            {/* Sub-navigation */}
            <div className="border-b border-zinc-800 px-4">
                <nav className="flex justify-between">
                    {SUB_TABS.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveSubTab(tab)}
                            className={`py-3 px-1 text-sm font-semibold transition-colors duration-200 w-full ${
                                activeSubTab === tab
                                ? 'text-amber-400 border-b-2 border-amber-400'
                                : 'text-zinc-500 hover:text-zinc-300 border-b-2 border-transparent'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Content */}
            <div className="flex-grow min-h-0">
                {renderContent()}
            </div>
        </div>
    );
};

export default ProfilePage;