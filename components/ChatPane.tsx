
import React, { useState } from 'react';
import type { Channel, ChatMessage, User } from '../types';
import Icon from './Icon';
import { useToast } from './ToastProvider';

interface ChatPaneProps {
    channel: Channel;
    messages: ChatMessage[];
    currentUser: User;
    onSendMessage: (message: Omit<ChatMessage, 'id' | 'user' | 'timestamp' | 'reactions'>) => void;
}

const ChatPane: React.FC<ChatPaneProps> = ({ channel, messages, currentUser, onSendMessage }) => {
    const { addToast } = useToast();
    const [newMessage, setNewMessage] = useState('');
    
    const EMOJIS = ['😊', '❤️', '😂', '👍', '🔥', '🎉', '🙏', '💯'];

    const handleSendMessage = (e: React.FormEvent, msgOverride?: Omit<ChatMessage, 'id' | 'user' | 'timestamp' | 'reactions'>) => {
        e.preventDefault();
        
        const messageToSend = msgOverride || { text: newMessage };

        if (!('text' in messageToSend) || messageToSend.text?.trim() !== '') {
            onSendMessage(messageToSend);
        }
        
        setNewMessage('');
    };

    const handleImageShare = (e: React.FormEvent) => {
       const imageUrl = prompt("Enter image URL to share:", "https://picsum.photos/400/300");
       if (imageUrl) {
            handleSendMessage(e, { text: '', imageUrl: imageUrl });
       }
    };
    
    const handleAttachmentShare = (e: React.FormEvent) => {
        addToast("Sharing documents, videos, and audio is not yet implemented.", 'info');
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-grow p-4 space-y-4 overflow-y-auto">
                 {channel.name === 'support' && (
                    <div className="text-center p-3 my-2 bg-amber-900/50 border border-amber-700 rounded-lg text-sm text-amber-200">
                        <p>This is a private support channel. Your messages here are only visible to you and the community admins.</p>
                    </div>
                )}
                {messages.map((msg, index) => (
                    <div key={msg.id} className="flex items-start space-x-3">
                        <img src={msg.user.avatar} alt={msg.user.name} className="w-10 h-10 rounded-full object-cover"/>
                        <div>
                            <div className="flex items-baseline space-x-2">
                                <span className="font-semibold text-zinc-200">{msg.user.name}</span>
                                <span className="text-xs text-zinc-500">{msg.timestamp}</span>
                            </div>
                            {msg.text && <p className="text-zinc-300">{msg.text}</p>}
                            {msg.imageUrl && (
                                <img src={msg.imageUrl} alt="Shared content" className="mt-2 rounded-lg max-w-xs" />
                            )}
                            {msg.reactions.length > 0 && (
                                <div className="flex space-x-1 mt-1">
                                    {msg.reactions.map((r, i) => (
                                        <div key={i} className="bg-zinc-800 text-xs px-1.5 py-0.5 rounded-full flex items-center space-x-1">
                                            <span>{r.emoji}</span>
                                            <span className="font-bold text-zinc-300">1</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-4 bg-zinc-900/80 border-t border-zinc-800">
                <div className="flex space-x-2 mb-2">
                    {EMOJIS.map(emoji => (
                        <button 
                            key={emoji} 
                            onClick={() => setNewMessage(newMessage + emoji)}
                            className="text-xl hover:scale-125 transition-transform"
                        >
                            {emoji}
                        </button>
                    ))}
                </div>
                 <form onSubmit={handleSendMessage} className="relative">
                    <input 
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={`Message #${channel.name}`}
                        className="w-full bg-zinc-800 border-zinc-700 rounded-lg pl-4 pr-12 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                     <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                        <button type="button" onClick={handleAttachmentShare} className="text-zinc-400 hover:text-zinc-200">
                            <Icon type="microphone" className="w-5 h-5"/>
                        </button>
                        <button type="button" onClick={handleAttachmentShare} className="text-zinc-400 hover:text-zinc-200">
                            <Icon type="video-camera" className="w-5 h-5"/>
                        </button>
                        <button type="button" onClick={handleImageShare} className="text-zinc-400 hover:text-zinc-200">
                            <Icon type="photo" className="w-5 h-5"/>
                        </button>
                        <button type="submit" className="text-amber-400 hover:text-amber-300 disabled:text-zinc-600 transition-colors" disabled={!newMessage.trim()}>
                            <Icon type="send" className="w-6 h-6" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChatPane;
