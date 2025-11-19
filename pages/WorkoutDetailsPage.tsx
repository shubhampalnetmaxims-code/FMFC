
import React, { useState, useRef, useEffect } from 'react';
import { Workout, Exercise } from '../types';
import Icon from '../components/Icon';

interface WorkoutDetailsPageProps {
    workout: Workout;
    onBack: () => void;
    onShare: (workout: Workout) => void;
    onExerciseClick: (exercise: Exercise) => void;
    onCopyTemplate?: (workout: Workout) => void;
    onAddToMyWorkouts?: (workout: Workout) => void;
    onStart?: (workout: Workout) => void;
}

const WorkoutDetailsPage: React.FC<WorkoutDetailsPageProps> = ({ workout, onBack, onShare, onExerciseClick, onCopyTemplate, onAddToMyWorkouts, onStart }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="h-full flex flex-col bg-zinc-950 text-zinc-200">
            <header className="sticky top-0 bg-zinc-950/80 backdrop-blur-sm z-10 p-4 flex items-center justify-between">
                <button onClick={onBack} className="p-2 -ml-2 text-zinc-400 hover:text-zinc-200">
                    <Icon type="arrow-left" className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold text-zinc-100 truncate">{workout.title}</h1>
                <div className="relative" ref={menuRef}>
                    <button onClick={() => setIsMenuOpen(prev => !prev)} className="p-2 -mr-2 text-zinc-400 hover:text-zinc-200">
                        <Icon type="dots-horizontal" className="w-6 h-6" />
                    </button>
                    {isMenuOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-zinc-800 border border-zinc-700 rounded-md shadow-lg z-20 py-1">
                            <button 
                                onClick={() => {
                                    onShare(workout);
                                    setIsMenuOpen(false);
                                }}
                                className="flex items-center space-x-2 w-full text-left px-4 py-3 text-sm text-zinc-200 hover:bg-zinc-700"
                            >
                                <Icon type="share" className="w-4 h-4 text-zinc-400"/>
                                <span>Share Workout</span>
                            </button>
                            
                            {onCopyTemplate && (
                                <button 
                                    onClick={() => {
                                        onCopyTemplate(workout);
                                        setIsMenuOpen(false);
                                    }}
                                    className="flex items-center space-x-2 w-full text-left px-4 py-3 text-sm text-zinc-200 hover:bg-zinc-700 border-t border-zinc-700"
                                >
                                    <Icon type="file-document" className="w-4 h-4 text-zinc-400"/>
                                    <span>Copy to Templates</span>
                                </button>
                            )}

                            {onAddToMyWorkouts && (
                                <button 
                                    onClick={() => {
                                        onAddToMyWorkouts(workout);
                                        setIsMenuOpen(false);
                                    }}
                                    className="flex items-center space-x-2 w-full text-left px-4 py-3 text-sm text-zinc-200 hover:bg-zinc-700 border-t border-zinc-700"
                                >
                                    <Icon type="plus" className="w-4 h-4 text-zinc-400"/>
                                    <span>Add to My Workouts</span>
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </header>

            <main className="flex-grow overflow-y-auto pb-24">
                <img src={workout.image} alt={workout.title} className="w-full h-60 object-cover" />

                <div className="p-4 space-y-4">
                    <div className="flex items-center space-x-2 text-amber-400">
                        <Icon type="session" className="w-5 h-5" />
                        <span className="font-bold text-lg">{workout.duration} min</span>
                    </div>
                    <p className="text-zinc-400 text-sm">{workout.description}</p>
                </div>

                <div className="space-y-6">
                    {workout.phases.map(phase => (
                        <div key={phase.id}>
                            <h2 className="font-bold text-zinc-400 uppercase tracking-wider px-4 mb-2">{phase.name}</h2>
                            <div className="space-y-4">
                                {phase.sets.map(set => (
                                    <div key={set.id}>
                                        <div className="px-4">
                                            <h3 className="font-semibold text-zinc-300">{set.name}</h3>
                                            <p className="text-xs text-zinc-500">{set.reps} Reps | {set.duration} Mins</p>
                                        </div>
                                        <div className="mt-2 space-y-px">
                                            {set.exercises.map(exercise => (
                                                <button 
                                                    key={exercise.id} 
                                                    onClick={() => onExerciseClick(exercise)}
                                                    className="flex items-center bg-zinc-900 p-3 w-full text-left hover:bg-zinc-800 transition-colors"
                                                >
                                                    <img src={exercise.image} alt={exercise.name} className="w-20 h-20 object-contain rounded-md mr-4 bg-white/5"/>
                                                    <p className="font-semibold text-zinc-200 flex-grow">{exercise.name}</p>
                                                    <Icon type="chevron-right" className="w-5 h-5 text-zinc-600"/>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <footer className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-zinc-950 to-transparent">
                <button 
                    onClick={() => onStart && onStart(workout)}
                    className="w-full bg-amber-400 hover:bg-amber-500 text-black font-bold py-4 px-4 rounded-full focus:outline-none focus:shadow-outline transition-colors duration-200 text-lg flex items-center justify-center space-x-2"
                >
                    <Icon type="workouts" className="w-6 h-6" />
                    <span>START WORKOUT</span>
                </button>
            </footer>
        </div>
    );
};

export default WorkoutDetailsPage;
