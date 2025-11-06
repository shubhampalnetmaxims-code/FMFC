import React from 'react';
import Icon from '../components/Icon';
import { SharedGoal, ChallengeTask } from '../types';

interface SharedGoalDetailsPageProps {
    sharedGoal: SharedGoal;
    communityName: string;
    onBack: () => void;
    onCopyTasks: () => void;
}

const SharedGoalDetailsPage: React.FC<SharedGoalDetailsPageProps> = ({ sharedGoal, communityName, onBack, onCopyTasks }) => {
    
    const formatDate = (dateString: string) => {
        return new Date(dateString + 'T00:00:00').toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const GoalItem: React.FC<{task: ChallengeTask, isCompleted: boolean}> = ({ task, isCompleted }) => (
        <div className="flex items-center p-3 bg-zinc-800/50 rounded-lg">
            <span className="mr-3">{isCompleted ? '✅' : '🔲'}</span>
            <span className={`flex-grow ${isCompleted ? 'line-through text-zinc-500' : 'text-zinc-300'}`}>
                {task.title}
            </span>
        </div>
    );

    const dailyTasks = sharedGoal.tasks.filter(t => t.frequency === 'daily');
    const weeklyTasks = sharedGoal.tasks.filter(t => t.frequency === 'weekly');

    return (
        <div className="h-full flex flex-col bg-zinc-950 text-zinc-200">
            <header className="sticky top-0 bg-zinc-950/80 backdrop-blur-sm z-10 p-4 flex items-center">
                <button onClick={onBack} className="mr-4 text-zinc-400 hover:text-zinc-200">
                    <Icon type="arrow-left" />
                </button>
                <div>
                    <h1 className="text-xl font-bold text-white">Shared Goal</h1>
                    <p className="text-xs text-zinc-400">from {communityName}</p>
                </div>
            </header>

            <main className="flex-grow overflow-y-auto p-4 space-y-4">
                <div className="flex items-center space-x-3 bg-zinc-900 p-4 rounded-lg border border-zinc-800">
                    <img src={sharedGoal.user.avatar} alt={sharedGoal.user.name} className="w-12 h-12 rounded-full object-cover" />
                    <div>
                        <p className="font-bold text-zinc-100">{sharedGoal.user.name}'s Goals</p>
                        <p className="text-sm text-zinc-400">{formatDate(sharedGoal.date)}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {dailyTasks.length > 0 && (
                        <div>
                            <h3 className="font-semibold text-zinc-300 mb-2 px-1">Daily Tasks</h3>
                            <div className="space-y-2">
                                {dailyTasks.map(task => (
                                    <GoalItem key={task.id} task={task} isCompleted={sharedGoal.completedDaily.has(task.id)} />
                                ))}
                            </div>
                        </div>
                    )}
                    {weeklyTasks.length > 0 && (
                        <div>
                            <h3 className="font-semibold text-zinc-300 mb-2 px-1">Weekly Tasks for the Day</h3>
                            <div className="space-y-2">
                                {weeklyTasks.map(task => (
                                    <GoalItem key={task.id} task={task} isCompleted={sharedGoal.completedWeekly.has(task.id)} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <footer className="p-4 border-t border-zinc-800 sticky bottom-0 bg-zinc-950">
                <button
                    onClick={onCopyTasks}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                    <Icon type="plus" className="w-5 h-5" />
                    <span>Copy Tasks for Today</span>
                </button>
            </footer>
        </div>
    );
};

export default SharedGoalDetailsPage;
