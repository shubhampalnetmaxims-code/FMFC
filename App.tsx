



import React, { useState } from 'react';
import BottomNav from './components/BottomNav';
import CommunityPage from './pages/CommunityPage';
import UnderDevelopmentPage from './pages/UnderDevelopmentPage';
import LoginPage from './pages/LoginPage';
import { NAV_ITEMS } from './constants';
import { NavItemType, User, NutritionPlan, DietIntakeItem } from './types';
import SideMenu from './components/SideMenu';
import ProfilePage from './pages/ProfilePage';
import NutritionPage from './pages/NutritionPage';
import NutritionPlanDetailsPage from './pages/NutritionPlanDetailsPage';
import AddDietIntakePage from './pages/AddDietIntakePage';

const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<NavItemType>('Community');
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [currentSecondaryPage, setCurrentSecondaryPage] = useState<string | null>(null);
    const [viewingNutritionPlan, setViewingNutritionPlan] = useState<NutritionPlan | null>(null);
    const [isAddingDietIntake, setIsAddingDietIntake] = useState(false);
    const [editingDietIntake, setEditingDietIntake] = useState<DietIntakeItem | null>(null);
    const [additionalDietItems, setAdditionalDietItems] = useState<DietIntakeItem[]>([]);


    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const handleSignOut = () => {
        setIsMenuOpen(false);
        setCurrentUser(null);
    };

    const handleSideMenuNavigate = (pageName: string) => {
        setCurrentSecondaryPage(pageName);
        setIsMenuOpen(false);
    };

    const handleBackFromSecondaryPage = () => {
        setCurrentSecondaryPage(null);
    };

    const handleTabChange = (tab: NavItemType) => {
        setCurrentSecondaryPage(null);
        setActiveTab(tab);
    }
    
    const handleViewNutritionPlan = (plan: NutritionPlan) => {
        setViewingNutritionPlan(plan);
    };

    const handleBackFromPlanDetails = () => {
        setViewingNutritionPlan(null);
    }

    const handleOpenAddDietIntake = () => {
        setEditingDietIntake(null);
        setIsAddingDietIntake(true);
    };

    const handleOpenEditDietIntake = (item: DietIntakeItem) => {
        setEditingDietIntake(item);
        setIsAddingDietIntake(true);
    };

    const handleCloseAddDietIntake = () => {
        setIsAddingDietIntake(false);
        setEditingDietIntake(null);
    };

    const handleSaveDietIntake = (data: DietIntakeItem) => {
        if (editingDietIntake) {
             setAdditionalDietItems(prev => prev.map(item => item.id === editingDietIntake.id ? { ...item, ...data } : item));
        } else {
             const newItem: DietIntakeItem = {
                ...data,
                id: Date.now().toString(),
            };
            setAdditionalDietItems(prev => [...prev, newItem]);
        }
        handleCloseAddDietIntake();
    };
    
    const handleDeleteDietIntake = (itemId: string) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            setAdditionalDietItems(prev => prev.filter(item => item.id !== itemId));
        }
    };

    const renderPage = () => {
        if (isAddingDietIntake) {
            return <AddDietIntakePage
                        onClose={handleCloseAddDietIntake}
                        onSave={handleSaveDietIntake}
                        initialData={editingDietIntake}
                    />;
        }

        if (viewingNutritionPlan) {
            return <NutritionPlanDetailsPage plan={viewingNutritionPlan} onBack={handleBackFromPlanDetails} />;
        }
        
        if (currentSecondaryPage) {
            if (currentSecondaryPage === 'My Nutrition Plans') {
                return <NutritionPage onBack={handleBackFromSecondaryPage} />;
            }
            const showBackButton = currentSecondaryPage === 'Progress';
            return <UnderDevelopmentPage 
                        pageName={currentSecondaryPage} 
                        onMenuClick={toggleMenu} 
                        onBack={showBackButton ? handleBackFromSecondaryPage : undefined} 
                    />;
        }

        switch (activeTab) {
            case 'Community':
                return <CommunityPage currentUser={currentUser!} onMenuClick={toggleMenu} />;
            case 'Profile':
                return <ProfilePage
                            currentUser={currentUser!}
                            onNavigate={handleSideMenuNavigate}
                            onMenuClick={toggleMenu}
                            onViewPlan={handleViewNutritionPlan}
                            onAddDietIntake={handleOpenAddDietIntake}
                            onEditDietIntake={handleOpenEditDietIntake}
                            onDeleteDietIntake={handleDeleteDietIntake}
                            additionalDietItems={additionalDietItems}
                        />;
            case 'Session':
            case 'Goals':
            case 'Workouts':
                return <UnderDevelopmentPage pageName={activeTab} onMenuClick={toggleMenu} />;
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