
import React from 'react';
import Icon from '../components/Icon';
import { User, Community } from '../types';

interface ShareAchievementPageProps {
    currentUser: User;
    achievementData: {
        streak: number;
        pointsEarned: number;
        description: string;
        hashtags: string[];
    };
    userCommunities: Community[];
    onBack: () => void;
    onShareToChannel: (communityId: number, channelId: number) => void;
}

const ShareAchievementPage: React.FC<ShareAchievementPageProps> = ({ currentUser, achievementData, userCommunities, onBack, onShareToChannel }) => {

    const AchievementPreview = () => (
        <div className="bg-zinc-800 border border-amber-400/30 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3 mb-4">
                <img src={currentUser.avatar} alt={currentUser.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                    <p className="font-bold text-white">{currentUser.name}</p>
                    <p className="text-sm text-zinc-400">just completed all daily tasks!</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center mb-4">
                <div className="bg-zinc-700/50 p-3 rounded-lg">
                    <p className="text-2xl font-bold text-amber-400">{achievementData.streak} <span className="text-base">day</span></p>
                    <p className="text-xs text-zinc-400">STREAK</p>
                </div>
                <div className="bg-zinc-700/50 p-3 rounded-lg">
                    <p className="text-2xl font-bold text-amber-400">+{achievementData.pointsEarned}</p>
                    <p className="text-xs text-zinc-400">POINTS</p>
                </div>
            </div>

            <div className="border-t border-zinc-700/50 pt-4">
                <p className="text-zinc-300 text-sm">{achievementData.description}</p>
                <div className="flex flex-wrap gap-x-2 mt-2">
                    {achievementData.hashtags.map((tag, index) => (
                        <span key={index} className="text-amber-400 text-sm font-semibold">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="w-full max-w-lg mx-auto h-full flex flex-col bg-zinc-950 text-zinc-200">
            <header className="flex items-center p-4 shrink-0 border-b border-zinc-800 sticky top-0 bg-zinc-950/80 backdrop-blur-sm z-10">
                <button onClick={onBack} className="p-2 -ml-2 mr-2 text-zinc-400 hover:text-zinc-200">
                    <Icon type="arrow-left" className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold">Share Achievement</h1>
            </header>
            <main className="flex-grow overflow-y-auto p-4">
                <AchievementPreview />
                <h3 className="text-sm font-semibold text-zinc-400 mb-2">Share to a channel...</h3>
                <div className="space-y-3">
                    {userCommunities.map(community => (
                        <div key={community.id}>
                            <p className="font-semibold text-zinc-200 text-sm px-2 mb-1">{community.name}</p>
                            <ul className="space-y-1">
                                {community.channels
                                    .filter(ch => ch.type === 'posts' || (ch.type === 'admin-only' && community.adminId === currentUser.id))
                                    .map(channel => (
                                        <li key={channel.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-800/50">
                                            <div className="flex items-center space-x-2">
                                                <Icon type="hash" className="w-4 h-4 text-zinc-500" />
                                                <span className="text-zinc-300">{channel.name}</span>
                                            </div>
                                            <button
                                                onClick={() => onShareToChannel(community.id, channel.id)}
                                                className="text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-black px-3 py-1 rounded-md transition-colors"
                                            >
                                                Share
                                            </button>
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default ShareAchievementPage;