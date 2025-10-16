import React, { useState } from 'react';
import type { Community } from '../types';
import QRCodeModal from './QRCodeModal';

interface AddMembersModalProps {
    community: Community;
    onClose: () => void;
}

const AddMembersModal: React.FC<AddMembersModalProps> = ({ community, onClose }) => {
    const [inviteInput, setInviteInput] = useState('');
    const [showQRCode, setShowQRCode] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);

    const inviteUrl = `https://social.fitness/join/${community.id}`;

    const handleSendInvite = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inviteInput.trim()) return;
        // This is a simulation. In a real app, this would trigger a backend event.
        alert(`Invitation sent to ${inviteInput}!`);
        setInviteInput('');
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(inviteUrl).then(() => {
            setLinkCopied(true);
            setTimeout(() => setLinkCopied(false), 2000); // Reset after 2 seconds
        });
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-sm max-h-[90vh] flex flex-col">
                    <header className="flex items-center justify-between p-4 border-b border-zinc-800">
                        <h2 className="text-lg font-bold">Invite Members</h2>
                        <button onClick={onClose} className="text-zinc-400 hover:text-white text-2xl leading-none">&times;</button>
                    </header>
                    
                    <div className="p-6 space-y-6">
                        <form onSubmit={handleSendInvite}>
                            <label htmlFor="invite-input" className="block text-sm font-medium text-zinc-300 mb-2">
                                Invite with email or phone
                            </label>
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    id="invite-input"
                                    value={inviteInput}
                                    onChange={(e) => setInviteInput(e.target.value)}
                                    placeholder="name@example.com"
                                    className="flex-grow bg-zinc-800 border-zinc-700 rounded-lg p-2.5 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />
                                <button
                                    type="submit"
                                    className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-4 rounded-lg transition-colors disabled:bg-zinc-600"
                                    disabled={!inviteInput.trim()}
                                >
                                    Send
                                </button>
                            </div>
                        </form>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                <div className="w-full border-t border-zinc-700" />
                            </div>
                            <div className="relative flex justify-center">
                                <span className="bg-zinc-900 px-2 text-sm text-zinc-500">or</span>
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
                    </div>
                </div>
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

export default AddMembersModal;