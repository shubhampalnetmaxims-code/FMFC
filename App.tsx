
import React, { useState } from 'react';
import BottomNav from './components/BottomNav';
import CommunityPage from './pages/CommunityPage';
import UnderDevelopmentPage from './pages/UnderDevelopmentPage';
import LoginPage from './pages/LoginPage';
import { NAV_ITEMS } from './constants';
import { NavItemType, User, NutritionPlan, DietIntakeItem, UserNote, UserMeasurement, UserPhoto } from './types';
import SideMenu from './components/SideMenu';
import ProfilePage from './pages/ProfilePage';
import NutritionPage from './pages/NutritionPage';
import NutritionPlanDetailsPage from './pages/NutritionPlanDetailsPage';
import AddDietIntakePage from './pages/AddDietIntakePage';
import AddNotePage from './pages/AddNotePage';
import AddMeasurementPage from './pages/AddMeasurementPage';
import AddPhotoPage from './pages/AddPhotoPage';

const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<NavItemType>('Community');
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [currentSecondaryPage, setCurrentSecondaryPage] = useState<string | null>(null);
    const [viewingNutritionPlan, setViewingNutritionPlan] = useState<NutritionPlan | null>(null);
    const [isAddingDietIntake, setIsAddingDietIntake] = useState(false);
    const [editingDietIntake, setEditingDietIntake] = useState<DietIntakeItem | null>(null);
    const [additionalDietItems, setAdditionalDietItems] = useState<DietIntakeItem[]>([]);

    const [userNotes, setUserNotes] = useState<UserNote[]>([]);
    const [isAddingNote, setIsAddingNote] = useState(false);
    const [editingNote, setEditingNote] = useState<UserNote | null>(null);

    const [userMeasurements, setUserMeasurements] = useState<UserMeasurement[]>([]);
    const [isAddingMeasurement, setIsAddingMeasurement] = useState(false);
    const [editingMeasurement, setEditingMeasurement] = useState<UserMeasurement | null>(null);
    const [dateForMeasurement, setDateForMeasurement] = useState(new Date());
    
    const [userPhotos, setUserPhotos] = useState<UserPhoto[]>([]);
    const [isAddingPhoto, setIsAddingPhoto] = useState(false);
    const [editingPhoto, setEditingPhoto] = useState<UserPhoto | null>(null);


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
        setAdditionalDietItems(prevItems => prevItems.filter(i => i.id !== itemId));
    };

    const handleOpenAddNote = () => {
        setEditingNote(null);
        setIsAddingNote(true);
    };

    const handleOpenEditNote = (note: UserNote) => {
        setEditingNote(note);
        setIsAddingNote(true);
    };

    const handleCloseAddNote = () => {
        setIsAddingNote(false);
        setEditingNote(null);
    };

    const handleSaveNote = (data: { date: string; content: string; }) => {
        if (editingNote) {
            setUserNotes(prev => prev.map(note => note.id === editingNote.id ? { ...note, ...data } : note)
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            );
        } else {
            const newNote: UserNote = {
                id: Date.now().toString(),
                ...data,
            };
            setUserNotes(prev => [newNote, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        }
        handleCloseAddNote();
    };
    
    const handleDeleteNote = (noteId: string) => {
        setUserNotes(prevNotes => prevNotes.filter(n => n.id !== noteId));
    };
    
    const handleOpenAddMeasurement = (date: Date) => {
        const measurementForDate = userMeasurements.find(m => m.date === date.toISOString().split('T')[0]);
        setDateForMeasurement(date);
        setEditingMeasurement(measurementForDate || null);
        setIsAddingMeasurement(true);
    };

    const handleOpenEditMeasurement = (measurement: UserMeasurement) => {
        setDateForMeasurement(new Date(measurement.date + 'T00:00:00'));
        setEditingMeasurement(measurement);
        setIsAddingMeasurement(true);
    };

    const handleCloseAddMeasurement = () => {
        setIsAddingMeasurement(false);
        setEditingMeasurement(null);
    };

    const handleSaveMeasurement = (data: Omit<UserMeasurement, 'id'>) => {
        const { date, ...measurementData } = data;

        const conflictingMeasurement = userMeasurements.find(m => m.date === date && m.id !== editingMeasurement?.id);
        if (conflictingMeasurement) {
            alert("A measurement entry for this date already exists. Please choose a different date or edit the existing entry.");
            return;
        }

        if (editingMeasurement) {
            const updatedMeasurement: UserMeasurement = { ...editingMeasurement, ...measurementData, date };
            setUserMeasurements(prev => prev.map(m => m.id === editingMeasurement.id ? updatedMeasurement : m)
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        } else {
            const newMeasurement: UserMeasurement = { id: Date.now().toString(), date, ...measurementData };
            setUserMeasurements(prev => [newMeasurement, ...prev]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        }
        
        handleCloseAddMeasurement();
    };
    
    const handleDeleteMeasurement = (measurementId: string) => {
        setUserMeasurements(prev => prev.filter(m => m.id !== measurementId));
    };

    const handleOpenAddPhoto = () => {
        setEditingPhoto(null);
        setIsAddingPhoto(true);
    };

    const handleOpenEditPhoto = (photo: UserPhoto) => {
        setEditingPhoto(photo);
        setIsAddingPhoto(true);
    };
    
    const handleCloseAddPhoto = () => {
        setIsAddingPhoto(false);
        setEditingPhoto(null);
    };

    const handleSavePhoto = (photoData: Omit<UserPhoto, 'id'>) => {
        if (editingPhoto) {
            const updatedPhoto: UserPhoto = { ...editingPhoto, ...photoData };
            setUserPhotos(prev => prev.map(p => p.id === editingPhoto.id ? updatedPhoto : p)
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            );
        } else {
            const newPhoto: UserPhoto = {
                id: Date.now().toString(),
                ...photoData,
            };
            setUserPhotos(prev => [newPhoto, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        }
        handleCloseAddPhoto();
    };

    const handleDeletePhoto = (photoId: string) => {
        setUserPhotos(prevPhotos => prevPhotos.filter(p => p.id !== photoId));
    };


    const renderPage = () => {
        if (isAddingPhoto) {
            return <AddPhotoPage 
                onClose={handleCloseAddPhoto} 
                onSave={handleSavePhoto} 
                initialData={editingPhoto} 
            />;
        }

        if (isAddingMeasurement) {
            return <AddMeasurementPage
                onClose={handleCloseAddMeasurement}
                onSave={handleSaveMeasurement}
                initialData={editingMeasurement}
                date={dateForMeasurement}
            />;
        }

        if (isAddingNote) {
            return <AddNotePage 
                onClose={handleCloseAddNote}
                onSave={handleSaveNote}
                initialData={editingNote}
            />;
        }
        
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
                            userNotes={userNotes}
                            onAddNote={handleOpenAddNote}
                            onEditNote={handleOpenEditNote}
                            onDeleteNote={handleDeleteNote}
                            userMeasurements={userMeasurements}
                            onAddMeasurement={handleOpenAddMeasurement}
                            onEditMeasurement={handleOpenEditMeasurement}
                            onDeleteMeasurement={handleDeleteMeasurement}
                            userPhotos={userPhotos}
                            onAddPhoto={handleOpenAddPhoto}
                            onEditPhoto={handleOpenEditPhoto}
                            onDeletePhoto={handleDeletePhoto}
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
