
import React, { useState, useEffect } from 'react';
import Icon from './Icon';
import { WORKOUT_STYLES, MUSCLE_GROUPS, WORKOUT_DAYS, WORKOUT_DIFFICULTIES, EQUIPMENT_TYPES } from '../constants';
import { Filters } from '../pages/WorkoutsPage';

interface FilterPanelProps {
    isOpen: boolean;
    onClose: () => void;
    currentFilters: Filters;
    onApplyFilters: (newFilters: Filters) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ isOpen, onClose, currentFilters, onApplyFilters }) => {
    const [localFilters, setLocalFilters] = useState<Filters>(currentFilters);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setLocalFilters(currentFilters);
            setIsAnimating(true);
        } else {
            // Delay removal for animation
            const timer = setTimeout(() => setIsAnimating(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen, currentFilters]);

    const handleFilterChange = (key: keyof Filters, value: string) => {
        setLocalFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleResetFilter = (key: keyof Filters) => {
        setLocalFilters(prev => ({ ...prev, [key]: '' }));
    };

    const handleResetAll = () => {
        setLocalFilters({
            style: '',
            muscleGroup: '',
            day: '',
            difficulty: '',
            equipment: '',
        });
    };

    const activeFilterCount = Object.values(localFilters).filter(v => v !== '').length;

    if (!isAnimating) return null;

    return (
        <>
            <div
                className={`absolute inset-0 bg-black/60 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
            />
            <div className={`absolute bottom-0 left-0 right-0 w-full bg-black border-t border-zinc-800 shadow-xl z-50 flex flex-col rounded-t-2xl ${isOpen ? 'animate-slide-in-bottom' : 'animate-slide-out-bottom'}`}>
                <header className="flex items-center justify-between p-4 border-b border-zinc-700 shrink-0">
                    <h2 className="text-lg font-bold text-white">Filter by</h2>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
                        <Icon type="x" className="w-6 h-6" />
                    </button>
                </header>

                <main className="flex-grow overflow-y-auto p-6 space-y-6">
                    <FilterDropdown label="Style" value={localFilters.style} onChange={val => handleFilterChange('style', val)} onReset={() => handleResetFilter('style')} options={WORKOUT_STYLES} />
                    <FilterDropdown label="Muscle Group" value={localFilters.muscleGroup} onChange={val => handleFilterChange('muscleGroup', val)} onReset={() => handleResetFilter('muscleGroup')} options={MUSCLE_GROUPS} />
                    <FilterDropdown label="Day" value={localFilters.day} onChange={val => handleFilterChange('day', val)} onReset={() => handleResetFilter('day')} options={WORKOUT_DAYS} />
                    <FilterDropdown label="Difficulty" value={localFilters.difficulty} onChange={val => handleFilterChange('difficulty', val)} onReset={() => handleResetFilter('difficulty')} options={WORKOUT_DIFFICULTIES.map(String)} />
                    <FilterDropdown label="Equipment" value={localFilters.equipment} onChange={val => handleFilterChange('equipment', val)} onReset={() => handleResetFilter('equipment')} options={EQUIPMENT_TYPES} />
                </main>

                <footer className="p-4 border-t border-zinc-700 grid grid-cols-2 gap-4 shrink-0">
                    <button
                        onClick={handleResetAll}
                        className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold py-3 px-4 rounded-lg"
                    >
                        Reset All
                    </button>
                    <button
                        onClick={() => onApplyFilters(localFilters)}
                        className="w-full bg-amber-400 hover:bg-amber-500 text-black font-bold py-3 px-4 rounded-lg"
                    >
                        Apply Filters ({activeFilterCount})
                    </button>
                </footer>
            </div>
        </>
    );
};

interface FilterDropdownProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    onReset: () => void;
    options: string[];
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ label, value, onChange, onReset, options }) => (
    <div>
        <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-semibold text-zinc-300">{label}</label>
            {value && <button onClick={onReset} className="text-xs font-semibold text-zinc-500 hover:text-amber-400">Reset</button>}
        </div>
        <div className="relative">
            <select
                value={value}
                onChange={e => onChange(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-sm text-zinc-300 focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none"
            >
                <option value="">All</option>
                {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-400">
                <Icon type="chevron-down" className="w-4 h-4" />
            </div>
        </div>
    </div>
);

export default FilterPanel;