
import React, { useState, useMemo } from 'react';
import Icon from '../components/Icon';
import { Workout } from '../types';
import FilterPanel from '../components/FilterPanel';
import WorkoutCard from '../components/WorkoutCard';

interface WorkoutsPageProps {
    onMenuClick: () => void;
    onToggleNotifications: () => void;
    hasUnreadNotifications: boolean;
    onViewWorkout: (workout: Workout, isMine: boolean) => void;
    myWorkouts: Workout[];
    publicWorkouts: Workout[];
    onCreateWorkout: () => void;
}

export type Filters = {
    style: string;
    muscleGroup: string;
    day: string;
    difficulty: string;
    equipment: string;
};

const WorkoutsPage: React.FC<WorkoutsPageProps> = ({ onMenuClick, onToggleNotifications, hasUnreadNotifications, onViewWorkout, myWorkouts, publicWorkouts, onCreateWorkout }) => {
    const [activeTab, setActiveTab] = useState<'Public' | 'My'>('Public');
    const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
    const [filters, setFilters] = useState<Filters>({
        style: '',
        muscleGroup: '',
        day: '',
        difficulty: '',
        equipment: '',
    });

    const filteredWorkouts = useMemo(() => {
        return publicWorkouts.filter(workout => {
            return (
                (filters.style ? workout.style === filters.style : true) &&
                (filters.muscleGroup ? workout.muscleGroup === filters.muscleGroup : true) &&
                (filters.day ? workout.day === filters.day : true) &&
                (filters.difficulty ? workout.difficulty === parseInt(filters.difficulty, 10) : true) &&
                (filters.equipment ? workout.equipment === filters.equipment : true)
            );
        });
    }, [filters, publicWorkouts]);
    
    const activeFilterCount = useMemo(() => {
        return Object.values(filters).filter(value => value !== '').length;
    }, [filters]);

    const handleApplyFilters = (newFilters: Filters) => {
        setFilters(newFilters);
        setIsFilterPanelOpen(false);
    };

    const handleClearFilters = () => {
        setFilters({
            style: '',
            muscleGroup: '',
            day: '',
            difficulty: '',
            equipment: '',
        });
    };

    return (
        <div className="w-full h-full flex flex-col relative overflow-hidden bg-zinc-950 text-zinc-200">
            <header className="sticky top-0 bg-zinc-950/80 backdrop-blur-sm z-10 shrink-0">
                <div className="flex justify-between items-center p-4">
                    <div className="w-8">
                        <button onClick={onMenuClick} className="text-zinc-400 hover:text-zinc-200">
                            <Icon type="menu" className="w-6 h-6" />
                        </button>
                    </div>
                    <h1 className="text-xl font-bold text-zinc-100 uppercase tracking-wider">Workouts</h1>
                    <div className="w-8">
                        <button onClick={onToggleNotifications} className="relative text-zinc-400 hover:text-zinc-200">
                            <Icon type="bell" className="w-6 h-6" />
                            {hasUnreadNotifications && <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-zinc-950"></span>}
                        </button>
                    </div>
                </div>
                
                {/* Tabs */}
                <div className="px-4 border-b border-zinc-800">
                    <nav className="flex space-x-6">
                        <button
                            onClick={() => setActiveTab('Public')}
                            className={`py-3 text-sm font-semibold border-b-2 transition-colors ${
                                activeTab === 'Public' ? 'border-amber-400 text-amber-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'
                            }`}
                        >
                            Public Workouts
                        </button>
                        <button
                            onClick={() => setActiveTab('My')}
                            className={`py-3 text-sm font-semibold border-b-2 transition-colors ${
                                activeTab === 'My' ? 'border-amber-400 text-amber-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'
                            }`}
                        >
                            My Workouts
                        </button>
                    </nav>
                </div>
            </header>

            {activeTab === 'Public' && (
                <div className="p-4 border-b border-zinc-800 flex items-center space-x-2 shrink-0">
                    <button
                        onClick={() => setIsFilterPanelOpen(true)}
                        className="flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                    >
                        <Icon type="search" className="w-4 h-4" />
                        <span>Filter</span>
                        {activeFilterCount > 0 && (
                            <span className="bg-amber-400 text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>
                    {activeFilterCount > 0 && (
                        <button
                            onClick={handleClearFilters}
                            className="flex items-center space-x-1 px-3 py-2 rounded-full text-sm font-semibold transition-colors bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"
                        >
                            <Icon type="x" className="w-4 h-4" />
                            <span>Clear</span>
                        </button>
                    )}
                </div>
            )}

            <main className="flex-grow overflow-y-auto p-4">
                {activeTab === 'Public' ? (
                    filteredWorkouts.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4">
                            {filteredWorkouts.map(workout => (
                                <WorkoutCard 
                                    key={workout.id} 
                                    workout={workout} 
                                    onViewWorkout={(w) => onViewWorkout(w, false)} 
                                />
                            ))}
                        </div>
                    ) : (
                         <div className="text-center py-16 text-zinc-500">
                            <p>No workouts match your filters.</p>
                        </div>
                    )
                ) : (
                    <div className="space-y-4">
                        <button 
                            onClick={onCreateWorkout}
                            className="w-full py-6 border-2 border-dashed border-zinc-800 rounded-xl text-zinc-500 hover:border-amber-500/50 hover:bg-zinc-900 hover:text-amber-500 transition-colors flex flex-col items-center justify-center gap-2 group"
                        >
                            <div className="p-3 bg-zinc-900 rounded-full group-hover:bg-zinc-800 transition-colors">
                                <Icon type="plus" className="w-6 h-6" />
                            </div>
                            <span className="font-semibold">Create New Workout</span>
                        </button>
                        
                        <h3 className="text-sm font-semibold text-zinc-400 px-1">Your Library</h3>
                        {myWorkouts.length > 0 ? (
                            <div className="grid grid-cols-2 gap-4">
                                {myWorkouts.map(workout => (
                                    <WorkoutCard 
                                        key={workout.id} 
                                        workout={workout} 
                                        onViewWorkout={(w) => onViewWorkout(w, true)} 
                                    />
                                ))}
                            </div>
                        ) : (
                             <div className="text-center py-8 text-zinc-500">
                                <p>You haven't created any workouts yet.</p>
                            </div>
                        )}
                    </div>
                )}
            </main>

            <FilterPanel
                isOpen={isFilterPanelOpen}
                onClose={() => setIsFilterPanelOpen(false)}
                currentFilters={filters}
                onApplyFilters={handleApplyFilters}
            />
        </div>
    );
};

export default WorkoutsPage;
