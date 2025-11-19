
import React, { useState, useEffect } from 'react';
import PostCard from '../components/PostCard';
import { USERS_DATA } from '../constants';
import type { User, Community, Post, ChatMessage, Channel, ChannelType, NutritionPlan, SharedGoal, Workout } from '../types';
import CommunityCard from '../components/CommunityCard';
import CommunityHubPage, { CommunityHubFilterType } from './CommunityHubPage';
import ChannelContentPage from './ChannelContentPage';
import PremiumModal from '../components/PremiumModal';
import CreateCommunityPage from './CreateCommunityPage';
import AddMembersPage from './AddMembersPage';
import Icon from '../components/Icon';

type SubTab = 'All Feed' | 'My Community' | 'Create Own Community';

interface CommunityPageProps {
    currentUser: User;
    onMenuClick: () => void;
    communities: Community[];
    selectedCommunityId: number | null;
    selectedChannelId: number | null;
    hubActiveFilter: CommunityHubFilterType;
    isAddingMembers: boolean;
    onSelectCommunity: (id: number) => void;
    onSelectChannel: (id: number) => void;
    onBackToCommunityHub: () => void;
    onBackToCommunityList: () => void;
    onLeaveCommunity: (communityId: number) => void;
    onCreatePost: (communityId: number, channelId: number, postData: Omit<Post, 'id' | 'user' | 'communityId' | 'channelId' | 'likes' | 'commentCount' | 'comments'>) => void;
    onAddOrUpdateChatMessage: (communityId: number, newMsgData: Partial<ChatMessage> & { text: string; }) => void;
    onUpdateCommunity: (communityId: number, updatedData: { name: string; description: string; }) => void;
    onAddChannel: (communityId: number, channelName: string, channelType: ChannelType) => void;
    onUpdateChannel: (communityId: number, channelId: number, updatedData: { name: string; type: ChannelType; }) => void;
    onAddMembers: () => void;
    onSetIsAddingMembers: (isAdding: boolean) => void;
    onSetHubActiveFilter: (filter: CommunityHubFilterType) => void;
    onCreateCommunity: (data: { name: string; description: string; isPrivate: boolean; }) => void;
    onToggleNotifications: () => void;
    hasUnreadNotifications: boolean;
    onCopyPlan: (plan: NutritionPlan) => void;
    onViewSharedItem: (item: NutritionPlan | SharedGoal, type: 'nutrition' | 'goal', communityName: string) => void;
    onViewWorkout: (workout: Workout, isMine?: boolean) => void;
}

