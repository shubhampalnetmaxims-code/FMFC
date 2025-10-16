import React, { useState } from 'react';
import type { Community } from '../types';

interface EditCommunityModalProps {
    community: Community;
    onClose: () => void;
    onUpdate: (updatedData: { name: string, description: string }) => void;
}

const EditCommunityModal: React.FC<EditCommunityModalProps> = ({ community, onClose, onUpdate }) => {
    const [name, setName] = useState(community.name);
    const [description, setDescription] = useState(community.description || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            alert('Community name cannot be empty.');
            return;
        }
        onUpdate({ name, description });
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
                <header className="flex items-center justify-between p-4 border-b border-zinc-800">
                    <h2 className="text-lg font-bold">Edit Community</h2>
                    <button onClick={onClose} className="text-zinc-400 hover:text-white text-2xl leading-none">&times;</button>
                </header>

                <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-4 space-y-4">
                    <div>
                        <label htmlFor="edit-community-name" className="block text-sm font-medium text-zinc-300 mb-1">Community Name</label>
                        <input
                            type="text"
                            id="edit-community-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-zinc-800 border-zinc-700 rounded-lg p-3 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="edit-community-description" className="block text-sm font-medium text-zinc-300 mb-1">Description</label>
                        <textarea
                            id="edit-community-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="w-full bg-zinc-800 border-zinc-700 rounded-lg p-3 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
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

export default EditCommunityModal;