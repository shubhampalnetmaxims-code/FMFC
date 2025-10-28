

import React, { useState, useMemo, useEffect } from 'react';
import Icon from '../components/Icon';
import { DAILY_CHALLENGE_TASKS, WEEKLY_CHALLENGE_TASKS, TEST_USER, TASK_POINTS } from '../constants';
import { ChallengeTask } from '../types';
import CongratulationsModal from '../components/CongratulationsModal';

interface GoalsPageProps {
    onMenuClick: () => void;
    completedTasks: Record<string, Set<string>>;
    onToggleManualTask: (taskId: string, date: Date) => void;
    completedWeeklyTasks: Record<string, Set<string>>;
    onToggleWeeklyTask: (taskId: string, date: Date) => void;
    onViewLeaderboard: () => void;
    currentUserTotalPoints: number;
    currentUserRank: number;
}

const GoalItem: React.FC<{
    task: ChallengeTask;
    isChecked: boolean;
    onToggle: () => void;
    isLocked: boolean;
}> = ({ task, isChecked, onToggle, isLocked }) => {
    const isAuto = task.type === 'auto';
    const isDisabled = isLocked || isAuto;

    const categoryIcons: Record<ChallengeTask['category'], any> = {
        Nutrition: 'fire',
        Activity: 'workouts',
        Mindfulness: 'note',
        Progress: 'bolt',
    };
    const categoryColors: Record<ChallengeTask['category'], string> = {
        Nutrition: 'text-red-400',
        Activity: 'text-sky-400',
        Mindfulness: 'text-purple-400',
        Progress: 'text-green-400',
    };

    return (
        <div className={`flex items-center p-4 transition-colors ${isChecked ? 'bg-zinc-800/50' : ''}`}>
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4 bg-zinc-700/50 ${categoryColors[task.category]}`}>
                <Icon type={categoryIcons[task.category]} className="w-5 h-5" />
            </div>
            <div className="flex-grow">
                <p className={`font-semibold ${isChecked ? 'text-zinc-500 line-through' : 'text-zinc-200'}`}>{task.title}</p>
                 <div className="flex items-center space-x-2 text-xs text-zinc-400">
                    {task.frequency === 'daily' ? (
                        <div className="flex items-center space-x-1">
                            <Icon type="refresh" className="w-3 h-3" />
                            <span>Daily</span>
                        </div>
                    ) : (
                        <span>Repeats {task.repeatDays?.join(', ')}</span>
                    )}
                    {isAuto && <span>· Auto</span>}
                </div>
            </div>
            <div className="text-right">
                <span className={`font-bold text-lg ${isChecked ? 'text-amber-600' : 'text-amber-400'}`}>
                    {TASK_POINTS}
                </span>
                <span className={`text-xs ${isChecked ? 'text-amber-700' : 'text-amber-500'}`}> pts</span>
            </div>
            <label className={`ml-4 ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={onToggle}
                    disabled={isDisabled}
                    className="sr-only"
                />
                 <div className={`relative flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all ${
                    isChecked 
                        ? 'bg-amber-400 border-amber-400' 
                        : isDisabled ? 'bg-zinc-800 border-zinc-700' : 'border-zinc-500'
                }`}>
                    <Icon type="check" className={`w-4 h-4 text-black transition-opacity ${isChecked ? 'opacity-100' : 'opacity-0'}`} />
                </div>
            </label>
        </div>
    );
};