const CommunityPage: React.FC<CommunityPageProps> = (props) => {
    const {
        currentUser, onMenuClick, communities, selectedCommunityId, selectedChannelId,
        hubActiveFilter, isAddingMembers, onSelectCommunity, onSelectChannel,
        onBackToCommunityHub, onBackToCommunityList, onLeaveCommunity, onCreatePost,
        onAddOrUpdateChatMessage, onUpdateCommunity, onAddChannel, onUpdateChannel, onAddMembers,
        onSetIsAddingMembers, onSetHubActiveFilter, onCreateCommunity, onToggleNotifications, hasUnreadNotifications,
        onCopyPlan, onViewSharedItem, onViewWorkout
    } = props;

    const [activeSubTab, setActiveSubTab] = useState<SubTab>('All Feed');
    
    const [hasPremium, setHasPremium] = useState(false);
    const [showPremiumModal, setShowPremiumModal] = useState(false);
    const [isLoadingPurchase, setIsLoadingPurchase] = useState(false);

    // Effect to switch tab when a community is selected (e.g., from notification badge)
    useEffect(() => {
        if (selectedCommunityId) {
            setActiveSubTab('My Community');
        }
    }, [selectedCommunityId]);

    const userCommunities = communities.filter(c => c.members.some(m => m.id === currentUser.id));

    const handleBuyPremium = () => {
        setShowPremiumModal(false);
        setIsLoadingPurchase(true);
        setTimeout(() => {
            setIsLoadingPurchase(false);
            setHasPremium(true);
        }, 5000);
    };

    const handleCreateCommunityAndSwitch = (data: { name: string; description: string; isPrivate: boolean; }) => {
        onCreateCommunity(data);
        setActiveSubTab('My Community');
        onBackToCommunityList();
    }


    const renderMyCommunityContent = () => {
        const community = communities.find(c => c.id === selectedCommunityId);

        if (!selectedCommunityId || !community) {
            return (
                <div className="p-4 space-y-4">
                    <h2 className="text-lg font-semibold text-zinc-300 px-2">Your Communities</h2>
                    {userCommunities.length > 0 ? userCommunities.map(community => (
                        <CommunityCard
                            key={community.id}
                            community={community}
                            onSelect={() => onSelectCommunity(community.id)}
                        />
                    )) : (
                        <div className="text-center py-16 text-zinc-500">
                            <p>You haven't joined any communities yet.</p>
                        </div>
                    )}
                </div>
            );
        }

        if (isAddingMembers) {
            return <AddMembersPage 
                        community={community} 
                        onBack={() => onSetIsAddingMembers(false)}
                        onToggleNotifications={onToggleNotifications}
                        hasUnreadNotifications={hasUnreadNotifications}
                    />;
        }

        if (selectedChannelId) {
            return <ChannelContentPage
                        community={community}
                        channelId={selectedChannelId}
                        currentUser={currentUser}
                        onBack={onBackToCommunityHub}
                        onAddPost={(newPost) => onCreatePost(community.id, selectedChannelId, newPost)}
                        onAddChatMessage={(newMsg) => onAddOrUpdateChatMessage(community.id, newMsg)}
                        onToggleNotifications={onToggleNotifications}
                        hasUnreadNotifications={hasUnreadNotifications}
                    />;
        }

        return <CommunityHubPage
                    community={community}
                    currentUser={currentUser}
                    onSelectChannel={onSelectChannel}
                    onBack={onBackToCommunityList}
                    onLeaveCommunity={() => onLeaveCommunity(community.id)}
                    onUpdateCommunity={(data) => onUpdateCommunity(community.id, data)}
                    onAddChannel={onAddChannel}
                    onUpdateChannel={onUpdateChannel}
                    onAddMembers={onAddMembers}
                    activeFilter={hubActiveFilter}
                    setActiveFilter={onSetHubActiveFilter}
                    onToggleNotifications={onToggleNotifications}
                    hasUnreadNotifications={hasUnreadNotifications}
                    onCopyPlan={onCopyPlan}
                    onViewSharedItem={onViewSharedItem}
                    onViewWorkout={onViewWorkout}
                />;
    };

    const renderContent = () => {
        const allPosts = communities.flatMap(c => c.posts).sort((a, b) => b.id - a.id);

        switch(activeSubTab) {
            case 'All Feed':
                return (
                    <div className="h-full overflow-y-auto px-2 md:px-4 py-4">
                        {allPosts.map((post) => (
                            <PostCard key={post.id} post={post} currentUser={currentUser} showCommunityName={true} />
                        ))}
                    </div>
                );
            case 'My Community':
                return renderMyCommunityContent();
            case 'Create Own Community':
                if (hasPremium) {
                    return <CreateCommunityPage currentUser={currentUser} onCreateCommunity={handleCreateCommunityAndSwitch} />;
                }
                return (
                    <div className="text-center py-16 text-zinc-500">
                        <p>Unlock community creation by purchasing our premium plan.</p>
                    </div>
                );
            default:
                return null;
        }
    };

    const showHeaderAndTabs = !selectedCommunityId;

    return (
        <>
            {isLoadingPurchase && (
                <div className="fixed inset-0 bg-black/90 z-[100] flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-amber-500"></div>
                    <p className="text-white text-lg font-semibold mt-4">Processing Purchase...</p>
                </div>
            )}
            {showPremiumModal && (
                <PremiumModal 
                    onClose={() => setShowPremiumModal(false)}
                    onBuy={handleBuyPremium}
                />
            )}
            <div className="w-full h-full flex flex-col">
                {showHeaderAndTabs && (
                    <header className="sticky top-0 bg-zinc-950/80 backdrop-blur-sm z-10 p-4 shrink-0">
                        <div className="flex justify-between items-center">
                             <div className="w-8">
                                <button onClick={onMenuClick} className="text-zinc-400 hover:text-zinc-200">
                                    <Icon type="menu" className="w-6 h-6" />
                                </button>
                            </div>
                            <h1 className="text-xl font-bold text-zinc-100 uppercase tracking-wider">Community</h1>
                             <div className="w-8">
                                <button onClick={onToggleNotifications} className="relative text-zinc-400 hover:text-zinc-200">
                                    <Icon type="bell" className="w-6 h-6" />
                                    {hasUnreadNotifications && <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-zinc-950"></span>}
                                </button>
                            </div>
                        </div>
                    </header>
                )}

                {showHeaderAndTabs && (
                    <div className="border-b border-zinc-800 px-4 shrink-0">
                        <nav className="flex space-x-4">
                            <button 
                                onClick={() => setActiveSubTab('All Feed')}
                                className={`py-2 px-1 text-sm font-semibold transition-colors duration-200 ${
                                    activeSubTab === 'All Feed' 
                                    ? 'text-amber-400 border-b-2 border-amber-400' 
                                    : 'text-zinc-500 hover:text-zinc-300'
                                }`}
                            >
                                All Feed
                            </button>
                            <button 
                                onClick={() => {
                                    setActiveSubTab('My Community');
                                    onBackToCommunityList();
                                }}
                                className={`py-2 px-1 text-sm font-semibold transition-colors duration-200 ${
                                    activeSubTab === 'My Community' 
                                    ? 'text-amber-400 border-b-2 border-amber-400' 
                                    : 'text-zinc-500 hover:text-zinc-300'
                                }`}
                            >
                                My Community
                            </button>
                             <button 
                                onClick={() => {
                                    setActiveSubTab('Create Own Community');
                                    if (!hasPremium) {
                                        setShowPremiumModal(true);
                                    }
                                }}
                                className={`py-2 px-1 text-sm font-semibold transition-colors duration-200 ${
                                    activeSubTab === 'Create Own Community' 
                                    ? 'text-amber-400 border-b-2 border-amber-400' 
                                    : 'text-zinc-500 hover:text-zinc-300'
                                }`}
                            >
                                Create Own Community
                            </button>
                        </nav>
                    </div>
                )}
                
                <div className="flex-grow min-h-0">{renderContent()}</div>
            </div>
        </>
    );
};

export default CommunityPage;
