
import React from 'react';
import Icon from './Icon';

interface LeaderboardUser {
    userId: number;
    name: string;
    avatar: string;
    totalPoints: number;
}

interface LeaderboardModalProps {
    isOpen: boolean;
    onClose: () => void;
    leaderboardData: LeaderboardUser[];
    currentUserId: number;
}

const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ isOpen, onClose, leaderboardData, currentUserId }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                <header className="flex items-center justify-between p-4 border-b border-zinc-800 sticky top-0 bg-zinc-900">
                    <div className="flex items-center space-x-3">
                        <Icon type="users" className="w-6 h-6 text-amber-400"/>
                        <h2 className="text-xl font-bold text-white">Leaderboard</h2>
                    </div>
                    <button onClick={onClose} className="text-zinc-400 hover:text-white text-2xl leading-none">&times;</button>
                </header>
                <main className="flex-grow overflow-y-auto">
                    <ul className="divide-y divide-zinc-800">
                        {leaderboardData.map((user, index) => {
                            const isCurrentUser = user.userId === currentUserId;
                            const rank = index + 1;
                            return (
                                <li key={user.userId} className={`flex items-center p-4 transition-colors ${isCurrentUser ? 'bg-amber-400/10' : ''}`}>
                                    <div className="flex items-center space-x-4">
                                        <span className={`text-lg font-bold w-6 text-center ${rank <= 3 ? 'text-amber-400' : 'text-zinc-400'}`}>
                                            {rank}
                                        </span>
                                        <img src={user.avatar} alt={user.name} className={`w-12 h-12 rounded-full object-cover ${isCurrentUser ? 'border-2 border-amber-400' : ''}`} />
                                    </div>
                                    <div className="ml-4 flex-grow">
                                        <p className={`font-semibold ${isCurrentUser ? 'text-amber-300' : 'text-zinc-200'}`}>{user.name}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-lg text-white">{user.totalPoints.toLocaleString()}</p>
                                        <p className="text-xs text-zinc-500">PTS</p>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </main>
            </div>
        </div>
    );
};

export default LeaderboardModal;
