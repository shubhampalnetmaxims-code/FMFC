import React, { useState, useMemo } from 'react';
import type { Community, User } from '../types';
import { USERS_DATA } from '../constants';
import QRCodeModal from '../components/QRCodeModal';
import Icon from '../components/Icon';

interface AddMembersPageProps {
    community: Community;
    onBack: () => void;
}

const AddMembersPage: React.FC<AddMembersPageProps> = ({ community, onBack }) => {
    const [inviteInput, setInviteInput] = useState('');
    const [showQRCode, setShowQRCode] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);
    const [invitedUserIds, setInvitedUserIds] = useState<number[]>([]);

    const inviteUrl = `https://social.fitness/join/${community.id}`;

    const contacts = useMemo(() => {
        const memberIds = new Set(community.members.map(m => m.id));
        return USERS_DATA.filter(user => !memberIds.has(user.id));
    }, [community.members]);
    
    const suggestedContacts = useMemo(() => {
        const trimmedInput = inviteInput.trim();
        if (!trimmedInput) return [];

        const lowercasedInput = trimmedInput.toLowerCase();

        const realSuggestions = contacts.filter(user => 
            user.name.toLowerCase().includes(lowercasedInput)
        );

        // If no real contacts match, create a dummy suggestion to invite the typed input.
        if (realSuggestions.length === 0) {
            const isEmail = trimmedInput.includes('@');
            const initials = isEmail ? '✉️' : (trimmedInput.split(' ').map(n => n[0]).join('').toUpperCase());
            const dummySuggestion: User = {
                id: -1, // Use a special ID for non-contact invites
                name: trimmedInput,
                avatar: `https://avatar.vercel.sh/${encodeURIComponent(initials)}.png?text=${encodeURIComponent(initials)}`,
            };
            return [dummySuggestion];
        }

        return realSuggestions;
    }, [inviteInput, contacts]);

    const handleInviteUser = (userId: number) => {
        setInvitedUserIds(prev => [...prev, userId]);
        // In a real app, this would trigger a backend event.
        // For simulation, we'll just update the UI.
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(inviteUrl).then(() => {
            setLinkCopied(true);
            setTimeout(() => setLinkCopied(false), 2000);
        });
    };

    return (
        <>
            <div className="flex h-full flex-col">
                <header className="sticky top-0 bg-zinc-950/80 backdrop-blur-sm z-10 flex items-center p-4 border-b border-zinc-800">
                    <button onClick={onBack} className="mr-4 text-zinc-400 hover:text-zinc-200">
                        <Icon type="arrow-left" />
                    </button>
                    <h1 className="text-lg font-bold text-zinc-100">Invite Members</h1>
                    <div className="ml-auto">
                        <button className="relative text-zinc-400 hover:text-zinc-200">
                            <Icon type="bell" className="w-6 h-6" />
                            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-zinc-950"></span>
                        </button>
                    </div>
                </header>

                <main className="flex-grow overflow-y-auto p-4 md:p-6 space-y-6">
                    <div>
                        <label htmlFor="invite-input" className="block text-sm font-medium text-zinc-300 mb-2">
                            Invite from your contacts
                        </label>
                        <div className="relative">
                            <Icon type="search" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                            <input
                                type="text"
                                id="invite-input"
                                value={inviteInput}
                                onChange={(e) => setInviteInput(e.target.value)}
                                placeholder="Search by name, email, or number..."
                                className="w-full bg-zinc-800 border-zinc-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                        </div>
                    </div>
                    
                    {inviteInput && suggestedContacts.length > 0 && (
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                            {suggestedContacts.map(user => {
                                const isInvited = invitedUserIds.includes(user.id);
                                return (
                                    <div key={user.id} className="flex items-center justify-between p-2 rounded-lg bg-zinc-800/50">
                                        <div className="flex items-center space-x-3 overflow-hidden">
                                            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                                            <span className="font-semibold text-zinc-200 truncate">{user.name}</span>
                                        </div>
                                        <button
                                            onClick={() => handleInviteUser(user.id)}
                                            disabled={isInvited}
                                            className={`text-sm font-semibold px-4 py-1.5 rounded-md transition-colors shrink-0 ${
                                                isInvited 
                                                ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed' 
                                                : 'bg-amber-500 hover:bg-amber-600 text-black'
                                            }`}
                                        >
                                            {isInvited ? 'Invited' : 'Invite'}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-zinc-700" />
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-zinc-950 px-2 text-sm text-zinc-500">or</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-sm font-medium text-zinc-300">Share an invite link</h3>
                        <div className="flex items-center space-x-2 p-2.5 bg-zinc-800 rounded-lg">
                            <p className="text-sm text-zinc-400 truncate flex-grow">{inviteUrl}</p>
                            <button
                                onClick={handleCopyLink}
                                className="text-sm font-semibold text-amber-400 hover:text-amber-300 whitespace-nowrap"
                            >
                                {linkCopied ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                        <button
                            onClick={() => setShowQRCode(true)}
                            className="w-full text-center py-2.5 bg-zinc-800 hover:bg-zinc-700 text-sm font-semibold rounded-lg transition-colors"
                        >
                            Show QR Code
                        </button>
                    </div>
                </main>
            </div>
            {showQRCode && (
                <QRCodeModal
                    inviteUrl={inviteUrl}
                    communityName={community.name}
                    onClose={() => setShowQRCode(false)}
                />
            )}
        </>
    );
};

export default AddMembersPage;