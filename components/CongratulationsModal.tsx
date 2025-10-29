
import React from 'react';
import Icon from './Icon';
import { TASK_POINTS } from '../constants';

interface LeaderboardUser {
    userId: number;
    name: string;
    avatar: string;
    totalPoints: number;
    rank?: number;
}

interface CongratulationsModalProps {
    isOpen: boolean;
    onClose: () => void;
    pointsEarnedToday: number;
    currentUserData: LeaderboardUser;
    streak: number;
    leaderboardData: LeaderboardUser[];
    onViewLeaderboard: () => void;
    onShare: () => void;
}

const CongratulationsModal: React.FC<CongratulationsModalProps> = ({ 
    isOpen, 
    onClose, 
    pointsEarnedToday, 
    currentUserData,
    streak,
    leaderboardData,
    onViewLeaderboard,
    onShare,
}) => {
    if (!isOpen) return null;

    const topUsers = leaderboardData.slice(0, 3);
    const totalTasksCompleted = pointsEarnedToday / TASK_POINTS;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-zinc-900 border border-amber-400/50 rounded-2xl w-full max-w-sm text-center p-6 shadow-2xl shadow-amber-500/10" onClick={(e) => e.stopPropagation()}>
                <div className="text-amber-400 text-6xl mb-4 animate-pulse">
                    <Icon type="sparkles" className="w-20 h-20 mx-auto" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Congratulations!</h2>
                <p className="text-zinc-300 mb-6">You completed all your tasks for today.</p>

                <div className="bg-zinc-800 p-4 rounded-lg space-y-3 mb-6">
                    <div className="flex justify-between items-center text-md">
                        <span className="text-zinc-400">Tasks Completed:</span>
                        <span className="font-bold text-white">{totalTasksCompleted}</span>
                    </div>
                     <div className="flex justify-between items-center text-md">
                        <span className="text-zinc-400">Current Streak:</span>
                        <span className="font-bold text-white flex items-center space-x-1">
                             <Icon type="fire" className="w-5 h-5 text-red-500" />
                             <span>{streak} Day{streak !== 1 && 's'}</span>
                        </span>
                    </div>
                     <div className="flex justify-between items-center text-md">
                        <span className="text-zinc-400">Points Earned:</span>
                        <span className="font-bold text-amber-400">+{pointsEarnedToday}</span>
                    </div>
                </div>
                
                <div className="bg-zinc-800 p-4 rounded-lg mb-6">
                    <h4 className="font-bold text-zinc-200 mb-3">Top Performers</h4>
                    <ul className="space-y-2">
                        {topUsers.map((user, index) => (
                             <li key={user.userId} className="flex items-center text-left">
                                <span className="font-bold text-zinc-400 w-6">{index + 1}</span>
                                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full mx-2" />
                                <span className="text-zinc-300 flex-grow truncate">{user.name}</span>
                                <span className="font-semibold text-white">{user.totalPoints.toLocaleString()}</span>
                            </li>
                        ))}
                    </ul>
                     <button onClick={() => { onViewLeaderboard(); onClose(); }} className="text-xs font-semibold text-amber-400 hover:underline mt-3">
                        View Full Leaderboard
                    </button>
                </div>


                <div className="flex flex-col space-y-3">
                    <button
                        onClick={onShare}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-200"
                    >
                        Share Achievement
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full bg-zinc-700 hover:bg-zinc-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-200 text-sm"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CongratulationsModal;
