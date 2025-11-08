import React from 'react';
import { Workout } from '../types';
import Icon from './Icon';

interface WorkoutMessageCardProps {
    workout: Workout;
}

const WorkoutMessageCard: React.FC<WorkoutMessageCardProps> = ({ workout }) => {
    return (
        <div className="bg-zinc-800 rounded-lg overflow-hidden my-2 max-w-xs border border-zinc-700">
            <img src={workout.image} alt={workout.title} className="w-full h-24 object-cover" />
            <div className="p-3">
                <h4 className="font-bold text-sm text-zinc-100 truncate">{workout.title}</h4>
                <div className="flex items-center text-xs text-zinc-400 mt-1">
                    <Icon type="session" className="w-3 h-3 mr-1.5" />
                    <span>{workout.duration} Min</span>
                    <span className="mx-2">·</span>
                    <span>{workout.style}</span>
                </div>
            </div>
        </div>
    );
};

export default WorkoutMessageCard;
