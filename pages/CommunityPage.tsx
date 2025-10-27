import React, { useState } from 'react';
import PostCard from '../components/PostCard';
import { COMMUNITIES_DATA, USERS_DATA } from '../constants';
import type { User, Community, Post, ChatMessage, Channel, ChannelType } from '../types';
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
}

const CommunityPage: React.FC<CommunityPageProps> = ({ currentUser, onMenuClick }) => {
    const [activeSubTab, setActiveSubTab] = useState<SubTab>('All Feed');
    const [communities, setCommunities] = useState<Community[]>(COMMUNITIES_DATA);
    const [selectedCommunityId, setSelectedCommunityId] = useState<number | null>(null);
    const [selectedChannelId, setSelectedChannelId] = useState<number | null>(null);
    const [hubActiveFilter, setHubActiveFilter] = useState<CommunityHubFilterType>('feed');
    const [isAddingMembers, setIsAddingMembers] = useState(false);
    
    const [hasPremium, setHasPremium] = useState(false);
    const [showPremiumModal, setShowPremiumModal] = useState(false);
    const [isLoadingPurchase, setIsLoadingPurchase] = useState(false);

    const userCommunities = communities.filter(c => c.members.some(m => m.id === currentUser.id));

    const handleSelectCommunity = (id: number) => {
        setSelectedCommunityId(id);
        setSelectedChannelId(null);
        setHubActiveFilter('feed');
        setIsAddingMembers(false);
    };

    const handleSelectChannel = (id: number) => {
        setSelectedChannelId(id);
    };

    const handleBackToCommunityHub = () => {
        setSelectedChannelId(null);
        setHubActiveFilter('channels');
    };
    
    const handleBackToCommunityList = () => {
        setSelectedCommunityId(null);
        setSelectedChannelId(null);
        setIsAddingMembers(false);
    };

    const handleLeaveCommunity = (communityId: number) => {
        setCommunities(prev => prev.map(c => {
            if (c.id === communityId) {
                return {
                    ...c,
                    members: c.members.filter(m => m.id !== currentUser.id)
                };
            }
            return c;
        }));
        handleBackToCommunityList();
    };

    const handleAddPost = (communityId: number, newPostData: Omit<Post, 'id' | 'user' | 'communityId' | 'likes' | 'commentCount' | 'comments'>) => {
        setCommunities(prev => prev.map(c => {
            if (c.id === communityId) {
                const newPost: Post = {
                    ...newPostData,
                    id: Date.now(),
                    user: currentUser,
                    communityId: communityId,
                    likes: 0,
                    commentCount: 0,
                    comments: [],
                };
                return { ...c, posts: [newPost, ...c.posts] };
            }
            return c;
        }));
    };

    const handleAddOrUpdateChatMessage = (communityId: number, newMsgData: Partial<ChatMessage> & { text: string } ) => {
        setCommunities(prev => prev.map(c => {
            if (c.id === communityId) {
                // If it has an id, it's an update (e.g., adding a note)
                if (newMsgData.id) {
                    const updatedMessages = c.chatMessages.map(msg => 
                        msg.id === newMsgData.id ? { ...msg, ...newMsgData } : msg
                    );
                    return { ...c, chatMessages: updatedMessages };
                } else {
                    // It's a new message
                    const newMsg: ChatMessage = {
                        id: Date.now(),
                        user: currentUser,
                        timestamp: `Today ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
                        reactions: [],
                        ...newMsgData
                    };
                    return { ...c, chatMessages: [...c.chatMessages, newMsg] };
                }
            }
            return c;
        }));
    };
    
    const handleUpdateCommunity = (communityId: number, updatedData: { name: string; description: string }) => {
        setCommunities(prev => prev.map(c => 
            c.id === communityId ? { ...c, ...updatedData } : c
        ));
    };

    const handleAddChannel = (communityId: number, channelName: string, channelType: ChannelType) => {
        setCommunities(prev => prev.map(c => {
            if (c.id === communityId) {
                const newChannel: Channel = {
                    id: Date.now(),
                    name: channelName.trim().toLowerCase().replace(/\s+/g, '-'), // Sanitize name
                    type: channelType,
                };
                // Prevent duplicate channel names
                if (c.channels.some(ch => ch.name === newChannel.name)) {
                    alert('A channel with this name already exists.');
                    return c;
                }
                return {
                    ...c,
                    channels: [...c.channels, newChannel],
                };
            }
            return c;
        }));
    };

    const handleUpdateChannel = (communityId: number, channelId: number, updatedData: { name: string; type: ChannelType }) => {
        setCommunities(prev => prev.map(c => {
            if (c.id === communityId) {
                // Prevent duplicate channel names
                const sanitizedName = updatedData.name.trim().toLowerCase().replace(/\s+/g, '-');
                if (c.channels.some(ch => ch.name === sanitizedName && ch.id !== channelId)) {
                    alert('A channel with this name already exists.');
                    return c;
                }
                return {
                    ...c,
                    channels: c.channels.map(ch =>
                        ch.id === channelId ? { ...ch, name: sanitizedName, type: updatedData.type } : ch
                    )
                };
            }
            return c;
        }));
    };

    const handleBuyPremium = () => {
        setShowPremiumModal(false);
        setIsLoadingPurchase(true);
        setTimeout(() => {
            setIsLoadingPurchase(false);
            setHasPremium(true);
        }, 5000);
    };

    const handleCreateCommunity = (data: { name: string; description: string; isPrivate: boolean; }) => {
        const dummyMember = USERS_DATA[2]; // Using 'Alex Fitness' as a sample member

        const newCommunity: Community = {
            id: Date.now(),
            name: data.name,
            description: data.description,
            isPrivate: data.isPrivate,
            adminId: currentUser.id,
            members: [currentUser, dummyMember], // Add the current user and a dummy member
            channels: [
                { id: 1, name: 'general-posts', type: 'posts' },
                { id: 2, name: 'random-chat', type: 'chat' },
                { id: 3, name: 'members', type: 'members' },
                { id: 4, name: 'support', type: 'chat' },
            ],
            posts: [],
            chatMessages: [
                 // --- Dummy messages for 'random-chat' channel ---
                 { id: 1, user: currentUser, text: `Welcome to ${data.name}! This is the beginning of a new community.`, timestamp: 'Today 12:00 PM', reactions: [] },
                 { id: 2, user: dummyMember, text: 'Glad to be here! Looking forward to connecting with everyone.', timestamp: 'Today 12:01 PM', reactions: [{ emoji: '👋', user: currentUser }] },

                 // --- Dummy messages for 'support' channel ---
                 {
                    id: 3,
                    user: dummyMember,
                    text: "Hi, I'm new here. How do I sync my fitness tracker with the app?",
                    timestamp: 'Today 12:05 PM',
                    reactions: [],
                    notes: 'Follow up with user in 24 hours to ensure they were successful.' // Admin note
                 },
                 {
                    id: 4,
                    user: currentUser,
                    text: `Hey ${dummyMember.name}! Welcome. You can connect your tracker in the Profile > Settings > Connected Apps section. Let me know if you need more help!`,
                    timestamp: 'Today 12:06 PM',
                    reactions: [],
                    toUserId: dummyMember.id, // Targeted reply
                 }
            ],
        };

        setCommunities(prev => [newCommunity, ...prev]);
        setActiveSubTab('My Community');
        handleBackToCommunityList();
    };


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
                            onSelect={() => handleSelectCommunity(community.id)}
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
            return <AddMembersPage community={community} onBack={() => setIsAddingMembers(false)} />;
        }

        if (selectedChannelId) {
            return <ChannelContentPage
                        community={community}
                        channelId={selectedChannelId}
                        currentUser={currentUser}
                        onBack={handleBackToCommunityHub}
                        onAddPost={(newPost) => handleAddPost(community.id, newPost)}
                        onAddChatMessage={(newMsg) => handleAddOrUpdateChatMessage(community.id, newMsg)}
                    />;
        }

        return <CommunityHubPage
                    community={community}
                    currentUser={currentUser}
                    onSelectChannel={handleSelectChannel}
                    onBack={handleBackToCommunityList}
                    onLeaveCommunity={() => handleLeaveCommunity(community.id)}
                    onUpdateCommunity={(data) => handleUpdateCommunity(community.id, data)}
                    onAddChannel={handleAddChannel}
                    onUpdateChannel={handleUpdateChannel}
                    onAddMembers={() => setIsAddingMembers(true)}
                    activeFilter={hubActiveFilter}
                    setActiveFilter={setHubActiveFilter}
                />;
    };

    const renderContent = () => {
        // We use a combined list of posts from the stateful communities data
        const allPosts = communities.flatMap(c => c.posts).sort((a, b) => b.id - a.id);

        switch(activeSubTab) {
            case 'All Feed':
                return (
                    <div className="px-2 md:px-4 py-4">
                        {allPosts.map((post) => (
                            <PostCard key={post.id} post={post} currentUser={currentUser} showCommunityName={true} />
                        ))}
                    </div>
                );
            case 'My Community':
                return renderMyCommunityContent();
            case 'Create Own Community':
                if (hasPremium) {
                    return <CreateCommunityPage currentUser={currentUser} onCreateCommunity={handleCreateCommunity} />;
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
            <div className="w-full max-w-lg mx-auto h-full flex flex-col">
                {/* Header */}
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
                                <button className="relative text-zinc-400 hover:text-zinc-200">
                                    <Icon type="bell" className="w-6 h-6" />
                                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-zinc-950"></span>
                                </button>
                            </div>
                        </div>
                    </header>
                )}

                {/* Sub-navigation */}
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
                                    handleBackToCommunityList();
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
                
                {/* Content */}
                <div className="flex-grow min-h-0">{renderContent()}</div>
            </div>
        </>
    );
};

export default CommunityPage;