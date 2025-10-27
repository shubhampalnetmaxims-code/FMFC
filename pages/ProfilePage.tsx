


import React, { useState } from 'react';
import type { User, NutritionPlan } from '../types';
import UnderDevelopmentPage from './UnderDevelopmentPage';
import Icon from '../components/Icon';
import CalendarModal from '../components/CalendarModal';
import { NUTRITION_PLANS_DATA } from '../constants';
import NutritionTracker from '../components/NutritionTracker';

type ProfileSubTab = 'Nutrition' | 'Photos' | 'Measurements' | 'Notes';

const SUB_TABS: ProfileSubTab[] = ['Nutrition', 'Photos', 'Measurements', 'Notes'];

interface ProfilePageProps {
    currentUser: User;
    onNavigate: (pageName: string) => void;
    onMenuClick: () => void;
    onViewPlan: (plan: NutritionPlan) => void;
    onAddDietIntake: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ currentUser, onNavigate, onMenuClick, onViewPlan, onAddDietIntake }) => {
    const [activeSubTab, setActiveSubTab] = useState<ProfileSubTab>('Nutrition');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [checkedItems, setCheckedItems] = useState<Record<string, Set<string>>>({});

    const activePlan = NUTRITION_PLANS_DATA.find(p => p.isActive && !p.isTemplate);

    const handleToggleItem = (date: Date, itemId: string) => {
        const dateKey = date.toDateString();
        setCheckedItems(prev => {
            const newCheckedItems = { ...prev };
            const itemsForDate = new Set(newCheckedItems[dateKey] || []);
            if (itemsForDate.has(itemId)) {
                itemsForDate.delete(itemId);
            } else {
                itemsForDate.add(itemId);
            }
            newCheckedItems[dateKey] = itemsForDate;
            return newCheckedItems;
        });
    };

    const renderContent = () => {
        if (activeSubTab === 'Nutrition') {
            if (activePlan) {
                const checkedItemsForSelectedDate = checkedItems[selectedDate.toDateString()] || new Set<string>();
                return (
                    <div className="p-4 space-y-6">
                         <button
                            onClick={() => onViewPlan(activePlan)}
                            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors bg-zinc-800 hover:bg-zinc-700 text-amber-300 border border-zinc-700"
                        >
                            <Icon type="note" className="w-5 h-5" />
                            <span>View Active Plan</span>
                        </button>
                        <NutritionTracker
                            plan={activePlan}
                            checkedItems={checkedItemsForSelectedDate}
                            onToggleItem={(itemId) => handleToggleItem(selectedDate, itemId)}
                        />
                        <button
                            onClick={onAddDietIntake}
                            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors bg-zinc-800 hover:bg-zinc-700 text-amber-300 border border-zinc-700 mt-4"
                        >
                            <Icon type="plus" className="w-5 h-5" />
                            <span>Add diet intake</span>
                        </button>
                    </div>
                );
            }
            return (
                <div className="text-center py-16 text-zinc-500 px-4">
                    <p>No active nutrition plan.</p>
                    <button
                        onClick={() => onNavigate('My Nutrition Plans')}
                        className="mt-4 text-sm font-semibold text-amber-400 hover:text-amber-300 underline"
                    >
                        Activate a plan from your Nutrition Plans
                    </button>
                </div>
            );
        }
        
        return <UnderDevelopmentPage pageName={activeSubTab} onMenuClick={onMenuClick} showHeader={false} />;
    };

    const formatDate = (date: Date) => {
        const today = new Date();
        if (date.toDateString() === today.toDateString()) {
            return "Today";
        }
        
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const handlePrevDay = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() - 1);
        setSelectedDate(newDate);
    };

    const handleNextDay = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + 1);
        setSelectedDate(newDate);
    };

    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
        setIsCalendarOpen(false);
    };

    return (
        <>
            <CalendarModal 
                isOpen={isCalendarOpen}
                onClose={() => setIsCalendarOpen(false)}
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
            />
            <div className="w-full max-w-lg mx-auto h-full flex flex-col">
                {/* Header */}
                 <header className="p-4 pt-6 space-y-3">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex-1 flex justify-start">
                            <button onClick={onMenuClick} className="text-zinc-400 hover:text-zinc-200 p-2 -ml-2">
                                <Icon type="menu" className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="flex-1 text-center">
                            <h1 className="text-2xl font-bold text-zinc-100">{currentUser.name}</h1>
                        </div>
                        <div className="flex-1 flex justify-end items-center space-x-2">
                            <button
                                onClick={() => onNavigate('Progress')}
                                className="flex items-center space-x-2 px-3 py-1.5 rounded-full hover:bg-zinc-800 transition-colors"
                                aria-label="View Progress"
                            >
                                <span className="text-sm font-semibold text-amber-400">Progress</span>
                                <Icon type="bolt" className="w-5 h-5 text-amber-400"/>
                            </button>
                            <button className="relative text-zinc-400 hover:text-zinc-200 p-2 -mr-2">
                                <Icon type="bell" className="w-6 h-6" />
                                <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-zinc-950"></span>
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center justify-center space-x-4">
                        <button onClick={handlePrevDay} className="p-2 rounded-full hover:bg-zinc-800 transition-colors" aria-label="Previous day">
                            <Icon type="arrow-left" className="w-5 h-5 text-zinc-400"/>
                        </button>
                        <button
                            onClick={() => setIsCalendarOpen(true)}
                            className="text-lg font-semibold text-amber-400 min-w-[180px] text-center hover:bg-zinc-800/50 rounded-md py-1 transition-colors"
                        >
                            {formatDate(selectedDate)}
                        </button>
                        <button onClick={handleNextDay} className="p-2 rounded-full hover:bg-zinc-800 transition-colors" aria-label="Next day">
                            <Icon type="arrow-right" className="w-5 h-5 text-zinc-400"/>
                        </button>
                    </div>
                </header>

                {/* Sub-navigation */}
                <div className="border-b border-zinc-800 px-4">
                    <nav className="flex justify-between">
                        {SUB_TABS.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveSubTab(tab)}
                                className={`py-3 px-1 text-sm font-semibold transition-colors duration-200 w-full ${
                                    activeSubTab === tab
                                    ? 'text-amber-400 border-b-2 border-amber-400'
                                    : 'text-zinc-500 hover:text-zinc-300 border-b-2 border-transparent'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content */}
                <div className="flex-grow min-h-0 overflow-y-auto">
                    {renderContent()}
                </div>
            </div>
        </>
    );
};

export default ProfilePage;