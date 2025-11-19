
import React, { useState, useEffect, useMemo } from 'react';
import BottomNav from './components/BottomNav';
import CommunityPage from './pages/CommunityPage';
import UnderDevelopmentPage from './pages/UnderDevelopmentPage';
import LoginPage from './pages/LoginPage';
import { NAV_ITEMS, NUTRITION_PLANS_DATA, LEADERBOARD_DATA, TEST_USER, TASK_POINTS, COMMUNITIES_DATA, USERS_DATA, DAILY_CHALLENGE_TASKS, NOTIFICATIONS_DATA, WORKOUTS_DATA } from './constants';
import { NavItemType, User, NutritionPlan, DietIntakeItem, UserNote, UserMeasurement, UserPhoto, Community, ChannelType, Post, ChatMessage, Channel, ChallengeTask, MealEntry, FoodItem, Notification, NutritionTotals, SharedGoal, Workout, Exercise } from './types';
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
import ShareAchievementPage from './pages/ShareAchievementPage';
import { CommunityHubFilterType } from './pages/CommunityHubPage';
import { useToast } from './components/ToastProvider';
import MyStatsPage from './pages/MyStatsPage';
import ShareTasksPage from './pages/ShareTasksPage';
import JournalPage from './pages/JournalPage';
import AskAiPage from './pages/AskAiPage';
import AddPlanFoodItemPage from './pages/AddPlanFoodItemPage';
import NotificationsPanel from './components/NotificationsPanel';
import ShareNutritionPlanPage from './pages/ShareNutritionPlanPage';
import SharedGoalDetailsPage from './pages/SharedGoalDetailsPage';
import ShareProgressPage from './pages/ShareProgressPage';
import WorkoutsPage from './pages/WorkoutsPage';
import WorkoutDetailsPage from './pages/WorkoutDetailsPage';
import ShareWorkoutPage from './pages/ShareWorkoutPage';
import ExerciseDetailsPage from './pages/ExerciseDetailsPage';
import WorkoutSessionPage from './pages/WorkoutSessionPage';
import CreateWorkoutPage from './pages/CreateWorkoutPage';
import FloatingNotificationBadge from './components/FloatingNotificationBadge';

