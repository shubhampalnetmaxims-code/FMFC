import React from 'react';
import type { User } from '../types';

interface MemberListPaneProps {
    members: User[];
}

const MemberListPane: React.FC<MemberListPaneProps> = ({ members }) => {
    return (
        <div className="p-4">
            <h2 className="text-lg font-semibold text-zinc-300 mb-4 px-2">Members — {members.length}</h2>
            <div className="space-y-2">
                {members.map(member => (
                    <div key={member.id} className="flex items-center p-2 rounded-lg hover:bg-zinc-800/50">
                        <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full object-cover mr-3" />
                        <div>
                            <p className="font-semibold text-zinc-200">{member.name}</p>
                            {member.role && (
                                 <span className="text-xs font-semibold bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full capitalize">
                                    {member.role}
                                 </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MemberListPane;