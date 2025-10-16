import React, { useState } from 'react';
import type { Channel, ChannelType } from '../types';

interface EditChannelModalProps {
    channel: Channel;
    onClose: () => void;
    onUpdate: (updatedData: { name: string, type: ChannelType }) => void;
}

const EditChannelModal: React.FC<EditChannelModalProps> = ({ channel, onClose, onUpdate }) => {
    const [name, setName] = useState(channel.name);
    const [type, setType] = useState<ChannelType>(channel.type);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            alert('Channel name cannot be empty.');
            return;
        }
        onUpdate({ name, type });
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
                <header className="flex items-center justify-between p-4 border-b border-zinc-800">
                    <h2 className="text-lg font-bold">Edit Channel</h2>
                    <button onClick={onClose} className="text-zinc-400 hover:text-white text-2xl leading-none">&times;</button>
                </header>

                <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-4 space-y-6">
                    <div>
                        <label htmlFor="edit-channel-name" className="block text-sm font-medium text-zinc-300 mb-1">Channel Name</label>
                        <input
                            type="text"
                            id="edit-channel-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-zinc-800 border-zinc-700 rounded-lg p-3 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                            required
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">Channel Type</label>
                        <div className="flex flex-wrap gap-4">
                            <label className="flex items-center space-x-2 text-sm text-zinc-300 cursor-pointer">
                                <input
                                    type="radio"
                                    name="editChannelType"
                                    value="posts"
                                    checked={type === 'posts'}
                                    onChange={() => setType('posts')}
                                    className="form-radio bg-zinc-700 border-zinc-600 text-amber-500 focus:ring-amber-500"
                                />
                                <span>Posts</span>
                            </label>
                            <label className="flex items-center space-x-2 text-sm text-zinc-300 cursor-pointer">
                                <input
                                    type="radio"
                                    name="editChannelType"
                                    value="chat"
                                    checked={type === 'chat'}
                                    onChange={() => setType('chat')}
                                    className="form-radio bg-zinc-700 border-zinc-600 text-amber-500 focus:ring-amber-500"
                                />
                                <span>Chat</span>
                            </label>
                            <label className="flex items-center space-x-2 text-sm text-zinc-300 cursor-pointer">
                                <input
                                    type="radio"
                                    name="editChannelType"
                                    value="admin-only"
                                    checked={type === 'admin-only'}
                                    onChange={() => setType('admin-only')}
                                    className="form-radio bg-zinc-700 border-zinc-600 text-amber-500 focus:ring-amber-500"
                                />
                                <span>Admin Only</span>
                            </label>
                        </div>
                    </div>
                </form>
                
                <footer className="p-4 border-t border-zinc-800">
                    <button 
                        type="submit" 
                        onClick={handleSubmit}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-200 disabled:bg-zinc-600"
                        disabled={!name.trim()}
                    >
                        Save Changes
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default EditChannelModal;
