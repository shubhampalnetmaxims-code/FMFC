

import React, { useState, useMemo } from 'react';
import Icon from '../components/Icon';
import { WORKOUTS_DATA } from '../constants';
import { Workout } from '../types';
import FilterPanel from '../components/FilterPanel';
import WorkoutCard from '../components/WorkoutCard';

interface WorkoutsPageProps {
    onMenuClick: () => void;
    onToggleNotifications: () => void;
    hasUnreadNotifications: boolean;
    onViewWorkout: (workout: Workout) => void;
}

export type Filters = {
    style: string;
    muscleGroup: string;
    day: string;
    difficulty: string;
    equipment: string;
};

const WorkoutsPage: React.FC<WorkoutsPageProps> = ({ onMenuClick, onToggleNotifications, hasUnreadNotifications, onViewWorkout }) => {
    const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
    const [filters, setFilters] = useState<Filters>({
        style: '',
        muscleGroup: '',
        day: '',
        difficulty: '',
        equipment: '',
    });

    const filteredWorkouts = useMemo(() => {
        return WORKOUTS_DATA.filter(workout => {
            return (
                (filters.style ? workout.style === filters.style : true) &&
                (filters.muscleGroup ? workout.muscleGroup === filters.muscleGroup : true) &&
                (filters.day ? workout.day === filters.day : true) &&
                (filters.difficulty ? workout.difficulty === parseInt(filters.difficulty, 10) : true) &&
                (filters.equipment ? workout.equipment === filters.equipment : true)
            );
        });
    }, [filters]);

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
        <div className="w-full h-full flex flex-col relative overflow-hidden">
            <header className="sticky top-0 bg-zinc-950/80 backdrop-blur-sm z-10 p-4 shrink-0">
                <div className="flex justify-between items-center">
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
            </header>

            <div className="p-4 border-b border-zinc-800 flex items-center space-x-2">
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

            <main className="flex-grow overflow-y-auto p-4">
                <div className="grid grid-cols-2 gap-4">
                    {filteredWorkouts.map(workout => (
                        <WorkoutCard key={workout.id} workout={workout} onViewWorkout={onViewWorkout} />
                    ))}
                </div>
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