import React, { useState, useMemo } from 'react';
import type { Community, User, ChatMessage } from '../types';
import Icon from './Icon';

interface SupportAdminViewProps {
    community: Community;
    currentUser: User;
    onSendMessage: (message: Partial<ChatMessage> & { text: string }) => void;
}

const SupportAdminView: React.FC<SupportAdminViewProps> = ({ community, currentUser, onSendMessage }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

    const supportMessages = community.chatMessages;

    const conversations = useMemo(() => {
        const userMessages: { [key: number]: ChatMessage[] } = {};
        supportMessages.forEach(msg => {
            // Group messages by user, excluding the admin's own "starter" messages
            if (msg.user.id !== currentUser.id) {
                if (!userMessages[msg.user.id]) {
                    userMessages[msg.user.id] = [];
                }
                userMessages[msg.user.id].push(msg);
            }
        });
        
        return Object.values(userMessages).map(msgs => ({
            user: msgs[0].user,
            lastMessage: msgs[msgs.length - 1],
        })).sort((a,b) => b.lastMessage.id - a.lastMessage.id);
    }, [supportMessages, currentUser.id]);

    const filteredConversations = conversations.filter(conv =>
        conv.user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const selectedConversationMessages = useMemo(() => {
        if (!selectedUserId) return [];
        return supportMessages.filter(msg => msg.user.id === selectedUserId || msg.user.id === currentUser.id)
            .sort((a,b) => a.id - b.id);
    }, [selectedUserId, supportMessages, currentUser.id]);


    if (selectedUserId) {
        return (
            <ConversationChatView
                user={conversations.find(c => c.user.id === selectedUserId)!.user}
                messages={selectedConversationMessages}
                admin={currentUser}
                onBack={() => setSelectedUserId(null)}
                onSendMessage={(text) => onSendMessage({ text, toUserId: selectedUserId })} // This structure can be expanded later
                onAddNote={(messageId, noteText) => onSendMessage({ id: messageId, text: '', notes: noteText })}
            />
        );
    }
    
    return (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b border-zinc-800">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search by user name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-zinc-800 border-zinc-700 rounded-lg pl-10 pr-4 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                        <Icon type="search" className="w-5 h-5" />
                    </div>
                </div>
            </div>
            <div className="flex-grow overflow-y-auto">
                {filteredConversations.length > 0 ? (
                    filteredConversations.map(conv => (
                        <ConversationListItem
                            key={conv.user.id}
                            user={conv.user}
                            lastMessage={conv.lastMessage}
                            onClick={() => setSelectedUserId(conv.user.id)}
                        />
                    ))
                ) : (
                    <div className="text-center py-16 text-zinc-500">
                        <p>No support requests found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};


const ConversationListItem: React.FC<{user: User, lastMessage: ChatMessage, onClick: () => void}> = ({ user, lastMessage, onClick }) => (
    <button onClick={onClick} className="w-full flex items-center p-3 text-left hover:bg-zinc-800/50 transition-colors border-b border-zinc-800">
        <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover mr-4"/>
        <div className="flex-grow overflow-hidden">
            <div className="flex justify-between items-baseline">
                <p className="font-semibold text-zinc-200 truncate">{user.name}</p>
                <p className="text-xs text-zinc-500 flex-shrink-0 ml-2">{lastMessage.timestamp.replace('Today ', '')}</p>
            </div>
            <p className="text-sm text-zinc-400 truncate">{lastMessage.text}</p>
        </div>
    </button>
);


const ConversationChatView: React.FC<{
    user: User, 
    messages: ChatMessage[],
    admin: User,
    onBack: () => void, 
    onSendMessage: (text: string) => void,
    onAddNote: (messageId: number, noteText: string) => void,
}> = ({ user, messages, admin, onBack, onSendMessage, onAddNote }) => {
    const [newMessage, setNewMessage] = useState('');

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if(!newMessage.trim()) return;
        onSendMessage(newMessage);
        setNewMessage('');
    }
    
    const handleAddNoteClick = (message: ChatMessage) => {
        const noteText = prompt("Enter note for this message:", message.notes || "");
        if (noteText !== null) { // Check if user cancelled
            onAddNote(message.id, noteText);
        }
    }

    return (
        <div className="h-full flex flex-col">
            <header className="flex items-center p-3 border-b border-zinc-800 bg-zinc-900 shrink-0">
                <button onClick={onBack} className="mr-3 p-1 text-zinc-400 hover:text-zinc-200">
                    <Icon type="arrow-left" />
                </button>
                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover mr-3"/>
                <h3 className="font-bold text-zinc-200">{user.name}</h3>
            </header>
            <div className="flex-grow p-4 space-y-4 overflow-y-auto">
                {messages.map(msg => (
                    <div key={msg.id}>
                        {msg.notes && (
                            <div className="my-2 p-3 bg-amber-900/40 border border-amber-700/60 rounded-lg flex items-start space-x-3 text-sm">
                                <Icon type="pin" className="w-5 h-5 text-amber-400 mt-0.5 shrink-0"/>
                                <div>
                                    <p className="font-bold text-amber-300">Admin Note</p>
                                    <p className="text-amber-200">{msg.notes}</p>
                                </div>
                            </div>
                        )}
                        <div className="flex items-start space-x-3">
                            <img src={msg.user.avatar} alt={msg.user.name} className="w-10 h-10 rounded-full object-cover"/>
                            <div className="flex-grow">
                                <div className="flex items-baseline space-x-2">
                                    <span className="font-semibold text-zinc-200">{msg.user.name}</span>
                                    <span className="text-xs text-zinc-500">{msg.timestamp}</span>
                                </div>
                                <p className="text-zinc-300">{msg.text}</p>
                            </div>
                             <button onClick={() => handleAddNoteClick(msg)} title="Add/Edit Note" className="text-zinc-500 hover:text-amber-400">
                                <Icon type="note" className="w-5 h-5"/>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <form onSubmit={handleSendMessage} className="p-4 bg-zinc-900/80 border-t border-zinc-800">
                 <input 
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={`Reply to ${user.name}`}
                    className="w-full bg-zinc-800 border-zinc-700 rounded-lg pl-4 pr-12 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
            </form>
        </div>
    )
}


export default SupportAdminView;