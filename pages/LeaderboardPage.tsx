
import React from 'react';
import Icon from '../components/Icon';

interface LeaderboardUser {
    userId: number;
    name: string;
    avatar: string;
    totalPoints: number;
}

interface LeaderboardPageProps {
    onBack: () => void;
    leaderboardData: LeaderboardUser[];
    currentUserId: number;
}

const LeaderboardPage: React.FC<LeaderboardPageProps> = ({ onBack, leaderboardData, currentUserId }) => {
    return (
        <div className="h-full flex flex-col bg-zinc-950">
            <header className="sticky top-0 bg-zinc-950/80 backdrop-blur-sm z-10 p-4 flex items-center">
                 <button onClick={onBack} className="mr-4 text-zinc-400 hover:text-zinc-200">
                    <Icon type="arrow-left" />
                </button>
                <div className="flex items-center space-x-3">
                    <Icon type="sparkles" className="w-6 h-6 text-amber-400"/>
                    <h1 className="text-xl font-bold text-white">Leaderboard</h1>
                </div>
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
    );
};

export default LeaderboardPage;
