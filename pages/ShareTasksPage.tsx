
import React from 'react';
import Icon from '../components/Icon';
import { User, Community, ChallengeTask } from '../types';

interface ShareTasksPageProps {
    currentUser: User;
    shareData: {
        date: Date;
        tasks: ChallengeTask[];
        completedDaily: Set<string>;
        completedWeekly: Set<string>;
    };
    userCommunities: Community[];
    onBack: () => void;
    onShareToChannel: (communityId: number, channelId: number) => void;
}

const ShareTasksPage: React.FC<ShareTasksPageProps> = ({ currentUser, shareData, userCommunities, onBack, onShareToChannel }) => {

    const formatDate = (d: Date) => d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    const TasksPreview = () => {
        const dailyTasks = shareData.tasks.filter(t => t.frequency === 'daily');
        const weeklyTasks = shareData.tasks.filter(t => t.frequency === 'weekly');

        return (
            <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-3 mb-4">
                    <img src={currentUser.avatar} alt={currentUser.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                        <p className="font-semibold text-white">{currentUser.name}</p>
                        <p className="text-sm text-zinc-400">is sharing their goals for today!</p>
                    </div>
                </div>

                <div className="border-t border-zinc-700/50 pt-4">
                    <h4 className="font-bold text-amber-300 mb-2">My Goals for {formatDate(shareData.date)}</h4>
                    <div className="space-y-2 text-sm">
                         {dailyTasks.length > 0 && (
                            <div>
                                <p className="text-zinc-400 font-semibold mb-1">Daily Tasks:</p>
                                <ul className="space-y-1">
                                {dailyTasks.map(task => (
                                    <li key={task.id} className="flex items-center">
                                        <span className="mr-2">{shareData.completedDaily.has(task.id) ? '✅' : '🔲'}</span>
                                        <span className={`${shareData.completedDaily.has(task.id) ? 'line-through text-zinc-500' : 'text-zinc-300'}`}>{task.title}</span>
                                    </li>
                                ))}
                                </ul>
                            </div>
                        )}
                         {weeklyTasks.length > 0 && (
                             <div className="mt-3">
                                <p className="text-zinc-400 font-semibold mb-1">Weekly Tasks:</p>
                                <ul className="space-y-1">
                                {weeklyTasks.map(task => (
                                    <li key={task.id} className="flex items-center">
                                        <span className="mr-2">{shareData.completedWeekly.has(task.id) ? '✅' : '🔲'}</span>
                                         <span className={`${shareData.completedWeekly.has(task.id) ? 'line-through text-zinc-500' : 'text-zinc-300'}`}>{task.title}</span>
                                    </li>
                                ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="w-full h-full flex flex-col bg-zinc-950 text-zinc-200">
            <header className="flex items-center p-4 shrink-0 border-b border-zinc-800 sticky top-0 bg-zinc-950/80 backdrop-blur-sm z-10">
                <button onClick={onBack} className="p-2 -ml-2 mr-2 text-zinc-400 hover:text-zinc-200">
                    <Icon type="arrow-left" className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold">Share Goals</h1>
            </header>
            <main className="flex-grow overflow-y-auto p-4">
                <TasksPreview />
                <h3 className="text-sm font-semibold text-zinc-400 mb-2">Share to a channel...</h3>
                <div className="space-y-3">
                    {userCommunities.length > 0 ? userCommunities.map(community => (
                        <div key={community.id}>
                            <p className="font-semibold text-zinc-200 text-sm px-2 mb-1">{community.name}</p>
                            <ul className="space-y-1">
                                {community.channels
                                    .filter(ch => ch.type === 'posts' || ch.type === 'chat')
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
                    )) : (
                        <div className="text-center py-8 text-zinc-500 bg-zinc-900 rounded-lg">
                            <p>You are not a member of any communities.</p>
                            <p className="text-sm mt-1">Join a community to share your goals!</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ShareTasksPage;
