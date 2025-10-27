
import React, { useState } from 'react';
import BottomNav from './components/BottomNav';
import CommunityPage from './pages/CommunityPage';
import UnderDevelopmentPage from './pages/UnderDevelopmentPage';
import LoginPage from './pages/LoginPage';
import { NAV_ITEMS } from './constants';
import { NavItemType, User } from './types';
import SideMenu from './components/SideMenu';
import ProfilePage from './pages/ProfilePage';

const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<NavItemType>('Community');
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [currentSecondaryPage, setCurrentSecondaryPage] = useState<string | null>(null);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const handleSignOut = () => {
        setIsMenuOpen(false);
        setCurrentUser(null);
    };

    const handleSideMenuNavigate = (pageName: string) => {
        setCurrentSecondaryPage(pageName);
        setIsMenuOpen(false);
    };

    const handleTabChange = (tab: NavItemType) => {
        setCurrentSecondaryPage(null);
        setActiveTab(tab);
    }

    const renderPage = () => {
        if (currentSecondaryPage) {
            return <UnderDevelopmentPage pageName={currentSecondaryPage} />;
        }

        switch (activeTab) {
            case 'Community':
                return <CommunityPage currentUser={currentUser!} onMenuClick={toggleMenu} />;
            case 'Profile':
                return <ProfilePage currentUser={currentUser!} />;
            case 'Session':
            case 'Goals':
            case 'Workouts':
                return <UnderDevelopmentPage pageName={activeTab} />;
            default:
                return <CommunityPage currentUser={currentUser!} onMenuClick={toggleMenu}/>;
        }
    };

    if (!currentUser) {
        return <LoginPage onLogin={setCurrentUser} />;
    }

    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col font-sans">
             <SideMenu
                isOpen={isMenuOpen}
                currentUser={currentUser}
                onClose={toggleMenu}
                onNavigate={handleSideMenuNavigate}
                onLogout={handleSignOut}
            />
            <main className="flex-grow pb-20">
                {renderPage()}
            </main>
            <BottomNav
                navItems={NAV_ITEMS}
                activeTab={activeTab}
                setActiveTab={handleTabChange}
            />
        </div>
    );
};

export default App;