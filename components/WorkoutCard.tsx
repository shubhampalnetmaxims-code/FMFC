

import React from 'react';
import { Workout } from '../types';
import Icon from './Icon';

interface WorkoutCardProps {
    workout: Workout;
    onViewWorkout: (workout: Workout) => void;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({ workout, onViewWorkout }) => {
    const difficultyMap = {
        1: 'Beginner',
        2: 'Easy',
        3: 'Intermediate',
        4: 'Hard',
        5: 'Advanced',
    };

    return (
        <button onClick={() => onViewWorkout(workout)} className="bg-zinc-900 rounded-lg overflow-hidden shadow-lg border border-zinc-800 flex flex-col text-left hover:border-amber-400/50 transition-colors">
            <div className="relative">
                <img src={workout.image} alt={workout.title} className="w-full h-32 object-cover" />
                <div className="absolute top-2 right-2 flex items-center bg-black/60 text-white text-xs font-semibold px-2 py-1 rounded-full">
                    <Icon type="session" className="w-3 h-3 mr-1" />
                    <span>{workout.duration} Min</span>
                </div>
            </div>
            <div className="p-3 flex-grow flex flex-col">
                <h3 className="font-bold text-zinc-100">{workout.title}</h3>
                <p className="text-xs text-zinc-400 mt-1 flex-grow">{workout.description}</p>
                <div className="flex flex-wrap gap-1 mt-3">
                    <span className="text-xs bg-sky-400/20 text-sky-300 px-2 py-0.5 rounded-full">{workout.style}</span>
                    <span className="text-xs bg-red-400/20 text-red-300 px-2 py-0.5 rounded-full">{workout.muscleGroup}</span>
                    <span className="text-xs bg-green-400/20 text-green-300 px-2 py-0.5 rounded-full">{difficultyMap[workout.difficulty]}</span>
                </div>
            </div>
        </button>
    );
};

export default WorkoutCard;