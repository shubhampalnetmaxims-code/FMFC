import React, { useState, useRef, useEffect } from 'react';
import type { Community, Channel, User, ChannelType } from '../types';
import Icon from '../components/Icon';
import MemberListPane from '../components/MemberListPane';
import MediaGrid from '../components/MediaGrid';
import EditCommunityModal from '../components/EditCommunityModal';
import EditChannelModal from '../components/EditChannelModal';
import PostCard from '../components/PostCard';
import MediaViewerModal from '../components/MediaViewerModal';
import FileListPane from '../components/FileListPane';

export type CommunityHubFilterType = 'feed' | 'channels' | 'members' | 'files' | 'media';

interface CommunityHubPageProps {
    community: Community;
    currentUser: User;
    onSelectChannel: (channelId: number) => void;
    onBack: () => void;
    onLeaveCommunity: () => void;
    onUpdateCommunity: (updatedData: { name: string; description: string; }) => void;
    onAddChannel: (communityId: number, channelName: string, channelType: ChannelType) => void;
    onUpdateChannel: (communityId: number, channelId: number, updatedData: { name: string; type: ChannelType }) => void;
    onAddMembers: () => void;
    activeFilter: CommunityHubFilterType;
    setActiveFilter: (filter: CommunityHubFilterType) => void;
}

