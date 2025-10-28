

import React, { useState, useEffect, useMemo } from 'react';
import BottomNav from './components/BottomNav';
import CommunityPage from './pages/CommunityPage';
import UnderDevelopmentPage from './pages/UnderDevelopmentPage';
import LoginPage from './pages/LoginPage';
import { NAV_ITEMS, NUTRITION_PLANS_DATA, LEADERBOARD_DATA, TEST_USER, TASK_POINTS } from './constants';
import { NavItemType, User, NutritionPlan, DietIntakeItem, UserNote, UserMeasurement, UserPhoto } from './types';
import SideMenu from './components/SideMenu';
import ProfilePage from './pages/ProfilePage';
import NutritionPage from './pages/NutritionPage';
import NutritionPlanDetailsPage from './pages/NutritionPlanDetailsPage';
import AddDietIntakePage from './pages/AddDietIntakePage';
import AddNotePage from './pages/AddNotePage';
import AddMeasurementPage from './pages/AddMeasurementPage';
import AddPhotoPage from './pages/AddPhotoPage';
import GoalsPage from './pages/GoalsPage';
import LeaderboardPage from './pages/LeaderboardPage';

const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<NavItemType>('Goals');
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
    
    // State for Goals and Trackers
    const [completedTasks, setCompletedTasks] = useState<Record<string, Set<string>>>({}); // key: 'YYYY-MM-DD', value: Set<taskId>
    const [completedWeeklyTasks, setCompletedWeeklyTasks] = useState<Record<string, Set<string>>>({}); // key: 'YYYY-WW', value: Set<taskId>
    const [checkedNutritionItems, setCheckedNutritionItems] = useState<Record<string, Set<string>>>({}); // key: 'YYYY-MM-DD', value: Set<itemId>
    const [isViewingLeaderboard, setIsViewingLeaderboard] = useState(false);


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
        
        // Auto-check challenge task if it's for today
        const measurementDate = new Date(data.date + 'T00:00:00');
        const today = new Date();
        if (measurementDate.toDateString() === today.toDateString()) {
            const todayKey = data.date;
            setCompletedTasks(prev => {
                const newCompleted = { ...prev };
                const tasksForDate = new Set(newCompleted[todayKey] || []);
                tasksForDate.add('log_measurements');
                newCompleted[todayKey] = tasksForDate;
                return newCompleted;
            });
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
        
        // Auto-check challenge task
        const todayKey = new Date().toISOString().split('T')[0];
        if (photoData.date === todayKey) {
            let taskId: string | null = null;
            if (photoData.type === 'Front') {
                taskId = 'photo_front';
            } else if (photoData.type === 'Side') {
                taskId = 'photo_side';
            }

            if (taskId) {
                const finalTaskId = taskId; // for closure
                setCompletedTasks(prev => {
                    const newCompleted = { ...prev };
                    const tasksForDate = new Set(newCompleted[todayKey] || []);
                    tasksForDate.add(finalTaskId);
                    newCompleted[todayKey] = tasksForDate;
                    return newCompleted;
                });
            }
        }
        
        handleCloseAddPhoto();
    };

    const handleDeletePhoto = (photoId: string) => {
        setUserPhotos(prevPhotos => prevPhotos.filter(p => p.id !== photoId));
    };
    
    const handleToggleManualTask = (taskId: string, date: Date) => {
        const dateKey = date.toISOString().split('T')[0];
        setCompletedTasks(prev => {
            const newCompleted = { ...prev };
            const tasksForDate = new Set(newCompleted[dateKey] || []);
            if (tasksForDate.has(taskId)) {
                tasksForDate.delete(taskId);
            } else {
                tasksForDate.add(taskId);
            }
            newCompleted[dateKey] = tasksForDate;
            return newCompleted;
        });
    };
    
    // Helper to get week key (e.g., '2024-28') for weekly goals
    const getWeekKey = (d: Date): string => {
        const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
        const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
        const weekNo = Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
        return `${date.getUTCFullYear()}-${weekNo}`;
    };

    const handleToggleWeeklyTask = (taskId: string, date: Date) => {
        const weekKey = getWeekKey(date);
        setCompletedWeeklyTasks(prev => {
            const newCompleted = { ...prev };
            const tasksForWeek = new Set(newCompleted[weekKey] || []);
            if (tasksForWeek.has(taskId)) {
                tasksForWeek.delete(taskId);
            } else {
                tasksForWeek.add(taskId);
            }
            newCompleted[weekKey] = tasksForWeek;
            return newCompleted;
        });
    };

    const handleToggleNutritionItem = (itemId: string, date: Date) => {
        // Use timezone-safe YYYY-MM-DD string as key
        const dateKey = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
        setCheckedNutritionItems(prev => {
            const newChecked = { ...prev };
            const itemsForDate = new Set(newChecked[dateKey] || []);
            if (itemsForDate.has(itemId)) {
                itemsForDate.delete(itemId);
            } else {
                itemsForDate.add(itemId);
            }
            newChecked[dateKey] = itemsForDate;
            return newChecked;
        });
    };
    
    const activePlan = NUTRITION_PLANS_DATA.find(p => p.isActive && !p.isTemplate);
    useEffect(() => {
        if (!activePlan) return;

        // Get all unique dates from checked items and additional items to iterate over
        const allRelevantDateStrings = new Set([
            ...Object.keys(checkedNutritionItems), 
            ...additionalDietItems.map(item => item.date)
        ]);

        allRelevantDateStrings.forEach(dateISO => {
            const totalPlanItems = activePlan.content.flatMap(m => m.items).length;
            const additionalItemsForDate = additionalDietItems.filter(item => item.date === dateISO);
            const totalItemsForDate = totalPlanItems + additionalItemsForDate.length;

            if (totalItemsForDate === 0) return;
            
            const checkedItemsSet = checkedNutritionItems[dateISO] || new Set<string>();
            const allItemsChecked = checkedItemsSet.size >= totalItemsForDate;

            setCompletedTasks(prev => {
                const newCompleted = { ...prev };
                const tasksForDate = new Set(newCompleted[dateISO] || []);
                const wasCompleted = tasksForDate.has('meal_plan');
                
                if (allItemsChecked && !wasCompleted) {
                    tasksForDate.add('meal_plan');
                    newCompleted[dateISO] = tasksForDate;
                    return newCompleted;
                } else if (!allItemsChecked && wasCompleted) {
                    tasksForDate.delete('meal_plan');
                    newCompleted[dateISO] = tasksForDate;
                    return newCompleted;
                }
                return prev;
            });
        });

    }, [checkedNutritionItems, activePlan, additionalDietItems]);
    
    const handleViewLeaderboard = () => {
        setIsViewingLeaderboard(true);
    };

    const handleBackFromLeaderboard = () => {
        setIsViewingLeaderboard(false);
    };
    
    // Points calculation logic
    const currentUserTotalPoints = useMemo(() => {
        // FIX: Explicitly typing the 'sum' accumulator in `reduce` to `number` resolves a TypeScript error where the type was not correctly inferred, causing issues with the addition operation.
        const dailyPoints = Object.values(completedTasks).reduce((sum: number, taskSet) => sum + taskSet.size, 0) * TASK_POINTS;
        // FIX: Explicitly typing the 'sum' accumulator in `reduce` to `number` resolves a TypeScript error where the type was not correctly inferred, causing issues with the addition operation.
        const weeklyPoints = Object.values(completedWeeklyTasks).reduce((sum: number, taskSet) => sum + taskSet.size, 0) * TASK_POINTS;
        return dailyPoints + weeklyPoints;
    }, [completedTasks, completedWeeklyTasks]);

    const leaderboardData = useMemo(() => {
        const otherUsers = LEADERBOARD_DATA.filter(u => u.userId !== TEST_USER.id);
        const currentUserData = {
            userId: TEST_USER.id,
            name: TEST_USER.name,
            avatar: TEST_USER.avatar,
            totalPoints: currentUserTotalPoints
        };
        return [...otherUsers, currentUserData].sort((a, b) => b.totalPoints - a.totalPoints);
    }, [currentUserTotalPoints]);

    const currentUserRank = leaderboardData.findIndex(u => u.userId === TEST_USER.id) + 1;


    const renderPage = () => {
        if (isViewingLeaderboard) {
            return <LeaderboardPage 
                onBack={handleBackFromLeaderboard}
                leaderboardData={leaderboardData}
                currentUserId={currentUser!.id}
            />;
        }

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
                            checkedNutritionItems={checkedNutritionItems}
                            onToggleNutritionItem={handleToggleNutritionItem}
                        />;
            case 'Goals':
                 return <GoalsPage 
                            onMenuClick={toggleMenu}
                            completedTasks={completedTasks}
                            onToggleManualTask={handleToggleManualTask}
                            completedWeeklyTasks={completedWeeklyTasks}
                            onToggleWeeklyTask={handleToggleWeeklyTask}
                            onViewLeaderboard={handleViewLeaderboard}
                            currentUserTotalPoints={currentUserTotalPoints}
                            currentUserRank={currentUserRank}
                        />;
            case 'Session':
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