

import React from 'react';
import Icon from '../components/Icon';
import { User, ChallengeTask } from '../types';
import { DAILY_CHALLENGE_TASKS, WEEKLY_CHALLENGE_TASKS } from '../constants';

interface MyStatsPageProps {
    currentUser: User;
    totalPoints: number;
    streak: number;
    completedTasks: Record<string, Set<string>>;
    onBack: () => void;
    onShare: () => void;
}

const allTasks: ChallengeTask[] = [...DAILY_CHALLENGE_TASKS, ...WEEKLY_CHALLENGE_TASKS];
const taskMap = new Map(allTasks.map(task => [task.id, task.title]));

const MyStatsPage: React.FC<MyStatsPageProps> = ({ currentUser, totalPoints, streak, completedTasks, onBack, onShare }) => {

    // FIX: Correctly type the result of Object.values() to resolve an error in the reduce function.
    const taskSets = Object.values(completedTasks) as Set<string>[];
    const totalTasksCompleted = taskSets.reduce((acc, tasks) => acc + tasks.size, 0);

    const sortedDates = Object.keys(completedTasks).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    const formatDate = (dateString: string) => {
        return new Date(dateString + 'T00:00:00').toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="h-full flex flex-col bg-zinc-950 text-zinc-200">
            <header className="sticky top-0 bg-zinc-950/80 backdrop-blur-sm z-10 flex items-center p-4">
                <button onClick={onBack} className="mr-4 text-zinc-400 hover:text-zinc-200">
                    <Icon type="arrow-left" />
                </button>
                <h1 className="text-xl font-bold text-white">My Stats</h1>
            </header>

            <main className="flex-grow overflow-y-auto p-4 space-y-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-zinc-800 p-4 rounded-lg">
                        <p className="text-2xl font-bold text-amber-400">{totalPoints.toLocaleString()}</p>
                        <p className="text-xs text-zinc-400 mt-1">Total Points</p>
                    </div>
                     <div className="bg-zinc-800 p-4 rounded-lg">
                        <p className="text-2xl font-bold text-amber-400 flex items-center justify-center space-x-1">
                            <Icon type="fire" className="w-6 h-6 text-red-500" />
                            <span>{streak}</span>
                        </p>
                        <p className="text-xs text-zinc-400 mt-1">Day Streak</p>
                    </div>
                     <div className="bg-zinc-800 p-4 rounded-lg">
                        <p className="text-2xl font-bold text-amber-400">{totalTasksCompleted}</p>
                        <p className="text-xs text-zinc-400 mt-1">Tasks Done</p>
                    </div>
                </div>
                
                <div>
                    <h2 className="text-lg font-bold text-zinc-100 mb-3 px-2">Task History</h2>
                    <div className="space-y-4">
                        {sortedDates.length > 0 ? sortedDates.map(dateKey => (
                            <div key={dateKey} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                                <h3 className="font-semibold text-amber-300 mb-2">{formatDate(dateKey)}</h3>
                                <ul className="space-y-1">
                                    {[...(completedTasks[dateKey] || [])].map(taskId => (
                                        <li key={taskId} className="flex items-center space-x-2 text-sm text-zinc-300">
                                            <Icon type="check" className="w-4 h-4 text-green-500" />
                                            <span>{taskMap.get(taskId) || taskId}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )) : (
                             <div className="text-center py-16 text-zinc-500 bg-zinc-900 rounded-lg">
                                <p>No completed tasks yet.</p>
                                <p className="text-sm">Complete tasks on the 'Goals' tab to see your history!</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

             <footer className="p-4 border-t border-zinc-800 sticky bottom-0 bg-zinc-950">
                <button
                    onClick={onShare}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                    <Icon type="share" className="w-5 h-5" />
                    <span>Share My Progress</span>
                </button>
            </footer>
        </div>
    );
};

export default MyStatsPage;