const App: React.FC = () => {
    const { addToast } = useToast();
    const [activeTab, setActiveTab] = useState<NavItemType>('Profile');
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [currentSecondaryPage, setCurrentSecondaryPage] = useState<string | null>(null);
    const [viewingNutritionPlan, setViewingNutritionPlan] = useState<NutritionPlan | null>(null);
    const [isAddingDietIntake, setIsAddingDietIntake] = useState(false);
    const [editingDietIntake, setEditingDietIntake] = useState<DietIntakeItem | null>(null);
    const [additionalDietItems, setAdditionalDietItems] = useState<DietIntakeItem[]>([]);
    const [dateForDietIntake, setDateForDietIntake] = useState(new Date());

    const [userNotes, setUserNotes] = useState<UserNote[]>([]);
    const [isAddingNote, setIsAddingNote] = useState(false);
    const [editingNote, setEditingNote] = useState<UserNote | null>(null);
    const [dateForNote, setDateForNote] = useState(new Date());

    const [userMeasurements, setUserMeasurements] = useState<UserMeasurement[]>([]);
    const [isAddingMeasurement, setIsAddingMeasurement] = useState(false);
    const [editingMeasurement, setEditingMeasurement] = useState<UserMeasurement | null>(null);
    const [dateForMeasurement, setDateForMeasurement] = useState(new Date());
    
    const [userPhotos, setUserPhotos] = useState<UserPhoto[]>([]);
    const [isAddingPhoto, setIsAddingPhoto] = useState(false);
    const [editingPhoto, setEditingPhoto] = useState<UserPhoto | null>(null);
    const [dateForPhoto, setDateForPhoto] = useState(new Date());
    
    // State for Goals and Trackers
    const [completedTasks, setCompletedTasks] = useState<Record<string, Set<string>>>({}); // key: 'YYYY-MM-DD', value: Set<taskId>
    const [completedWeeklyTasks, setCompletedWeeklyTasks] = useState<Record<string, Set<string>>>({}); // key: 'YYYY-WW', value: Set<taskId>
    const [checkedNutritionItems, setCheckedNutritionItems] = useState<Record<string, Set<string>>>({}); // key: 'YYYY-MM-DD', value: Set<itemId>
    const [isViewingLeaderboard, setIsViewingLeaderboard] = useState(false);
    const [isViewingMyStats, setIsViewingMyStats] = useState(false);

    // AI Flow State
    const [aiSource, setAiSource] = useState<null | 'journal' | 'nutrition'>(null);

    // Lifted Nutrition Plans state
    const [nutritionPlans, setNutritionPlans] = useState<NutritionPlan[]>(NUTRITION_PLANS_DATA);
    const activePlan = useMemo(() => nutritionPlans.find(p => p.isActive && !p.isTemplate), [nutritionPlans]);
    const [editingPlanFoodItem, setEditingPlanFoodItem] = useState<{ planId: number; mealTime: string; item?: FoodItem } | null>(null);
    
    // Ensures mock data is only generated once per login
    const [isHistoryInitialized, setIsHistoryInitialized] = useState(false);

    // STATE LIFTED FROM CommunityPage
    const [communities, setCommunities] = useState<Community[]>(COMMUNITIES_DATA);
    const [selectedCommunityId, setSelectedCommunityId] = useState<number | null>(null);
    const [selectedChannelId, setSelectedChannelId] = useState<number | null>(null);
    const [hubActiveFilter, setHubActiveFilter] = useState<CommunityHubFilterType>('feed');
    const [isAddingMembers, setIsAddingMembers] = useState(false);

    // STATE FOR SHARE FLOWS
    const [sharingAchievementData, setSharingAchievementData] = useState<{
        streak: number;
        pointsEarned: number;
        description: string;
        hashtags: string[];
    } | null>(null);
    const [sharingTasksData, setSharingTasksData] = useState<{
        date: Date;
        tasks: ChallengeTask[];
        completedDaily: Set<string>;
        completedWeekly: Set<string>;
    } | null>(null);
    const [sharingNutritionPlan, setSharingNutritionPlan] = useState<NutritionPlan | null>(null);
    const [sharingProgressData, setSharingProgressData] = useState<{
        before: UserPhoto;
        after: UserPhoto;
        generatedImage: string;
        description: string;
    } | null>(null);
    const [sharingWorkout, setSharingWorkout] = useState<Workout | null>(null);

    
    // STATE FOR NOTIFICATIONS
    const [notifications, setNotifications] = useState<Notification[]>(NOTIFICATIONS_DATA);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [notificationBadgeData, setNotificationBadgeData] = useState<{ communityId: number; image: string } | null>(null);


    // STATE FOR VIEWING SHARED COMMUNITY ITEMS
    const [viewingSharedItem, setViewingSharedItem] = useState<{ type: 'nutrition' | 'goal', data: NutritionPlan | SharedGoal, communityName: string } | null>(null);

    // STATE FOR WORKOUTS
    const [publicWorkouts, setPublicWorkouts] = useState<Workout[]>(WORKOUTS_DATA);
    const [viewingWorkout, setViewingWorkout] = useState<{ workout: Workout; isMine: boolean } | null>(null);
    const [viewingExercise, setViewingExercise] = useState<Exercise | null>(null);
    const [myWorkouts, setMyWorkouts] = useState<Workout[]>([WORKOUTS_DATA[0]]);
    const [activeWorkoutSession, setActiveWorkoutSession] = useState<Workout | null>(null);
    const [isCreatingWorkout, setIsCreatingWorkout] = useState(false);


    const hasUnreadNotifications = useMemo(() => notifications.some(n => !n.isRead), [notifications]);

    const handleToggleNotifications = () => {
        setIsNotificationsOpen(prev => !prev);
    };

    const handleMarkAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        addToast('All notifications marked as read', 'info');
        setIsNotificationsOpen(false); // Close panel after action
    };

    // --- SIMULATE INCOMING MESSAGE FOR BADGE DEMO ---
    useEffect(() => {
        if (!currentUser) return;
        
        // Simulate receiving a message from "The Flex Zone" (ID 2) after 3 seconds
        const timer = setTimeout(() => {
            // Only show if not already inside that community
            if (selectedCommunityId !== 2) {
                const community = communities.find(c => c.id === 2);
                if (community && community.posts.length > 0) {
                     // Use the community's most recent post image or a default for the badge
                    const image = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=200&auto.format&fit=crop"; 
                    setNotificationBadgeData({ communityId: 2, image });
                    addToast(`New message in ${community.name}`, 'info');
                }
            }
        }, 3000);

        return () => clearTimeout(timer);
    }, [currentUser, selectedCommunityId, communities, addToast]);

    useEffect(() => {
        // This runs only once on initial load to create some mock history
        const initializeMockHistory = () => {
            const today = new Date();
            
             // --- MOCK STREAK DATA ---
            const mockCompleted: Record<string, Set<string>> = {};
            // Go back 5 days to create a streak
            for (let i = 1; i <= 5; i++) {
                const pastDate = new Date(today);
                pastDate.setDate(today.getDate() - i);
                const dateKey = pastDate.toISOString().split('T')[0];
                const completedTasksForDay = new Set<string>();
                DAILY_CHALLENGE_TASKS.forEach(task => completedTasksForDay.add(task.id));
                mockCompleted[dateKey] = completedTasksForDay;
            }
             // Add some random older completed days
            for (let i = 7; i <= 10; i++) {
                const pastDate = new Date(today);
                pastDate.setDate(today.getDate() - i);
                const dateKey = pastDate.toISOString().split('T')[0];
                const completedTasksForDay = new Set<string>();
                DAILY_CHALLENGE_TASKS.forEach(task => {
                    if (Math.random() > 0.5) {
                        completedTasksForDay.add(task.id);
                    }
                });
                mockCompleted[dateKey] = completedTasksForDay;
            }
            setCompletedTasks(mockCompleted);
            
            // --- GENERATE RICH MOCK JOURNAL DATA for the last 90 days ---
            const mockPhotos: UserPhoto[] = [];
            const mockMeasurements: UserMeasurement[] = [];
            const mockNotes: UserNote[] = [];
            const mockCheckedNutrition: Record<string, Set<string>> = {};
            const MOCK_NOTE_CONTENT = [
                "Felt strong today, hit a new PR on squats!",
                "Feeling a bit tired, need to focus on sleep.",
                "Meal prep for the week is done! Feeling prepared.",
                "Tried a new pre-workout, felt great.",
                "Cardio was tough but pushed through.",
                "Great workout session with the crew.",
                "Feeling bloated. Need to watch my sodium.",
                "Focused on form today. Lighter weight but better reps.",
            ];

            for (let i = 90; i >= 0; i--) {
                const date = new Date();
                date.setDate(today.getDate() - i);
                const dateKey = date.toISOString().split('T')[0];
                const dayNumber = 90 - i;

                // Add measurements every 5 days
                if (i % 5 === 0) {
                    mockMeasurements.push({
                        id: `m${i}`, date: dateKey,
                        weight: 85 - (dayNumber / 10), // steady decrease from 85kg
                        waist: 36 - (dayNumber / 15),
                        bodyfat: 20 - (dayNumber / 8),
                    });
                }

                // Add progress photos with more variety in dates and types
                if (i % 8 === 0) { // Add a Front photo roughly weekly
                     mockPhotos.push({
                        id: `p${i}-front`, src: `https://picsum.photos/600/800?random=front-${i}`,
                        type: 'Front', date: dateKey, description: `Front view, Day ${dayNumber}.`
                    });
                }

                if ((i + 3) % 10 === 0) { // Add a Side photo on a different schedule
                     mockPhotos.push({
                        id: `p${i}-side`, src: `https://picsum.photos/600/800?random=side-${i}`,
                        type: 'Side', date: dateKey, description: `Side view, Day ${dayNumber}.`
                    });
                }

                if ((i + 6) % 12 === 0) { // Add a Back photo on yet another schedule
                    mockPhotos.push({
                        id: `p${i}-back`, src: `https://picsum.photos/600/800?random=back-${i}`,
                        type: 'Back', date: dateKey, description: `Back progress, Day ${dayNumber}.`
                    });
                }
                
                // Add a workout photo randomly
                if (i > 0 && Math.random() < 0.1) { // A bit less frequent
                    mockPhotos.push({
                         id: `p${i}-gym`, src: `https://picsum.photos/600/800?random=gym-${i}`,
                         type: 'Workout', date: dateKey, description: `Post-workout pump! Great session today.`
                    });
                }
                
                // Add notes randomly
                if (Math.random() > 0.4) { // More frequent notes
                    mockNotes.push({
                        id: `n${i}`, date: dateKey,
                        content: MOCK_NOTE_CONTENT[Math.floor(Math.random() * MOCK_NOTE_CONTENT.length)]
                    });
                }
                
                // Track nutrition items
                if (activePlan) {
                    const checkedForDay = new Set<string>();
                    const planItems = activePlan.content.flatMap(m => m.items);
                    planItems.forEach(item => {
                        // Check off between 50% and 100% of items
                        if (Math.random() > 0.5) {
                            checkedForDay.add(item.id);
                        }
                    });
                    mockCheckedNutrition[dateKey] = checkedForDay;
                }
            }

            setUserPhotos(mockPhotos.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
            setUserMeasurements(mockMeasurements.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
            setUserNotes(mockNotes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
            setCheckedNutritionItems(mockCheckedNutrition);
            
            setIsHistoryInitialized(true);
        };

        if (currentUser && !isHistoryInitialized) {
            initializeMockHistory();
        }
    }, [currentUser, isHistoryInitialized, activePlan]);


    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const handleSignOut = () => {
        setIsMenuOpen(false);
        setCurrentUser(null);
        setIsHistoryInitialized(false); // Reset for next login
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

    const handleActivatePlan = (planId: number) => {
        const template = nutritionPlans.find(p => p.id === planId && p.isTemplate);
        if (!template) {
            addToast('Template plan not found.', 'error');
            return;
        }
    
        // Create a new active plan from the template
        const newActivePlan: NutritionPlan = {
            ...template,
            id: Date.now(), // New unique ID
            isTemplate: false,
            isActive: true,
        };
    
        setNutritionPlans(prevPlans => {
            // Deactivate all other plans and filter out old active plans that were based on the same template
            const updatedPlans = prevPlans
                .map(p => ({ ...p, isActive: false }));
            
            // Add the new active plan
            return [...updatedPlans, newActivePlan];
        });
    
        addToast(`'${template.name}' is now your active plan!`, 'success');
        setCurrentSecondaryPage(null); // Go back to profile to see the change
        setActiveTab('Profile');
    };

    const handleOpenAddDietIntake = (date: Date) => {
        setEditingDietIntake(null);
        setDateForDietIntake(date);
        setIsAddingDietIntake(true);
    };

    const handleOpenEditDietIntake = (item: DietIntakeItem) => {
        setEditingDietIntake(item);
        setDateForDietIntake(new Date(item.date + 'T00:00:00'));
        setIsAddingDietIntake(true);
    };

    const handleCloseAddDietIntake = () => {
        setIsAddingDietIntake(false);
        setEditingDietIntake(null);
    };

    const handleSaveDietIntake = (data: DietIntakeItem) => {
        if (editingDietIntake) {
             setAdditionalDietItems(prev => prev.map(item => item.id === editingDietIntake.id ? { ...item, ...data } : item));
             addToast('Diet intake updated!', 'success');
        } else {
             const newItem: DietIntakeItem = {
                ...data,
                id: Date.now().toString(),
            };
            setAdditionalDietItems(prev => [...prev, newItem]);
            addToast('Food added to your daily log!', 'success');
        }
        handleCloseAddDietIntake();
    };
    
    const handleDeleteDietIntake = (itemId: string) => {
        setAdditionalDietItems(prevItems => prevItems.filter(i => i.id !== itemId));
        addToast('Diet intake removed.', 'info');
    };

    // --- CRUD for Food Items within a Nutrition Plan ---
    const handleOpenAddPlanFoodItem = (planId: number, mealTime: string) => {
        setEditingPlanFoodItem({ planId, mealTime, item: undefined });
    };

    const handleOpenEditPlanFoodItem = (planId: number, mealTime: string, item: FoodItem) => {
        setEditingPlanFoodItem({ planId, mealTime, item });
    };

    const handleClosePlanFoodItem = () => {
        setEditingPlanFoodItem(null);
    };

    const calculatePlanTotals = (content: MealEntry[]): NutritionTotals => {
        return content.flatMap(m => m.items).reduce((totals, item) => {
            totals.energy += item.calories || 0;
            totals.carbohydrates += item.carbohydrates || 0;
            totals.proteins += item.proteins || 0;
            totals.fats += item.fats || 0;
            totals.fibre += item.fibre || 0;
            totals.water += item.water || 0;
            totals.vitaminA = (totals.vitaminA || 0) + (item.vitaminA || 0);
            totals.vitaminC = (totals.vitaminC || 0) + (item.vitaminC || 0);
            totals.calcium = (totals.calcium || 0) + (item.calcium || 0);
            totals.iron = (totals.iron || 0) + (item.iron || 0);
            return totals;
        }, { energy: 0, carbohydrates: 0, proteins: 0, fats: 0, fibre: 0, water: 0, vitaminA: 0, vitaminC: 0, calcium: 0, iron: 0 });
    };

    const handleSavePlanFoodItem = (newItemData: Omit<FoodItem, 'id'>) => {
        if (!editingPlanFoodItem) return;

        const { planId, mealTime, item: originalItem } = editingPlanFoodItem;

        setNutritionPlans(prevPlans => {
            const newPlans = prevPlans.map(plan => {
                if (plan.id === planId) {
                    const newContent = plan.content.map(meal => {
                        if (meal.mealTime === mealTime) {
                            if (originalItem) { // Editing
                                const updatedItems = meal.items.map(i =>
                                    i.id === originalItem.id ? { ...i, ...newItemData } : i
                                );
                                return { ...meal, items: updatedItems };
                            } else { // Adding
                                const newItem: FoodItem = {
                                    id: Date.now().toString(),
                                    ...newItemData,
                                };
                                return { ...meal, items: [...meal.items, newItem] };
                            }
                        }
                        return meal;
                    });

                    const newTotals = calculatePlanTotals(newContent);
                    const updatedPlan = { ...plan, content: newContent, totals: newTotals };
                    
                    // Also update the currently viewed plan to see changes instantly
                    if (viewingNutritionPlan?.id === planId) {
                        setViewingNutritionPlan(updatedPlan);
                    }
                    
                    return updatedPlan;
                }
                return plan;
            });
            return newPlans;
        });

        addToast(originalItem ? 'Food item updated!' : 'Food item added to plan!', 'success');
        handleClosePlanFoodItem();
    };

    const handleDeletePlanFoodItem = (planId: number, mealTime: string, itemId: string) => {
        if (!window.confirm('Are you sure you want to permanently delete this item from the plan?')) return;
    
        setNutritionPlans(prevPlans => {
            return prevPlans.map(plan => {
                if (plan.id === planId) {
                    const newContent = plan.content.map(meal => {
                        if (meal.mealTime === mealTime) {
                            const updatedItems = meal.items.filter(i => i.id !== itemId);
                            return { ...meal, items: updatedItems };
                        }
                        return meal;
                    });
    
                    const newTotals = calculatePlanTotals(newContent);
                    const updatedPlan = { ...plan, content: newContent, totals: newTotals };
    
                    if (viewingNutritionPlan?.id === planId) {
                        setViewingNutritionPlan(updatedPlan);
                    }
    
                    return updatedPlan;
                }
                return plan;
            });
        });
        addToast('Food item removed from plan.', 'info');
    };

    const handleOpenAddNote = (date: Date) => {
        setEditingNote(null);
        setDateForNote(date);
        setIsAddingNote(true);
    };

    const handleOpenEditNote = (note: UserNote) => {
        setEditingNote(note);
        setDateForNote(new Date(note.date + 'T00:00:00'));
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
            addToast('Note updated!', 'success');
        } else {
            const newNote: UserNote = {
                id: Date.now().toString(),
                ...data,
            };
            setUserNotes(prev => [newNote, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
            addToast('Note added!', 'success');
        }
        
        handleCloseAddNote();
    };
    
    const handleDeleteNote = (noteId: string) => {
        setUserNotes(prevNotes => prevNotes.filter(n => n.id !== noteId));
        addToast('Note deleted.', 'info');
    };
    
    const handleOpenAddMeasurement = (date: Date) => {
        const dateKey = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
        const measurementForDate = userMeasurements.find(m => m.date === dateKey);
        
        setDateForMeasurement(date);
    
        if (measurementForDate) {
            // Edit existing entry for the day
            setEditingMeasurement(measurementForDate);
        } else {
            // Add a new entry for the day, pre-filling from the most recent one.
            const lastMeasurement = [...userMeasurements]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .find(m => m.date < dateKey);
    
            if (lastMeasurement) {
                const { id, date: _oldDate, ...rest } = lastMeasurement;
                const prefillData: UserMeasurement = { ...rest, id: '', date: dateKey };
                setEditingMeasurement(prefillData);
            } else {
                setEditingMeasurement(null);
            }
        }
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
        const isEditing = editingMeasurement && editingMeasurement.id;
    
        const conflictingMeasurement = userMeasurements.find(m => m.date === date && m.id !== editingMeasurement?.id);
    
        if (conflictingMeasurement) {
            if (isEditing) {
                // User is editing an entry and changed its date to one that's already occupied.
                // We'll update the destination entry with the new data, and remove the original source entry.
                // This effectively "moves" and overwrites in one step.
                addToast(`Updated measurements for ${date}.`, 'info');
    
                const updatedDataForConflict = { ...conflictingMeasurement, ...measurementData, date };
                
                setUserMeasurements(prev => {
                    // Remove the original entry that was being edited.
                    const withoutOriginal = prev.filter(m => m.id !== editingMeasurement.id);
                    // Find the conflicting entry in the filtered list and update it.
                    return withoutOriginal.map(m => m.id === conflictingMeasurement.id ? updatedDataForConflict : m)
                         .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                });
    
            } else {
                // User is trying to ADD a new entry on a date that already has one.
                addToast("A measurement entry for this date already exists. Please choose a different date or edit the existing entry.", 'error');
                return;
            }
        } else if (isEditing) {
            // Standard update: editing an entry without changing its date to a conflicting one.
            const updatedMeasurement: UserMeasurement = { ...editingMeasurement, ...measurementData, date };
            setUserMeasurements(prev => prev.map(m => m.id === editingMeasurement.id ? updatedMeasurement : m)
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
            addToast('Measurements updated!', 'success');
        } else {
            // Standard add: creating a new entry on an empty date.
            const newMeasurement: UserMeasurement = { id: Date.now().toString(), date, ...measurementData };
            setUserMeasurements(prev => [newMeasurement, ...prev]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
            addToast('Measurements saved!', 'success');
        }
        
        const today = new Date();
        const todayKey = new Date(today.getTime() - (today.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
        if (data.date === todayKey) {
            setCompletedTasks(prev => {
                const newCompleted = { ...prev };
                const tasksForDate = new Set(newCompleted[todayKey] || []);
                if (!tasksForDate.has('log_measurements')) {
                    tasksForDate.add('log_measurements');
                    addToast(`Task completed: Log daily measurements! +${TASK_POINTS} points`, 'success');
                }
                newCompleted[todayKey] = tasksForDate;
                return newCompleted;
            });
        }
    
        handleCloseAddMeasurement();
    };
    
    const handleDeleteMeasurement = (measurementId: string) => {
        setUserMeasurements(prev => prev.filter(m => m.id !== measurementId));
        addToast('Measurement entry deleted.', 'info');
    };

    const handleOpenAddPhoto = (date: Date) => {
        setEditingPhoto(null);
        setDateForPhoto(date);
        setIsAddingPhoto(true);
    };

    const handleOpenEditPhoto = (photo: UserPhoto) => {
        setEditingPhoto(photo);
        setDateForPhoto(new Date(photo.date + 'T00:00:00'));
        setIsAddingPhoto(true);
    };
    
    const handleCloseAddPhoto = () => {
        setIsAddingPhoto(false);
        setEditingPhoto(null);
    };

    const handleSavePhoto = (photoData: Omit<UserPhoto, 'id'>) => {
        let savedPhoto: UserPhoto;

        if (editingPhoto) {
            const updatedPhoto: UserPhoto = { ...editingPhoto, ...photoData };
            setUserPhotos(prev => prev.map(p => p.id === editingPhoto.id ? updatedPhoto : p)
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            );
            addToast('Photo details updated!', 'success');
            savedPhoto = updatedPhoto;
        } else {
            const newPhoto: UserPhoto = {
                id: Date.now().toString(),
                ...photoData,
            };
            setUserPhotos(prev => [newPhoto, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
            addToast('Photo added!', 'success');
            savedPhoto = newPhoto;
        }

        if (savedPhoto.description) {
            const newNote: UserNote = {
                id: `note-from-photo-${savedPhoto.id}-${Date.now()}`,
                date: savedPhoto.date,
                content: `[Photo: ${savedPhoto.type}]\n${savedPhoto.description}`
            };
            setUserNotes(prev => [newNote, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
            addToast('Note added from photo description.', 'info');
        }
        
        const today = new Date();
        const todayKey = new Date(today.getTime() - (today.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
        if (photoData.date === todayKey) {
            let taskId: string | null = null;
            if (photoData.type === 'Front') {
                taskId = 'photo_front';
            } else if (photoData.type === 'Side') {
                taskId = 'photo_side';
            }

            if (taskId) {
                const finalTaskId = taskId; 
                setCompletedTasks(prev => {
                    const newCompleted = { ...prev };
                    const tasksForDate = new Set(newCompleted[todayKey] || []);
                    if (!tasksForDate.has(finalTaskId)) {
                        tasksForDate.add(finalTaskId);
                        const taskTitle = DAILY_CHALLENGE_TASKS.find(t => t.id === finalTaskId)?.title;
                        if (taskTitle) {
                            addToast(`Task completed: ${taskTitle}! +${TASK_POINTS} points`, 'success');
                        }
                    }
                    newCompleted[todayKey] = tasksForDate;
                    return newCompleted;
                });
            }
        }
        
        handleCloseAddPhoto();
    };

    const handleDeletePhoto = (photoId: string) => {
        setUserPhotos(prevPhotos => prevPhotos.filter(p => p.id !== photoId));
        addToast('Photo deleted.', 'info');
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
                addToast(`Task completed! +${TASK_POINTS} points`, 'success');
            }
            newCompleted[dateKey] = tasksForDate;
            return newCompleted;
        });
    };
    
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
                addToast(`Weekly task completed! +${TASK_POINTS} points`, 'success');
            }
            newCompleted[weekKey] = tasksForWeek;
            return newCompleted;
        });
    };

    const handleToggleNutritionItem = (itemId: string, date: Date) => {
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
    
    useEffect(() => {
        if (!activePlan) return;

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
                    addToast(`Task completed: Stick to your meal plan! +${TASK_POINTS} points`, 'success');
                    return newCompleted;
                } else if (!allItemsChecked && wasCompleted) {
                    tasksForDate.delete('meal_plan');
                    newCompleted[dateISO] = tasksForDate;
                    return newCompleted;
                }
                return prev;
            });
        });

    }, [checkedNutritionItems, activePlan, additionalDietItems, addToast]);
    
    const handleViewLeaderboard = () => {
        setIsViewingLeaderboard(true);
    };

    const handleBackFromLeaderboard = () => {
        setIsViewingLeaderboard(false);
    };

    const handleViewMyStats = () => {
        setIsViewingMyStats(true);
    };

    const handleBackFromMyStats = () => {
        setIsViewingMyStats(false);
    };

    // Points calculation logic
    const currentUserTotalPoints = useMemo(() => {
        // FIX: Correctly type the results of Object.values() to resolve errors in the reduce function.
        const dailyTasksSets = Object.values(completedTasks) as Set<string>[];
        const weeklyTasksSets = Object.values(completedWeeklyTasks) as Set<string>[];

        const totalPoints = dailyTasksSets.reduce((acc, tasks) => acc + tasks.size * TASK_POINTS, 0)
                          + weeklyTasksSets.reduce((acc, tasks) => acc + tasks.size * TASK_POINTS, 0);
        return totalPoints;
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

    const streak = useMemo(() => {
        if (!currentUser) return 0;
        // FIX: Corrected typo from DAILY_CHallenge_TASKS to DAILY_CHALLENGE_TASKS.
        const dailyTaskIds = new Set(DAILY_CHALLENGE_TASKS.map(t => t.id));
        let streakCount = 0;
        const checkDate = new Date();

        while (true) {
            const currentCheckDateKey = checkDate.toISOString().split('T')[0];
            const completedOnDate = completedTasks[currentCheckDateKey] || new Set();
            
            const allDailyCompleted = [...dailyTaskIds].every(id => completedOnDate.has(id));

            if (allDailyCompleted) {
                streakCount++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                break;
            }
        }
        return streakCount;
    }, [completedTasks, currentUser]);


    // --- Community Handlers ---
    const handleSelectCommunity = (id: number) => {
        setSelectedCommunityId(id);
        setSelectedChannelId(null);
        setHubActiveFilter('feed');
        setIsAddingMembers(false);
    };

    const handleSelectChannel = (id: number) => {
        setSelectedChannelId(id);
    };

    const handleBackToCommunityHub = () => {
        setSelectedChannelId(null);
        setHubActiveFilter('channels');
    };
    
    const handleBackToCommunityList = () => {
        setSelectedCommunityId(null);
        setSelectedChannelId(null);
        setIsAddingMembers(false);
    };

    const handleLeaveCommunity = (communityId: number) => {
        const community = communities.find(c => c.id === communityId);
        setCommunities(prev => prev.map(c => {
            if (c.id === communityId) {
                return {
                    ...c,
                    members: c.members.filter(m => m.id !== currentUser!.id)
                };
            }
            return c;
        }));
        if (community) {
            addToast(`You have left ${community.name}.`, 'info');
        }
        handleBackToCommunityList();
    };

    const handleCreatePost = (communityId: number, channelId: number, postData: Omit<Post, 'id' | 'user' | 'communityId' | 'channelId' | 'likes' | 'commentCount' | 'comments'>) => {
        setCommunities(prev => prev.map(c => {
            if (c.id === communityId) {
                const newPost: Post = {
                    ...postData,
                    channelId,
                    id: Date.now(),
                    user: currentUser!,
                    communityId: communityId,
                    likes: 0,
                    commentCount: 0,
                    comments: [],
                };
                return { ...c, posts: [newPost, ...c.posts] };
            }
            return c;
        }));
    };

    const handleAddOrUpdateChatMessage = (communityId: number, newMsgData: Partial<ChatMessage> & { text: string } ) => {
        setCommunities(prev => prev.map(c => {
            if (c.id === communityId) {
                if (newMsgData.id) {
                    const updatedMessages = c.chatMessages.map(msg => 
                        msg.id === newMsgData.id ? { ...msg, ...newMsgData } : msg
                    );
                    return { ...c, chatMessages: updatedMessages };
                } else {
                    const newMsg: ChatMessage = {
                        id: Date.now(),
                        user: currentUser!,
                        timestamp: `Today ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
                        reactions: [],
                        ...newMsgData
                    };
                    return { ...c, chatMessages: [...c.chatMessages, newMsg] };
                }
            }
            return c;
        }));
        addToast(newMsgData.id ? 'Message updated.' : 'Message sent!', 'success');
    };
    
    const handleUpdateCommunity = (communityId: number, updatedData: { name: string; description: string }) => {
        setCommunities(prev => prev.map(c => 
            c.id === communityId ? { ...c, ...updatedData } : c
        ));
        addToast('Community details updated.', 'success');
    };

    const handleAddChannel = (communityId: number, channelName: string, channelType: ChannelType) => {
        let channelAdded = false;
        setCommunities(prev => prev.map(c => {
            if (c.id === communityId) {
                const newChannel: Channel = {
                    id: Date.now(),
                    name: channelName.trim().toLowerCase().replace(/\s+/g, '-'),
                    type: channelType,
                };
                if (c.channels.some(ch => ch.name === newChannel.name)) {
                    addToast('A channel with this name already exists.', 'error');
                    return c;
                }
                channelAdded = true;
                return { ...c, channels: [...c.channels, newChannel] };
            }
            return c;
        }));
        if (channelAdded) {
            addToast('New channel created!', 'success');
        }
    };

    const handleUpdateChannel = (communityId: number, channelId: number, updatedData: { name: string; type: ChannelType }) => {
        let channelUpdated = false;
        setCommunities(prev => prev.map(c => {
            if (c.id === communityId) {
                const sanitizedName = updatedData.name.trim().toLowerCase().replace(/\s+/g, '-');
                if (c.channels.some(ch => ch.name === sanitizedName && ch.id !== channelId)) {
                    addToast('A channel with this name already exists.', 'error');
                    return c;
                }
                channelUpdated = true;
                return { ...c, channels: c.channels.map(ch => ch.id === channelId ? { ...ch, name: sanitizedName, type: updatedData.type } : ch )};
            }
            return c;
        }));
        if (channelUpdated) {
            addToast('Channel updated.', 'success');
        }
    };

    const handleCreateCommunity = (data: { name: string; description: string; isPrivate: boolean; }) => {
        const dummyMember = USERS_DATA[2];
        const newCommunity: Community = {
            id: Date.now(),
            name: data.name,
            description: data.description,
            isPrivate: data.isPrivate,
            adminId: currentUser!.id,
            members: [currentUser!, dummyMember],
            channels: [
                { id: 1, name: 'general-posts', type: 'posts' },
                { id: 2, name: 'random-chat', type: 'chat' },
                { id: 3, name: 'members', type: 'members' },
                { id: 4, name: 'support', type: 'chat' },
            ],
            posts: [],
            chatMessages: [
                 { id: 1, user: currentUser!, text: `Welcome to ${data.name}!`, timestamp: 'Today 12:00 PM', reactions: [] },
                 { id: 2, user: dummyMember, text: 'Glad to be here!', timestamp: 'Today 12:01 PM', reactions: [{ emoji: '👋', user: currentUser! }] },
                 { id: 3, user: dummyMember, text: "How do I sync my tracker?", timestamp: 'Today 12:05 PM', reactions: [], notes: 'Follow up.' },
                 { id: 4, user: currentUser!, text: `Hey ${dummyMember.name}! Go to Profile > Settings.`, timestamp: 'Today 12:06 PM', reactions: [], toUserId: dummyMember.id, }
            ],
            sharedPlans: [],
            sharedGoals: [],
        };
        setCommunities(prev => [newCommunity, ...prev]);
        addToast(`Community "${data.name}" created!`, 'success');
    };

    const handleBadgeClick = () => {
        if (notificationBadgeData) {
            setActiveTab('Community');
            handleSelectCommunity(notificationBadgeData.communityId);
            setNotificationBadgeData(null);
        }
    };

    // --- Share Achievement Handlers ---
    const handleOpenShareAchievement = (data: { streak: number; pointsEarned: number; }) => {
        const postData = {
            ...data,
            description: `I just completed all my daily tasks and earned ${data.pointsEarned} points! My streak is now ${data.streak} days. 🔥`,
            hashtags: ['#AchievementUnlocked', '#DailyGoals', '#FMFC'],
        };
        setSharingAchievementData(postData);
    };
    
    const handleShareMyStats = () => {
        const postData = {
            streak,
            pointsEarned: currentUserTotalPoints,
            description: `Check out my progress! I've earned ${currentUserTotalPoints.toLocaleString()} points with a ${streak}-day streak! 🚀`,
            hashtags: ['#FMFC', '#FitnessJourney', '#MyStats'],
        };
        setSharingAchievementData(postData);
    };

    const handleCloseShareAchievement = () => {
        setSharingAchievementData(null);
    };

    const handleShareAchievementPost = (communityId: number, channelId: number) => {
        if (!sharingAchievementData || !currentUser) return;
        const { description, hashtags } = sharingAchievementData;
        const postData = { description, hashtags };
        handleCreatePost(communityId, channelId, postData);
        addToast('Achievement shared!', 'success');
        handleCloseShareAchievement();
    };

    // --- Share Tasks Handlers ---
    const handleOpenShareTasks = (data: { date: Date; tasks: ChallengeTask[]; completedDaily: Set<string>; completedWeekly: Set<string>; }) => {
        setSharingTasksData(data);
    };

    const handleCloseShareTasks = () => {
        setSharingTasksData(null);
    };

    const handleShareTasksPost = (communityId: number, channelId: number) => {
        if (!sharingTasksData || !currentUser) return;
    
        const newSharedGoal: SharedGoal = {
            id: Date.now(),
            user: currentUser,
            date: sharingTasksData.date.toISOString().split('T')[0],
            tasks: sharingTasksData.tasks,
            completedDaily: sharingTasksData.completedDaily,
            completedWeekly: sharingTasksData.completedWeekly,
        };
    
        setCommunities(prev => prev.map(c => {
            if (c.id === communityId) {
                return { ...c, sharedGoals: [...(c.sharedGoals || []), newSharedGoal] };
            }
            return c;
        }));
    
        const formatDate = (d: Date) => d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    
        const postData = {
            description: `${currentUser.name} shared their goals for ${formatDate(sharingTasksData.date)}. Check them out in the community's Goals tab!`,
            hashtags: ['#DailyGoals', '#Accountability', '#FMFC'],
        };
        handleCreatePost(communityId, channelId, postData);
    
        addToast('Goals shared to community!', 'success');
        handleCloseShareTasks();
    };

    // --- Share Nutrition Plan Handlers ---
    const handleOpenSharePlan = (plan: NutritionPlan) => {
        setSharingNutritionPlan(plan);
    };

    const handleCloseSharePlan = () => {
        setSharingNutritionPlan(null);
    };
    
    const handleSharePlanToCommunity = (communityId: number, channelId: number) => {
        if (!sharingNutritionPlan) return;
        
        setCommunities(prev => prev.map(c => {
            if (c.id === communityId) {
                const updatedSharedPlans = [...(c.sharedPlans || []), sharingNutritionPlan];
                return { ...c, sharedPlans: updatedSharedPlans };
            }
            return c;
        }));

        const postData = {
            description: `${currentUser!.name} shared a new nutrition plan: "${sharingNutritionPlan.name}". Check it out in the community's Nutrition tab!`,
            hashtags: ['#NutritionPlan', '#HealthyEating', '#FMFC'],
        };
        handleCreatePost(communityId, channelId, postData);

        addToast(`Plan shared to community!`, 'success');
        handleCloseSharePlan();
    };
    
    const handleCopyTemplatePlan = (planToCopy: NutritionPlan) => {
        const newTemplate: NutritionPlan = {
            ...planToCopy,
            id: Date.now(),
            isTemplate: true,
            isActive: false,
            name: `${planToCopy.name} (Copied)`,
        };

        setNutritionPlans(prev => [...prev, newTemplate]);
        addToast(`"${planToCopy.name}" was copied to your templates.`, 'success');
        setViewingSharedItem(null); // Close the detail view after copying
    };

    // --- Share Progress Comparison Handlers ---
    const handleOpenShareProgress = (data: { before: UserPhoto; after: UserPhoto; generatedImage: string; description: string; }) => {
        setSharingProgressData(data);
    };
    
    const handleCloseShareProgress = () => {
        setSharingProgressData(null);
    };
    
    const handleShareProgressPost = (communityId: number, channelId: number) => {
        if (!sharingProgressData || !currentUser) return;
        const { generatedImage, description } = sharingProgressData;
        const postData = {
            image: generatedImage,
            description,
            hashtags: ['#Progress', '#Transformation', '#FMFC'],
        };
        handleCreatePost(communityId, channelId, postData);
        addToast('Progress shared!', 'success');
        handleCloseShareProgress();
    };

    // --- Community Shared Item View Handlers ---
    const handleViewSharedItem = (item: NutritionPlan | SharedGoal, type: 'nutrition' | 'goal', communityName: string) => {
        setViewingSharedItem({ data: item, type, communityName });
    };

    const handleCloseSharedItemView = () => {
        setViewingSharedItem(null);
    };

    // --- AI Flow Handlers ---
    const handleCloseAskAi = () => setAiSource(null);
    const handleSaveAiPlan = (plan: NutritionPlan) => {
        setNutritionPlans(prev => [...prev, plan]);
        addToast('New nutrition plan saved as template!', 'success');
        handleCloseAskAi();
        handleSideMenuNavigate('My Nutrition Plans');
    };

    // --- Workout Handlers ---
    const handleViewWorkout = (workout: Workout, isMine: boolean = false) => {
        setViewingWorkout({ workout, isMine });
    };

    const handleBackFromWorkout = () => {
        setViewingWorkout(null);
        setSharingWorkout(null);
        setViewingExercise(null); // Ensure this is cleared
    };
    
    const handleOpenShareWorkout = (workout: Workout) => {
        setSharingWorkout(workout);
    };

    const handleCloseShareWorkout = () => {
        setSharingWorkout(null);
    };

    const handleShareWorkoutToChannel = (communityId: number, channelId: number) => {
        if (!sharingWorkout || !currentUser) return;
    
        setCommunities(prev => prev.map(c => {
            if (c.id === communityId) {
                // When sharing a template, create a new instance for the community
                const newWorkoutForCommunity: Workout = {
                    ...sharingWorkout,
                    id: Date.now(), // Ensure unique ID within the community
                    isTemplate: false, // This is now an instance, not a template
                };
                const updatedWorkouts = [...(c.workouts || []), newWorkoutForCommunity];

                const newMsg: ChatMessage = {
                    id: Date.now() + 1, // ensure unique ID
                    user: currentUser,
                    timestamp: `Today ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
                    reactions: [],
                    text: `${currentUser.name} shared the "${sharingWorkout.title}" workout. Check it out in the Workouts tab!`,
                    workout: sharingWorkout,
                };
                return { ...c, chatMessages: [...c.chatMessages, newMsg], workouts: updatedWorkouts };
            }
            return c;
        }));
    
        addToast(`Workout shared to community!`, 'success');
        handleCloseShareWorkout();
        setViewingWorkout(null); // Go back to workout list after sharing
    };

    const handleViewExercise = (exercise: Exercise) => {
        setViewingExercise(exercise);
    };

    const handleBackFromExercise = () => {
        setViewingExercise(null);
    };

    const handleSaveWorkoutTemplate = (workout: Workout) => {
        const newTemplate: Workout = {
            ...workout,
            id: Date.now(),
            isTemplate: true,
            title: `${workout.title} (Copy)`
        };
        setMyWorkouts(prev => [...prev, newTemplate]);
        addToast('Workout copied to your templates!', 'success');
    };

    const handleAddToMyWorkouts = (workout: Workout) => {
        const newWorkout: Workout = {
            ...workout,
            id: Date.now(),
            isTemplate: false,
        };
        setMyWorkouts(prev => [...prev, newWorkout]);
        addToast('Workout added to My Workouts!', 'success');
    };

    const handleStartWorkout = (workout: Workout) => {
        setActiveWorkoutSession(workout);
    };

    const handleCloseSession = () => {
        setActiveWorkoutSession(null);
    };
    
    const handleCompleteSession = () => {
        setActiveWorkoutSession(null);
        setViewingWorkout(null); // Go back to main list
        addToast("Workout session completed!", 'success');
    };

    const handleCreateWorkout = () => {
        setIsCreatingWorkout(true);
    };

    const handleCloseCreateWorkout = () => {
        setIsCreatingWorkout(false);
    };

    const handleSaveNewWorkout = (newWorkout: Workout, isPrivate: boolean) => {
        setMyWorkouts(prev => [...prev, newWorkout]);
        
        if (!isPrivate) {
            setPublicWorkouts(prev => [...prev, newWorkout]);
        }
        
        setIsCreatingWorkout(false);
        addToast('Workout created successfully!', 'success');
    };


    const renderPage = () => {
        if (activeWorkoutSession) {
            return <WorkoutSessionPage
                workout={activeWorkoutSession}
                onClose={handleCloseSession}
                onComplete={handleCompleteSession}
            />;
        }

        if (isCreatingWorkout) {
            return <CreateWorkoutPage
                onClose={handleCloseCreateWorkout}
                onSave={handleSaveNewWorkout}
            />;
        }

        if (viewingExercise) {
            return <ExerciseDetailsPage 
                        exercise={viewingExercise} 
                        onBack={handleBackFromExercise} 
                    />;
        }

        if (sharingWorkout) {
            return <ShareWorkoutPage
                currentUser={currentUser!}
                workoutData={sharingWorkout}
                userCommunities={communities.filter(c => c.members.some(m => m.id === currentUser!.id))}
                onBack={handleCloseShareWorkout}
                onShareToChannel={handleShareWorkoutToChannel}
            />;
        }

        if (viewingWorkout) {
            const { workout, isMine } = viewingWorkout;
            return <WorkoutDetailsPage 
                        workout={workout} 
                        onBack={handleBackFromWorkout}
                        onShare={handleOpenShareWorkout}
                        onExerciseClick={handleViewExercise}
                        onCopyTemplate={!isMine ? handleSaveWorkoutTemplate : undefined}
                        onAddToMyWorkouts={!isMine ? handleAddToMyWorkouts : undefined}
                        onStart={handleStartWorkout}
                    />;
        }

        if (viewingSharedItem) {
            if (viewingSharedItem.type === 'nutrition') {
                return <NutritionPlanDetailsPage 
                            plan={viewingSharedItem.data as NutritionPlan} 
                            onBack={handleCloseSharedItemView}
                            isEditable={false}
                            onAddItemToMeal={() => {}}
                            onEditItem={() => {}}
                            onDeleteItem={() => {}}
                            onCopyPlan={handleCopyTemplatePlan}
                       />;
            }
             if (viewingSharedItem.type === 'goal') {
                return <SharedGoalDetailsPage
                            sharedGoal={viewingSharedItem.data as SharedGoal}
                            communityName={viewingSharedItem.communityName}
                            onBack={handleCloseSharedItemView}
                            onCopyTasks={() => addToast("This will copy these tasks to your goals for today. (Coming soon!)", "info")}
                        />;
            }
        }

        if (editingPlanFoodItem) {
            return <AddPlanFoodItemPage
                onClose={handleClosePlanFoodItem}
                onSave={handleSavePlanFoodItem}
                initialData={editingPlanFoodItem.item}
                mealTime={editingPlanFoodItem.mealTime}
            />;
        }

        if (aiSource) {
            return <AskAiPage
                onClose={handleCloseAskAi}
                userMeasurements={userMeasurements}
                additionalDietItems={additionalDietItems}
                activePlan={activePlan}
                checkedNutritionItems={checkedNutritionItems}
                onSavePlan={handleSaveAiPlan}
                source={aiSource}
            />;
        }

        if (sharingProgressData) {
            return <ShareProgressPage
                currentUser={currentUser!}
                shareData={sharingProgressData}
                userCommunities={communities.filter(c => c.members.some(m => m.id === currentUser!.id))}
                onBack={handleCloseShareProgress}
                onShareToChannel={handleShareProgressPost}
            />;
        }

        if (sharingNutritionPlan) {
            return <ShareNutritionPlanPage
                currentUser={currentUser!}
                planData={sharingNutritionPlan}
                userCommunities={communities.filter(c => c.members.some(m => m.id === currentUser!.id))}
                onBack={handleCloseSharePlan}
                onShareToChannel={handleSharePlanToCommunity}
            />;
        }

        if (sharingTasksData) {
            return <ShareTasksPage
                currentUser={currentUser!}
                shareData={sharingTasksData}
                userCommunities={communities.filter(c => c.members.some(m => m.id === currentUser!.id))}
                onBack={handleCloseShareTasks}
                onShareToChannel={handleShareTasksPost}
            />;
        }

        if (sharingAchievementData) {
            return <ShareAchievementPage
                currentUser={currentUser!}
                achievementData={sharingAchievementData}
                userCommunities={communities.filter(c => c.members.some(m => m.id === currentUser!.id))}
                onBack={handleCloseShareAchievement}
                onShareToChannel={handleShareAchievementPost}
            />;
        }
        
        if (isViewingMyStats) {
            return <MyStatsPage
                currentUser={currentUser!}
                totalPoints={currentUserTotalPoints}
                streak={streak}
                completedTasks={completedTasks}
                onBack={handleBackFromMyStats}
                onShare={handleShareMyStats}
            />;
        }

        if (isViewingLeaderboard) {
            return <LeaderboardPage 
                onBack={handleBackFromLeaderboard}
                leaderboardData={leaderboardData}
                currentUserId={currentUser!.id}
                onViewMyStats={handleViewMyStats}
            />;
        }

        if (isAddingPhoto) {
            return <AddPhotoPage 
                onClose={handleCloseAddPhoto} 
                onSave={handleSavePhoto} 
                initialData={editingPhoto} 
                date={dateForPhoto}
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
                date={dateForNote}
            />;
        }
        
        if (isAddingDietIntake) {
            return <AddDietIntakePage
                        onClose={handleCloseAddDietIntake}
                        onSave={handleSaveDietIntake}
                        initialData={editingDietIntake}
                        date={dateForDietIntake}
                    />;
        }

        if (viewingNutritionPlan) {
            const isActivePlan = viewingNutritionPlan.id === activePlan?.id;
            return <NutritionPlanDetailsPage 
                        plan={viewingNutritionPlan} 
                        onBack={handleBackFromPlanDetails}
                        isEditable={isActivePlan || viewingNutritionPlan.isTemplate}
                        onAddItemToMeal={(mealTime) => handleOpenAddPlanFoodItem(viewingNutritionPlan.id, mealTime)}
                        onEditItem={(mealTime, item) => handleOpenEditPlanFoodItem(viewingNutritionPlan.id, mealTime, item)}
                        onDeleteItem={(mealTime, itemId) => handleDeletePlanFoodItem(viewingNutritionPlan.id, mealTime, itemId)}
                        onShare={handleOpenSharePlan}
                   />;
        }
        
        if (currentSecondaryPage) {
            if (currentSecondaryPage === 'My Nutrition Plans') {
                return <NutritionPage 
                            plans={nutritionPlans} 
                            onBack={handleBackFromSecondaryPage} 
                            onViewPlan={handleViewNutritionPlan}
                            onActivatePlan={handleActivatePlan}
                            onAskAi={() => setAiSource('nutrition')}
                       />;
            }
            if (currentSecondaryPage === 'Progress') {
                 return <JournalPage
                    onBack={handleBackFromSecondaryPage}
                    userMeasurements={userMeasurements}
                    additionalDietItems={additionalDietItems}
                    activePlan={activePlan}
                    checkedNutritionItems={checkedNutritionItems}
                    userPhotos={userPhotos}
                    userNotes={userNotes}
                    onAskAi={() => setAiSource('journal')}
                    onShareProgress={handleOpenShareProgress}
                />;
            }
            return <UnderDevelopmentPage 
                        pageName={currentSecondaryPage} 
                        onMenuClick={toggleMenu} 
                        onBack={handleBackFromSecondaryPage} 
                        onToggleNotifications={handleToggleNotifications}
                        hasUnreadNotifications={hasUnreadNotifications}
                    />;
        }

        switch (activeTab) {
            case 'Community':
                return <CommunityPage 
                            currentUser={currentUser!} 
                            onMenuClick={toggleMenu}
                            communities={communities}
                            selectedCommunityId={selectedCommunityId}
                            selectedChannelId={selectedChannelId}
                            hubActiveFilter={hubActiveFilter}
                            isAddingMembers={isAddingMembers}
                            onSelectCommunity={handleSelectCommunity}
                            onSelectChannel={handleSelectChannel}
                            onBackToCommunityHub={handleBackToCommunityHub}
                            onBackToCommunityList={handleBackToCommunityList}
                            onLeaveCommunity={handleLeaveCommunity}
                            onCreatePost={handleCreatePost}
                            onAddOrUpdateChatMessage={handleAddOrUpdateChatMessage}
                            onUpdateCommunity={handleUpdateCommunity}
                            onAddChannel={handleAddChannel}
                            onUpdateChannel={handleUpdateChannel}
                            onAddMembers={() => setIsAddingMembers(true)}
                            onSetIsAddingMembers={setIsAddingMembers}
                            onSetHubActiveFilter={setHubActiveFilter}
                            onCreateCommunity={handleCreateCommunity}
                            onToggleNotifications={handleToggleNotifications}
                            hasUnreadNotifications={hasUnreadNotifications}
                            onCopyPlan={handleCopyTemplatePlan}
                            onViewSharedItem={handleViewSharedItem}
                            onViewWorkout={handleViewWorkout}
                        />;
            case 'Profile':
                return <ProfilePage
                            currentUser={currentUser!}
                            onNavigate={handleSideMenuNavigate}
                            onMenuClick={toggleMenu}
                            activePlan={activePlan}
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
                            onToggleNotifications={handleToggleNotifications}
                            hasUnreadNotifications={hasUnreadNotifications}
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
                            leaderboardData={leaderboardData}
                            onShareAchievement={handleOpenShareAchievement}
                            onViewMyStats={handleViewMyStats}
                            onShareTasks={handleOpenShareTasks}
                            onToggleNotifications={handleToggleNotifications}
                            hasUnreadNotifications={hasUnreadNotifications}
                        />;
            case 'Session':
                return <UnderDevelopmentPage 
                            pageName={activeTab} 
                            onMenuClick={toggleMenu}
                            onToggleNotifications={handleToggleNotifications}
                            hasUnreadNotifications={hasUnreadNotifications}
                        />;
            case 'Workouts':
                return <WorkoutsPage
                            onMenuClick={toggleMenu}
                            onToggleNotifications={handleToggleNotifications}
                            hasUnreadNotifications={hasUnreadNotifications}
                            onViewWorkout={handleViewWorkout}
                            myWorkouts={myWorkouts}
                            publicWorkouts={publicWorkouts}
                            onCreateWorkout={handleCreateWorkout}
                        />;
            default:
                return <CommunityPage 
                            currentUser={currentUser!} 
                            onMenuClick={toggleMenu}
                            communities={communities}
                            selectedCommunityId={selectedCommunityId}
                            selectedChannelId={selectedChannelId}
                            hubActiveFilter={hubActiveFilter}
                            isAddingMembers={isAddingMembers}
                            onSelectCommunity={handleSelectCommunity}
                            onSelectChannel={handleSelectChannel}
                            onBackToCommunityHub={handleBackToCommunityHub}
                            onBackToCommunityList={handleBackToCommunityList}
                            onLeaveCommunity={handleLeaveCommunity}
                            onCreatePost={handleCreatePost}
                            onAddOrUpdateChatMessage={handleAddOrUpdateChatMessage}
                            onUpdateCommunity={handleUpdateCommunity}
                            onAddChannel={handleAddChannel}
                            onUpdateChannel={handleUpdateChannel}
                            onAddMembers={() => setIsAddingMembers(true)}
                            onSetIsAddingMembers={setIsAddingMembers}
                            onSetHubActiveFilter={setHubActiveFilter}
                            onCreateCommunity={handleCreateCommunity}
                            onToggleNotifications={handleToggleNotifications}
                            hasUnreadNotifications={hasUnreadNotifications}
                            onCopyPlan={handleCopyTemplatePlan}
                            onViewSharedItem={handleViewSharedItem}
                            onViewWorkout={handleViewWorkout}
                        />;
        }
    };

    if (!currentUser) {
        return <LoginPage onLogin={setCurrentUser} />;
    }

    return (
        <div className="relative max-w-lg mx-auto h-screen bg-zinc-950 flex flex-col font-sans shadow-2xl overflow-hidden">
             <SideMenu
                isOpen={isMenuOpen}
                currentUser={currentUser}
                onClose={toggleMenu}
                onNavigate={handleSideMenuNavigate}
                onLogout={handleSignOut}
            />
            <NotificationsPanel
                isOpen={isNotificationsOpen}
                notifications={notifications}
                onClose={() => setIsNotificationsOpen(false)}
                onMarkAllAsRead={handleMarkAllAsRead}
            />
            {/* Global Floating Badge */}
            {notificationBadgeData && (
                <FloatingNotificationBadge 
                    communityImage={notificationBadgeData.image}
                    onClick={handleBadgeClick}
                />
            )}
            <main className="flex-grow min-h-0">
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
