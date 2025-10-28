
import React from 'react';
import Icon from './Icon';

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
}

const CongratulationsModal: React.FC<CongratulationsModalProps> = ({ isOpen, onClose, pointsEarnedToday, currentUserData }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-zinc-900 border border-amber-400/50 rounded-2xl w-full max-w-sm text-center p-8 shadow-2xl shadow-amber-500/10" onClick={(e) => e.stopPropagation()}>
                <div className="text-amber-400 text-6xl mb-4 animate-pulse">
                    <Icon type="sparkles" className="w-20 h-20 mx-auto" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Congratulations!</h2>
                <p className="text-zinc-300 mb-6">You completed all your tasks for today.</p>

                <div className="bg-zinc-800 p-4 rounded-lg space-y-3">
                    <div className="flex justify-between items-center text-lg">
                        <span className="text-zinc-400">Points Earned:</span>
                        <span className="font-bold text-amber-400">+{pointsEarnedToday} PTS</span>
                    </div>
                     <div className="flex justify-between items-center text-lg">
                        <span className="text-zinc-400">New Total:</span>
                        <span className="font-bold text-white">{currentUserData.totalPoints.toLocaleString()} PTS</span>
                    </div>
                    <div className="flex justify-between items-center text-lg">
                        <span className="text-zinc-400">Your Rank:</span>
                        <span className="font-bold text-white">#{currentUserData.rank}</span>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="mt-6 w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-200"
                >
                    Keep Going!
                </button>
            </div>
        </div>
    );
};

export default CongratulationsModal;
