import React, { useState } from 'react';
import type { Community, User, Post, ChatMessage } from '../types';
import Icon from '../components/Icon';
import PostCard from '../components/PostCard';
import ChatPane from '../components/ChatPane';
import MemberListPane from '../components/MemberListPane';
import CreatePostModal from '../components/CreatePostModal';
import SupportAdminView from '../components/SupportAdminView';

interface ChannelContentPageProps {
    community: Community;
    channelId: number;
    currentUser: User;
    onBack: () => void;
    onAddPost: (newPostData: Omit<Post, 'id' | 'user' | 'communityId' | 'channelId' | 'likes' | 'commentCount' | 'comments'>) => void;
    onAddChatMessage: (newMsgData: Partial<ChatMessage> & { text: string }) => void;
}

const ChannelContentPage: React.FC<ChannelContentPageProps> = ({ community, channelId, currentUser, onBack, onAddPost, onAddChatMessage }) => {
    const [isCreatePostModalOpen, setCreatePostModalOpen] = useState(false);
    const selectedChannel = community.channels.find(c => c.id === channelId)!;
    const isAdmin = community.adminId === currentUser.id;

    const handlePostSubmit = (postData: {description: string, hashtags: string[], image?: string, video?: string}) => {
        onAddPost(postData);
        setCreatePostModalOpen(false);
    };

    const renderMainContent = () => {
        if (!selectedChannel) return <p>Channel not found.</p>;

        const postsForChannel = community.posts.filter(p => p.channelId === selectedChannel.id);
        const renderPostsView = () => (
             <div className="px-2 md:px-4 py-4 overflow-y-auto h-full">
                {postsForChannel.length > 0 ? (
                    postsForChannel.map(post => <PostCard key={post.id} post={post} currentUser={currentUser} />)
                ) : (
                    <div className="text-center py-16 text-zinc-500">
                        <p>No posts in this channel yet.</p>
                        { (selectedChannel.type === 'posts' || (selectedChannel.type === 'admin-only' && isAdmin)) && 
                            <p className="text-sm mt-1">Be the first to share something!</p>
                        }
                    </div>
                )}
            </div>
        );

        switch (selectedChannel.type) {
            case 'admin-only':
            case 'posts':
                return renderPostsView();
            case 'chat':
                if (selectedChannel.name === 'support' && isAdmin) {
                    return <SupportAdminView 
                                community={community}
                                currentUser={currentUser}
                                onSendMessage={onAddChatMessage}
                           />;
                }
                const messagesForChannel = community.chatMessages;
                return <ChatPane 
                            channel={selectedChannel} 
                            messages={messagesForChannel} 
                            currentUser={currentUser} 
                            onSendMessage={onAddChatMessage}
                        />;
            case 'members':
                return <MemberListPane members={community.members} />;
            default:
                return null;
        }
    };

     return (
        <div className="flex h-full flex-col relative">
            {isCreatePostModalOpen && (
                <CreatePostModal 
                    onClose={() => setCreatePostModalOpen(false)}
                    onAddPost={handlePostSubmit}
                />
            )}
            {/* Header */}
            <header className="sticky top-0 bg-zinc-950/80 backdrop-blur-sm z-10 flex items-center p-4 border-b border-zinc-800 shrink-0">
                <button onClick={onBack} className="mr-4 text-zinc-400 hover:text-zinc-200">
                    <Icon type="arrow-left" />
                </button>
                <div>
                     <h1 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">{community.name}</h1>
                     <p className="text-lg font-bold text-zinc-100">#{selectedChannel.name}</p>
                </div>
                <div className="ml-auto flex items-center space-x-4">
                     <button className="relative text-zinc-400 hover:text-zinc-200">
                        <Icon type="bell" className="w-6 h-6" />
                        <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-zinc-950"></span>
                    </button>
                     <button className="text-zinc-400 hover:text-zinc-200"><Icon type="search" className="w-5 h-5"/></button>
                     <button className="text-zinc-400 hover:text-zinc-200"><Icon type="dots-horizontal" /></button>
                </div>
            </header>
            
            <main className="flex-grow min-h-0">
                {renderMainContent()}
            </main>

            {(selectedChannel.type === 'posts' || (selectedChannel.type === 'admin-only' && isAdmin)) && (
                <button 
                    onClick={() => setCreatePostModalOpen(true)}
                    className="absolute bottom-24 right-4 bg-amber-500 hover:bg-amber-600 text-black rounded-full p-4 shadow-lg transition-transform hover:scale-105"
                    aria-label="Create new post"
                >
                    <Icon type="plus" className="w-6 h-6" />
                </button>
            )}
        </div>
    );
};

export default ChannelContentPage;