const CommunityHubPage: React.FC<CommunityHubPageProps> = ({ community, currentUser, onSelectChannel, onBack, onLeaveCommunity, onUpdateCommunity, onAddChannel, onUpdateChannel, onAddMembers, activeFilter, setActiveFilter }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingChannel, setEditingChannel] = useState<Channel | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const [showAddChannelForm, setShowAddChannelForm] = useState(false);
    const [newChannelName, setNewChannelName] = useState('');
    const [newChannelType, setNewChannelType] = useState<ChannelType>('posts');
    const [viewingImageUrl, setViewingImageUrl] = useState<string | null>(null);

    const isAdmin = community.adminId === currentUser.id;

    const handleLeaveClick = () => {
        setIsMenuOpen(false);
        if (window.confirm(`Are you sure you want to leave ${community.name}? This action cannot be undone.`)) {
            onLeaveCommunity();
        }
    };
    
    const handleEditClick = () => {
        setIsMenuOpen(false);
        setIsEditModalOpen(true);
    };
    
    const handleUpdateCommunity = (updatedData: { name: string; description: string; }) => {
        onUpdateCommunity(updatedData);
        setIsEditModalOpen(false);
    }

    const handleCreateChannel = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newChannelName.trim()) {
            alert('Channel name cannot be empty.');
            return;
        }
        onAddChannel(community.id, newChannelName, newChannelType);
        // Reset and hide form
        setNewChannelName('');
        setNewChannelType('posts');
        setShowAddChannelForm(false);
    };
    
    const handleUpdateChannel = (updatedData: { name: string; type: ChannelType }) => {
        if (editingChannel) {
            onUpdateChannel(community.id, editingChannel.id, updatedData);
        }
        setEditingChannel(null);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const renderContent = () => {
        switch (activeFilter) {
            case 'feed': {
                const communityPosts = community.posts.sort((a, b) => b.id - a.id);
                if (communityPosts.length === 0) {
                    return (
                        <div className="text-center py-16 text-zinc-500">
                            <p>No posts in this community yet.</p>
                            <p className="text-sm mt-1">Create the first post in a channel!</p>
                        </div>
                    );
                }
                return (
                    <div className="px-2 md:px-4 py-4">
                        {communityPosts.map(post => (
                            <PostCard key={post.id} post={post} currentUser={currentUser} />
                        ))}
                    </div>
                );
            }
            case 'channels':
                return (
                    <div className="p-4 space-y-4">
                        {isAdmin && (
                            <>
                                {!showAddChannelForm ? (
                                    <button
                                        onClick={() => setShowAddChannelForm(true)}
                                        className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors bg-amber-500 hover:bg-amber-600 text-black"
                                    >
                                        <Icon type="plus" className="w-5 h-5" />
                                        <span>Create Channel</span>
                                    </button>
                                ) : (
                                    <form onSubmit={handleCreateChannel} className="bg-zinc-800/50 p-4 rounded-lg space-y-4">
                                        <h3 className="font-semibold text-zinc-200">New Channel</h3>
                                        <div>
                                            <label htmlFor="channel-name" className="block text-xs font-medium text-zinc-400 mb-1">Channel Name</label>
                                            <input
                                                type="text"
                                                id="channel-name"
                                                value={newChannelName}
                                                onChange={(e) => setNewChannelName(e.target.value)}
                                                placeholder="e.g., announcements"
                                                className="w-full bg-zinc-900 border-zinc-700 rounded-md p-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-zinc-400 mb-2">Channel Type</label>
                                            <div className="flex flex-wrap gap-4">
                                                <label className="flex items-center space-x-2 text-sm text-zinc-300 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="channelType"
                                                        value="posts"
                                                        checked={newChannelType === 'posts'}
                                                        onChange={() => setNewChannelType('posts')}
                                                        className="form-radio bg-zinc-700 border-zinc-600 text-amber-500 focus:ring-amber-500"
                                                    />
                                                    <span>Posts</span>
                                                </label>
                                                <label className="flex items-center space-x-2 text-sm text-zinc-300 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="channelType"
                                                        value="chat"
                                                        checked={newChannelType === 'chat'}
                                                        onChange={() => setNewChannelType('chat')}
                                                        className="form-radio bg-zinc-700 border-zinc-600 text-amber-500 focus:ring-amber-500"
                                                    />
                                                    <span>Chat</span>
                                                </label>
                                                 <label className="flex items-center space-x-2 text-sm text-zinc-300 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="channelType"
                                                        value="admin-only"
                                                        checked={newChannelType === 'admin-only'}
                                                        onChange={() => setNewChannelType('admin-only')}
                                                        className="form-radio bg-zinc-700 border-zinc-600 text-amber-500 focus:ring-amber-500"
                                                    />
                                                    <span>Admin Only</span>
                                                </label>
                                            </div>
                                        </div>
                                        <div className="flex justify-end space-x-2">
                                            <button
                                                type="button"
                                                onClick={() => setShowAddChannelForm(false)}
                                                className="px-4 py-2 rounded-md text-sm font-semibold bg-zinc-700 hover:bg-zinc-600 text-zinc-200 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-4 py-2 rounded-md text-sm font-semibold bg-amber-500 hover:bg-amber-600 text-black transition-colors"
                                            >
                                                Create
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </>
                        )}
                        <div className="space-y-1">
                            {community.channels.filter(c => c.type !== 'members').map(channel => (
                                <div key={channel.id} className="flex items-center justify-between rounded-lg hover:bg-zinc-800 group">
                                    <ChannelRow 
                                        channel={channel}
                                        onClick={() => onSelectChannel(channel.id)}
                                    />
                                    {isAdmin && (
                                        <button 
                                            onClick={() => setEditingChannel(channel)} 
                                            className="p-2 mr-2 text-zinc-600 group-hover:text-amber-400 transition-colors"
                                            aria-label={`Edit ${channel.name} channel`}
                                        >
                                            <Icon type="pencil" className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'members':
                return (
                    <div>
                        {isAdmin && (
                            <div className="p-4 border-b border-zinc-800">
                                <button
                                    onClick={onAddMembers}
                                    className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors bg-amber-500 hover:bg-amber-600 text-black"
                                >
                                    <Icon type="user-plus" className="w-5 h-5" />
                                    <span>Add Members</span>
                                </button>
                            </div>
                        )}
                         <MemberListPane members={community.members} />
                    </div>
                );
            case 'media':
                const imageUrls = community.posts.map(p => p.image).filter((url): url is string => !!url);
                return <MediaGrid imageUrls={imageUrls} onImageClick={setViewingImageUrl} />;
            case 'files':
                 return <FileListPane files={community.files || []} />;
            default:
                return null;
        }
    };

    return (
        <div className="flex h-full flex-col">
            {isEditModalOpen && (
                <EditCommunityModal
                    community={community}
                    onClose={() => setIsEditModalOpen(false)}
                    onUpdate={handleUpdateCommunity}
                />
            )}
            {editingChannel && (
                <EditChannelModal
                    channel={editingChannel}
                    onClose={() => setEditingChannel(null)}
                    onUpdate={handleUpdateChannel}
                />
            )}
             {viewingImageUrl && (
                <MediaViewerModal
                    imageUrl={viewingImageUrl}
                    onClose={() => setViewingImageUrl(null)}
                />
            )}
            {/* Header */}
            <header className="sticky top-0 bg-zinc-950/80 backdrop-blur-sm z-10 flex items-center p-4 border-b border-zinc-800">
                <button onClick={onBack} className="mr-4 text-zinc-400 hover:text-zinc-200">
                    <Icon type="arrow-left" />
                </button>
                <h1 className="text-lg font-bold text-zinc-100 uppercase tracking-wider">{community.name}</h1>
                <div className="ml-auto flex items-center space-x-4">
                    <button className="relative text-zinc-400 hover:text-zinc-200">
                        <Icon type="bell" className="w-6 h-6" />
                        <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-zinc-950"></span>
                    </button>
                    <div className="relative" ref={menuRef}>
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-zinc-400 hover:text-zinc-200">
                            <Icon type="dots-horizontal" />
                        </button>
                        {isMenuOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-zinc-800 border border-zinc-700 rounded-md shadow-lg z-20">
                            {isAdmin && (
                                <button 
                                        onClick={handleEditClick}
                                        className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-700"
                                    >
                                        <Icon type="pencil" className="w-4 h-4"/>
                                        <span>Edit Community</span>
                                    </button>
                            )}
                                <button 
                                    onClick={handleLeaveClick}
                                    className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-zinc-700"
                                >
                                    <span>Leave Community</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Filter Buttons */}
            <div className="p-4 border-b border-zinc-800">
                <div className="flex space-x-2 overflow-x-auto pb-2">
                    <FilterButton label="Feed" icon="chat-bubble-left-right" isActive={activeFilter === 'feed'} onClick={() => setActiveFilter('feed')} />
                    <FilterButton label="Channels" icon="hash" isActive={activeFilter === 'channels'} onClick={() => setActiveFilter('channels')} />
                    <FilterButton label="Members" icon="users" isActive={activeFilter === 'members'} onClick={() => setActiveFilter('members')} />
                    <FilterButton label="Media" icon="photo" isActive={activeFilter === 'media'} onClick={() => setActiveFilter('media')} />
                    <FilterButton label="Files" icon="file-document" isActive={activeFilter === 'files'} onClick={() => setActiveFilter('files')} />
                </div>
            </div>

            {/* Content */}
            <main className="flex-grow overflow-y-auto">
                {renderContent()}
            </main>
        </div>
    );
};

const ChannelRow: React.FC<{ channel: Channel; onClick: () => void; }> = ({ channel, onClick }) => {
    const getIconType = () => {
        switch(channel.type) {
            case 'chat': return 'hash';
            case 'posts': return 'hash';
            case 'admin-only': return 'pin';
            default: return 'hash';
        }
    };
    
    return (
         <button 
            onClick={onClick}
            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-colors"
        >
            {channel.isPrivate ? (
                <Icon type="lock-closed" className="w-5 h-5 text-zinc-500" />
            ) : (
                <Icon type={getIconType()} className="w-5 h-5 text-zinc-500" />
            )}
            <span className="font-medium text-zinc-300">{channel.name}</span>
        </button>
    );
};

const FilterButton: React.FC<{label: string, icon: any, isActive: boolean, onClick: () => void}> = ({ label, icon, isActive, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-semibold transition-colors shrink-0 ${
                isActive ? 'bg-amber-400/20 text-amber-300' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
        >
            <Icon type={icon} className="w-4 h-4" />
            <span>{label}</span>
        </button>
    )
}

export default CommunityHubPage;