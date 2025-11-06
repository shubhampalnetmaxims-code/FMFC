import React from 'react';
import type { SharedGoal } from '../types';
import Icon from './Icon';

interface SharedGoalsPaneProps {
    goals: SharedGoal[];
    onView: (goal: SharedGoal) => void;
}

const SharedGoalsPane: React.FC<SharedGoalsPaneProps> = ({ goals, onView }) => {
    if (!goals || goals.length === 0) {
        return (
            <div className="text-center py-16 text-zinc-500">
                <p>No goals have been shared in this community yet.</p>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString + 'T00:00:00').toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };
    
    return (
        <div className="p-4 space-y-4">
            {goals.map(goal => {
                const completedCount = goal.completedDaily.size + goal.completedWeekly.size;
                const totalCount = goal.tasks.length;
                return (
                    <div key={goal.id} className="bg-zinc-900 p-4 rounded-xl shadow-md border border-zinc-800">
                        <div className="flex items-center space-x-3 mb-3">
                            <img src={goal.user.avatar} alt={goal.user.name} className="w-10 h-10 rounded-full object-cover"/>
                            <div>
                                <p className="font-semibold text-zinc-200">{goal.user.name}</p>
                                <p className="text-xs text-zinc-400">shared goals for {formatDate(goal.date)}</p>
                            </div>
                        </div>
                        <div className="border-t border-zinc-800 pt-3 flex justify-between items-center">
                            <div className="text-sm font-semibold">
                                <span className="text-amber-400">{completedCount}</span>
                                <span className="text-zinc-500"> / {totalCount} tasks completed</span>
                            </div>
                            <button 
                                onClick={() => onView(goal)}
                                className="text-sm font-semibold bg-zinc-700 text-white px-4 py-2 rounded-full hover:bg-zinc-600 transition-colors"
                            >
                                View Details
                            </button>
                        </div>
                    </div>
                )
            })}
        </div>
    );
};

export default SharedGoalsPane;