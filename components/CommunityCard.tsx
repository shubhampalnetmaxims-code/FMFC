import React from 'react';
import type { Community } from '../types';
import Icon from './Icon';

interface CommunityCardProps {
    community: Community;
    onSelect: () => void;
}

const CommunityCard: React.FC<CommunityCardProps> = ({ community, onSelect }) => {
    return (
        <div 
            className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 flex items-center justify-between hover:bg-zinc-800/50 transition-colors cursor-pointer"
            onClick={onSelect}
        >
            <div className="flex items-center">
                <div className="w-12 h-12 rounded-lg bg-amber-400/10 flex items-center justify-center mr-4">
                    <span className="text-2xl font-bold text-amber-300">{community.name.charAt(0)}</span>
                </div>
                <div>
                    <h3 className="font-semibold text-zinc-200">{community.name}</h3>
                    <div className="flex items-center mt-1">
                        <div className="flex -space-x-2 mr-2">
                            {community.members.slice(0, 3).map(member => (
                                <img key={member.id} src={member.avatar} alt={member.name} className="w-5 h-5 rounded-full object-cover border-2 border-zinc-900" />
                            ))}
                        </div>
                        <span className="text-xs text-zinc-400">{community.members.length} members</span>
                    </div>
                </div>
            </div>
            {/* The three-dot menu has been moved to the CommunityHubPage for better context */}
        </div>
    );
};

export default CommunityCard;