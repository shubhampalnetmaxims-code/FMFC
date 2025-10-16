import React, { useState } from 'react';
import type { User } from '../types';

interface CreateCommunityPageProps {
    currentUser: User;
    onCreateCommunity: (data: { name: string; description: string; isPrivate: boolean }) => void;
}

const CreateCommunityPage: React.FC<CreateCommunityPageProps> = ({ currentUser, onCreateCommunity }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            alert('Community name is required.');
            return;
        }
        onCreateCommunity({ name, description, isPrivate });
    };

    return (
        <div className="p-4 h-full">
            <div className="max-w-md mx-auto">
                 <header className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-zinc-100 uppercase tracking-wider">Create Your Community</h1>
                    <p className="text-zinc-400 mt-1">Build a space for your fitness journey.</p>
                </header>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="community-name" className="block text-sm font-medium text-zinc-300 mb-1">Community Name</label>
                        <input
                            type="text"
                            id="community-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                            placeholder="e.g., Weekend Warriors"
                            required
                        />
                    </div>
                     <div>
                        <label htmlFor="community-description" className="block text-sm font-medium text-zinc-300 mb-1">Description (Optional)</label>
                        <textarea
                            id="community-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            placeholder="What is your community about?"
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                    </div>
                    <div className="flex items-center justify-between bg-zinc-800/50 p-3 rounded-lg">
                        <div>
                            <p className="font-medium text-zinc-200">Private Community</p>
                            <p className="text-xs text-zinc-400">Only invited members can see and join.</p>
                        </div>
                         <button
                            type="button"
                            onClick={() => setIsPrivate(!isPrivate)}
                            className={`${
                                isPrivate ? 'bg-amber-500' : 'bg-zinc-700'
                            } relative inline-flex items-center h-6 rounded-full w-11 transition-colors`}
                            role="switch"
                            aria-checked={isPrivate}
                        >
                            <span className={`${
                                isPrivate ? 'translate-x-6' : 'translate-x-1'
                            } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} />
                        </button>
                    </div>
                     <button
                        type="submit"
                        className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-200 disabled:bg-zinc-600 disabled:cursor-not-allowed"
                        disabled={!name.trim()}
                    >
                        Create Community
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateCommunityPage;