import React from 'react';
import Icon from '../components/Icon';
import { User, Community, NutritionPlan } from '../types';

interface ShareNutritionPlanPageProps {
    currentUser: User;
    planData: NutritionPlan;
    userCommunities: Community[];
    onBack: () => void;
    onShareToChannel: (communityId: number, channelId: number) => void;
}

const ShareNutritionPlanPage: React.FC<ShareNutritionPlanPageProps> = ({ currentUser, planData, userCommunities, onBack, onShareToChannel }) => {

    const PlanPreview = () => (
        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3 mb-4">
                <img src={currentUser.avatar} alt={currentUser.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                    <p className="font-semibold text-white">{currentUser.name}</p>
                    <p className="text-sm text-zinc-400">is sharing a nutrition plan</p>
                </div>
            </div>

            <div className="border-t border-zinc-700 pt-4">
                <h4 className="font-bold text-amber-300">{planData.name}</h4>
                <p className="text-sm text-zinc-400 mt-1">{planData.description}</p>
                <div className="mt-3 text-xs grid grid-cols-2 gap-2 text-zinc-500">
                    <span>Energy: <span className="font-semibold text-zinc-300">{planData.totals.energy} Cal</span></span>
                    <span>Protein: <span className="font-semibold text-zinc-300">{planData.totals.proteins} g</span></span>
                    <span>Carbs: <span className="font-semibold text-zinc-300">{planData.totals.carbohydrates} g</span></span>
                    <span>Fats: <span className="font-semibold text-zinc-300">{planData.totals.fats} g</span></span>
                </div>
            </div>
        </div>
    );

    return (
        <div className="w-full h-full flex flex-col bg-zinc-950 text-zinc-200">
            <header className="flex items-center p-4 shrink-0 border-b border-zinc-800 sticky top-0 bg-zinc-950/80 backdrop-blur-sm z-10">
                <button onClick={onBack} className="p-2 -ml-2 mr-2 text-zinc-400 hover:text-zinc-200">
                    <Icon type="arrow-left" className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold">Share Nutrition Plan</h1>
            </header>
            <main className="flex-grow overflow-y-auto p-4">
                <PlanPreview />
                <h3 className="text-sm font-semibold text-zinc-400 mb-2">Share to a channel...</h3>
                <div className="space-y-3">
                    {userCommunities.map(community => (
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
                    ))}
                </div>
            </main>
        </div>
    );
};

export default ShareNutritionPlanPage;
