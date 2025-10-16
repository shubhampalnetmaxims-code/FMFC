import React, { useState } from 'react';
import BottomNav from './components/BottomNav';
import CommunityPage from './pages/CommunityPage';
import UnderDevelopmentPage from './pages/UnderDevelopmentPage';
import LoginPage from './pages/LoginPage';
import { NAV_ITEMS } from './constants';
import { NavItemType, User } from './types';

const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<NavItemType>('Community');
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    const renderPage = () => {
        switch (activeTab) {
            case 'Community':
                return <CommunityPage currentUser={currentUser!} />;
            case 'Session':
            case 'Goals':
            case 'Workouts':
            case 'Profile':
                return <UnderDevelopmentPage pageName={activeTab} />;
            default:
                return <CommunityPage currentUser={currentUser!} />;
        }
    };

    if (!currentUser) {
        return <LoginPage onLogin={setCurrentUser} />;
    }

    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col font-sans">
            <main className="flex-grow pb-20">
                {renderPage()}
            </main>
            <BottomNav
                navItems={NAV_ITEMS}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />
        </div>
    );
};

export default App;