const GoalsPage: React.FC<GoalsPageProps> = ({ onMenuClick, completedTasks, onToggleManualTask, completedWeeklyTasks, onToggleWeeklyTask, onViewLeaderboard, currentUserTotalPoints, currentUserRank }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [showCongratsModal, setShowCongratsModal] = useState(false);
    const [congratsShownForDate, setCongratsShownForDate] = useState<string | null>(null);

    const isDateInPast = (date: Date): boolean => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    };

    const getWeekKey = (d: Date): string => {
        const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
        const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
        const weekNo = Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
        return `${date.getUTCFullYear()}-${weekNo}`;
    };

    const handlePrevDay = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() - 1);
        setCurrentDate(newDate);
    };

    const handleNextDay = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + 1);
        setCurrentDate(newDate);
    };

    const formatDate = (date: Date) => {
        const today = new Date();
        if (date.toDateString() === today.toDateString()) return "Today";
        
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
        
        return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    };

    const dayOfWeekShort = currentDate.toLocaleDateString('en-US', { weekday: 'short' }); // Mon, Tue, etc.
    const weeklyTasksForToday = WEEKLY_CHALLENGE_TASKS.filter(task => task.repeatDays?.includes(dayOfWeekShort));
    const tasksForToday = [...DAILY_CHALLENGE_TASKS, ...weeklyTasksForToday];

    const dateKey = currentDate.toISOString().split('T')[0];
    const weekKey = getWeekKey(currentDate);
    const dailyCompletions = completedTasks[dateKey] || new Set();
    const weeklyCompletions = completedWeeklyTasks[weekKey] || new Set();

    const completedPoints = tasksForToday.reduce((total, task) => {
        const isCompleted = task.frequency === 'daily'
            ? dailyCompletions.has(task.id)
            : weeklyCompletions.has(task.id);
        return isCompleted ? total + TASK_POINTS : total;
    }, 0);
    
    const totalPossiblePoints = tasksForToday.length * TASK_POINTS;
    const isLocked = isDateInPast(currentDate);

     useEffect(() => {
        if (totalPossiblePoints > 0 && completedPoints === totalPossiblePoints && congratsShownForDate !== dateKey) {
            setShowCongratsModal(true);
            setCongratsShownForDate(dateKey);
        }
    }, [completedPoints, totalPossiblePoints, dateKey, congratsShownForDate]);

    return (
        <>
            <CongratulationsModal
                isOpen={showCongratsModal}
                onClose={() => setShowCongratsModal(false)}
                pointsEarnedToday={totalPossiblePoints}
                currentUserData={{
                    ...TEST_USER,
                    userId: TEST_USER.id,
                    totalPoints: currentUserTotalPoints,
                    rank: currentUserRank
                }}
            />
            <div className="h-full flex flex-col">
                <header className="sticky top-0 bg-zinc-950/80 backdrop-blur-sm z-10 p-4 shrink-0">
                    <div className="flex justify-between items-center">
                        <div className="w-8">
                            <button onClick={onMenuClick} className="text-zinc-400 hover:text-zinc-200">
                                <Icon type="menu" className="w-6 h-6" />
                            </button>
                        </div>
                        <h1 className="text-xl font-bold text-zinc-100 uppercase tracking-wider">Goals</h1>
                        <div className="flex items-center space-x-2">
                             <button onClick={onViewLeaderboard} className="relative text-zinc-400 hover:text-zinc-200">
                                <Icon type="sparkles" className="w-6 h-6" />
                            </button>
                            <button className="relative text-zinc-400 hover:text-zinc-200">
                                <Icon type="bell" className="w-6 h-6" />
                                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-zinc-950"></span>
                            </button>
                        </div>
                    </div>
                </header>
                
                <main className="flex-grow overflow-y-auto p-4 space-y-6">
                    <div className="flex items-center justify-center space-x-4">
                        <button onClick={handlePrevDay} className="p-2 rounded-full hover:bg-zinc-800 transition-colors" aria-label="Previous day">
                            <Icon type="arrow-left" className="w-5 h-5 text-zinc-400"/>
                        </button>
                        <div className="text-lg font-semibold text-amber-400 text-center min-w-[200px]">
                            {formatDate(currentDate)}
                        </div>
                        <button onClick={handleNextDay} className="p-2 rounded-full hover:bg-zinc-800 transition-colors" aria-label="Next day">
                            <Icon type="arrow-right" className="w-5 h-5 text-zinc-400"/>
                        </button>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                        <div className="p-4 border-b border-zinc-800">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-bold text-zinc-100">Today's Tasks</h2>
                                <div className="text-lg font-bold text-amber-300 bg-amber-400/10 px-3 py-1 rounded-full">
                                    {completedPoints} / {totalPossiblePoints} pts
                                </div>
                            </div>
                        </div>
                        <div className="divide-y divide-zinc-800">
                            {tasksForToday.length > 0 ? (
                                tasksForToday.map(task => {
                                    const isCompleted = task.frequency === 'daily'
                                        ? dailyCompletions.has(task.id)
                                        : weeklyCompletions.has(task.id);
                                    
                                    const onToggle = task.frequency === 'daily'
                                        ? () => onToggleManualTask(task.id, currentDate)
                                        : () => onToggleWeeklyTask(task.id, currentDate);

                                    return (
                                        <GoalItem
                                            key={task.id}
                                            task={task}
                                            isChecked={isCompleted}
                                            onToggle={onToggle}
                                            isLocked={isLocked}
                                        />
                                    );
                                })
                            ) : (
                                <div className="p-8 text-center text-zinc-500">
                                    <p>No specific goals for today.</p>
                                    <p className="text-sm mt-1">Enjoy your rest day!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};

export default GoalsPage;