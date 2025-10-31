



import React, { useState, useEffect, useMemo } from 'react';
import BottomNav from './components/BottomNav';
import CommunityPage from './pages/CommunityPage';
import UnderDevelopmentPage from './pages/UnderDevelopmentPage';
import LoginPage from './pages/LoginPage';
// FIX: Corrected typo from DAILY_CHallenge_TASKS to DAILY_CHALLENGE_TASKS.
import { NAV_ITEMS, NUTRITION_PLANS_DATA, LEADERBOARD_DATA, TEST_USER, TASK_POINTS, COMMUNITIES_DATA, USERS_DATA, DAILY_CHALLENGE_TASKS } from './constants';
import { NavItemType, User, NutritionPlan, DietIntakeItem, UserNote, UserMeasurement, UserPhoto, Community, ChannelType, Post, ChatMessage, Channel, ChallengeTask } from './types';
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
import ComparePhotosPage from './pages/ComparePhotosPage';
import ComparisonResultPage from './pages/ComparisonResultPage';
import ShareComparisonPage from './pages/ShareComparisonPage';
import ShareTasksPage from './pages/ShareTasksPage';

const App: React.FC = () => {
    const { addToast } = useToast();
    const [activeTab, setActiveTab] = useState<NavItemType>('Goals');
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
     const [sharingComparisonData, setSharingComparisonData] = useState<{
        image: string;
        description: string;
        hashtags: string[];
    } | null>(null);
    const [sharingTasksData, setSharingTasksData] = useState<{
        date: Date;
        tasks: ChallengeTask[];
        completedDaily: Set<string>;
        completedWeekly: Set<string>;
    } | null>(null);

    // STATE FOR PHOTO COMPARISON FLOW
    const [isComparingPhotos, setIsComparingPhotos] = useState(false);
    const [comparisonResultData, setComparisonResultData] = useState<{
        fromPhoto: UserPhoto;
        toPhoto: UserPhoto;
        description: string;
    } | null>(null);

    useEffect(() => {
        // This runs only once on initial load to create some mock history
        const initializeMockHistory = () => {
            if (Object.keys(completedTasks).length === 0) {
                const mockCompleted: Record<string, Set<string>> = {};
                const today = new Date();

                // Go back 5 days to create a streak
                for (let i = 1; i <= 5; i++) {
                    const pastDate = new Date(today);
                    pastDate.setDate(today.getDate() - i);
                    const dateKey = pastDate.toISOString().split('T')[0];
                    
                    const completedTasksForDay = new Set<string>();
                    // FIX: Corrected typo from DAILY_CHallenge_TASKS to DAILY_CHALLENGE_TASKS.
                    DAILY_CHALLENGE_TASKS.forEach(task => completedTasksForDay.add(task.id));
                    mockCompleted[dateKey] = completedTasksForDay;
                }

                for (let i = 7; i <= 10; i++) {
                    const pastDate = new Date(today);
                    pastDate.setDate(today.getDate() - i);
                    const dateKey = pastDate.toISOString().split('T')[0];
                    const completedTasksForDay = new Set<string>();
                    // FIX: Corrected typo from DAILY_CHallenge_TASKS to DAILY_CHALLENGE_TASKS.
                    DAILY_CHALLENGE_TASKS.forEach(task => {
                        if (Math.random() > 0.5) {
                            completedTasksForDay.add(task.id);
                        }
                    });
                    mockCompleted[dateKey] = completedTasksForDay;
                }
                setCompletedTasks(mockCompleted);
            }

            if (userPhotos.length === 0) {
                const today = new Date();
                const dates = Array.from({ length: 5 }, (_, i) => {
                    const d = new Date(today);
                    d.setDate(today.getDate() - (i * 5));
                    return d.toISOString().split('T')[0];
                });

                const mockPhotos: UserPhoto[] = [
                    { id: 'p1', src: 'https://images.unsplash.com/photo-1549476464-373922117584?q=80&w=600&h=800&fit=crop&crop=faces&seed=front1', type: 'Front', date: dates[4], description: 'Starting point, feeling motivated.' },
                    { id: 'p2', src: 'https://images.unsplash.com/photo-1577221084712-45b044c6dbb6?q=80&w=600&h=800&fit=crop&crop=faces&seed=side1', type: 'Side', date: dates[4], description: 'Side view, first day.' },
                    { id: 'p3', src: 'https://images.unsplash.com/photo-1549476464-373922117584?q=80&w=600&h=800&fit=crop&crop=faces&seed=front2', type: 'Front', date: dates[2], description: '10 days in, seeing some changes.' },
                    { id: 'p4', src: 'https://images.unsplash.com/photo-1577221084712-45b044c6dbb6?q=80&w=600&h=800&fit=crop&crop=faces&seed=side2', type: 'Side', date: dates[2], description: 'Side view, posture is better.' },
                    { id: 'p5', src: 'https://images.unsplash.com/photo-1550345332-09e3ac987658?q=80&w=600&h=800&fit=crop&crop=faces&seed=back1', type: 'Back', date: dates[2], description: 'Back progress.' },
                    { id: 'p6', src: 'https://images.unsplash.com/photo-1549476464-373922117584?q=80&w=600&h=800&fit=crop&crop=faces&seed=front3', type: 'Front', date: dates[0], description: 'Today! Feeling great.' },
                    { id: 'p7', src: 'https://images.unsplash.com/photo-1577221084712-45b044c6dbb6?q=80&w=600&h=800&fit=crop&crop=faces&seed=side3', type: 'Side', date: dates[0], description: 'Final side view for comparison.' },
                ];
                setUserPhotos(mockPhotos.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
            }
        };

        if (currentUser) {
            initializeMockHistory();
        }
    }, [currentUser, completedTasks, userPhotos]);


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

        const conflictingMeasurement = userMeasurements.find(m => m.date === date && m.id !== editingMeasurement?.id);
        if (conflictingMeasurement) {
            addToast("A measurement entry for this date already exists. Please choose a different date or edit the existing entry.", 'error');
            return;
        }

        if (editingMeasurement && editingMeasurement.id) {
            const updatedMeasurement: UserMeasurement = { ...editingMeasurement, ...measurementData, date };
            setUserMeasurements(prev => prev.map(m => m.id === editingMeasurement.id ? updatedMeasurement : m)
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        } else {
            const newMeasurement: UserMeasurement = { id: Date.now().toString(), date, ...measurementData };
            setUserMeasurements(prev => [newMeasurement, ...prev]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        }
        
        const today = new Date();
        const todayKey = new Date(today.getTime() - (today.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
        if (data.date === todayKey) {
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
            // FIX: Changed `newCompleted` to `newChecked` to resolve a typo.
            return newChecked;
        });
    };
    
    const activePlan = NUTRITION_PLANS_DATA.find(p => p.isActive && !p.isTemplate);
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
        setCommunities(prev => prev.map(c => {
            if (c.id === communityId) {
                return {
                    ...c,
                    members: c.members.filter(m => m.id !== currentUser!.id)
                };
            }
            return c;
        }));
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
    };
    
    const handleUpdateCommunity = (communityId: number, updatedData: { name: string; description: string }) => {
        setCommunities(prev => prev.map(c => 
            c.id === communityId ? { ...c, ...updatedData } : c
        ));
    };

    const handleAddChannel = (communityId: number, channelName: string, channelType: ChannelType) => {
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
                return { ...c, channels: [...c.channels, newChannel] };
            }
            return c;
        }));
    };

    const handleUpdateChannel = (communityId: number, channelId: number, updatedData: { name: string; type: ChannelType }) => {
        setCommunities(prev => prev.map(c => {
            if (c.id === communityId) {
                const sanitizedName = updatedData.name.trim().toLowerCase().replace(/\s+/g, '-');
                if (c.channels.some(ch => ch.name === sanitizedName && ch.id !== channelId)) {
                    addToast('A channel with this name already exists.', 'error');
                    return c;
                }
                return { ...c, channels: c.channels.map(ch => ch.id === channelId ? { ...ch, name: sanitizedName, type: updatedData.type } : ch )};
            }
            return c;
        }));
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
        };
        setCommunities(prev => [newCommunity, ...prev]);
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
        const { date, tasks, completedDaily, completedWeekly } = sharingTasksData;

        const formatDate = (d: Date) => d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

        const dailyTasks = tasks.filter(t => t.frequency === 'daily');
        const weeklyTasks = tasks.filter(t => t.frequency === 'weekly');

        let description = `My Goals for ${formatDate(date)}\n\n`;

        if (dailyTasks.length > 0) {
            description += "Daily Tasks:\n";
            description += dailyTasks.map(t => `${completedDaily.has(t.id) ? '✅' : '🔲'} ${t.title}`).join('\n');
            description += "\n\n";
        }

        if (weeklyTasks.length > 0) {
            description += "Weekly Tasks:\n";
            description += weeklyTasks.map(t => `${completedWeekly.has(t.id) ? '✅' : '🔲'} ${t.title}`).join('\n');
        }
        
        const postData = {
            description: description.trim(),
            hashtags: ['#FitnessGoals', '#DailyTasks', '#FMFC'],
        };
        handleCreatePost(communityId, channelId, postData);
        handleCloseShareTasks();
    };

    // --- Photo Comparison Handlers ---
    const handleOpenComparePhotos = () => setIsComparingPhotos(true);
    const handleCloseComparePhotos = () => setIsComparingPhotos(false);
    
    const handleStartComparison = (data: { fromPhoto: UserPhoto; toPhoto: UserPhoto; description: string; }) => {
        setComparisonResultData(data);
        setIsComparingPhotos(false);
    };

    const handleCloseComparisonResult = () => setComparisonResultData(null);

    const handleOpenShareComparison = async (data: { fromPhoto: UserPhoto; toPhoto: UserPhoto; description: string }) => {
        addToast('Generating your comparison image...', 'info');
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            addToast('Could not generate image.', 'error');
            return;
        }

        const loadImage = (src: string): Promise<HTMLImageElement> => new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });

        try {
            const [img1, img2] = await Promise.all([loadImage(data.fromPhoto.src), loadImage(data.toPhoto.src)]);

            canvas.width = 1200;
            canvas.height = 900;

            ctx.fillStyle = '#18181b'; // zinc-900
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.drawImage(img1, 0, 0, 600, 800);
            ctx.drawImage(img2, 600, 0, 600, 800);

            ctx.fillStyle = 'white';
            ctx.font = 'bold 32px sans-serif';
            ctx.textAlign = 'center';

            ctx.fillText(`From: ${new Date(data.fromPhoto.date + 'T00:00:00').toLocaleDateString()}`, 300, 850);
            ctx.fillText(`To: ${new Date(data.toPhoto.date + 'T00:00:00').toLocaleDateString()}`, 900, 850);
            
            const compositeImage = canvas.toDataURL('image/jpeg', 0.9);

            setSharingComparisonData({
                image: compositeImage,
                description: data.description,
                hashtags: ['#Progress', '#Transformation', '#FMFC'],
            });
            setComparisonResultData(null);

        } catch (error) {
            console.error("Error creating comparison image:", error);
            addToast('Failed to load images for comparison.', 'error');
        }
    };

    const handleCloseShareComparison = () => setSharingComparisonData(null);

    const handleShareComparisonPost = (communityId: number, channelId: number) => {
        if (!sharingComparisonData) return;
        handleCreatePost(communityId, channelId, sharingComparisonData);
        handleCloseShareComparison();
    };


    const renderPage = () => {
        if (sharingTasksData) {
            return <ShareTasksPage
                currentUser={currentUser!}
                shareData={sharingTasksData}
                userCommunities={communities.filter(c => c.members.some(m => m.id === currentUser!.id))}
                onBack={handleCloseShareTasks}
                onShareToChannel={handleShareTasksPost}
            />;
        }

         if (sharingComparisonData) {
            return <ShareComparisonPage
                currentUser={currentUser!}
                shareData={sharingComparisonData}
                userCommunities={communities.filter(c => c.members.some(m => m.id === currentUser!.id))}
                onBack={handleCloseShareComparison}
                onShareToChannel={handleShareComparisonPost}
            />;
        }

        if (comparisonResultData) {
            return <ComparisonResultPage
                comparisonData={comparisonResultData}
                onBack={handleCloseComparisonResult}
                onShare={handleOpenShareComparison}
            />;
        }

        if (isComparingPhotos) {
            return <ComparePhotosPage
                userPhotos={userPhotos}
                onBack={handleCloseComparePhotos}
                onCompare={handleStartComparison}
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
                        />;
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
                            onComparePhotos={handleOpenComparePhotos}
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
                            leaderboardData={leaderboardData}
                            onShareAchievement={handleOpenShareAchievement}
                            onViewMyStats={handleViewMyStats}
                            onShareTasks={handleOpenShareTasks}
                        />;
            case 'Session':
            case 'Workouts':
                return <UnderDevelopmentPage pageName={activeTab} onMenuClick={toggleMenu} />;
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