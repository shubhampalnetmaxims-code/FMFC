

import React, { useState } from 'react';
import type { User, NutritionPlan, DietIntakeItem, UserPhoto, UserNote, UserMeasurement } from '../types';
import UnderDevelopmentPage from './UnderDevelopmentPage';
import Icon from '../components/Icon';
import CalendarModal from '../components/CalendarModal';
import { NUTRITION_PLANS_DATA } from '../constants';
import NutritionTracker from '../components/NutritionTracker';

type ProfileSubTab = 'Nutrition' | 'Photos' | 'Measurements' | 'Notes';

const SUB_TABS: { id: ProfileSubTab, icon: any }[] = [
    { id: 'Nutrition', icon: 'fire' },
    { id: 'Photos', icon: 'photo' },
    { id: 'Measurements', icon: 'pencil' },
    { id: 'Notes', icon: 'note' }
];

interface ProfilePageProps {
    currentUser: User;
    onNavigate: (pageName: string) => void;
    onMenuClick: () => void;
    onViewPlan: (plan: NutritionPlan) => void;
    onAddDietIntake: (date: Date) => void;
    onEditDietIntake: (item: DietIntakeItem) => void;
    onDeleteDietIntake: (itemId: string) => void;
    additionalDietItems: DietIntakeItem[];
    userNotes: UserNote[];
    onAddNote: (date: Date) => void;
    onEditNote: (note: UserNote) => void;
    onDeleteNote: (noteId: string) => void;
    userMeasurements: UserMeasurement[];
    onAddMeasurement: (date: Date) => void;
    onEditMeasurement: (measurement: UserMeasurement) => void;
    onDeleteMeasurement: (measurementId: string) => void;
    userPhotos: UserPhoto[];
    onAddPhoto: (date: Date) => void;
    onEditPhoto: (photo: UserPhoto) => void;
    onDeletePhoto: (photoId: string) => void;
    onComparePhotos: () => void;
    checkedNutritionItems: Record<string, Set<string>>;
    onToggleNutritionItem: (itemId: string, date: Date) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ 
    currentUser, 
    onNavigate, 
    onMenuClick, 
    onViewPlan, 
    onAddDietIntake, 
    onEditDietIntake, 
    onDeleteDietIntake, 
    additionalDietItems,
    userNotes,
    onAddNote,
    onEditNote,
    onDeleteNote,
    userMeasurements,
    onAddMeasurement,
    onEditMeasurement,
    onDeleteMeasurement,
    userPhotos,
    onAddPhoto,
    onEditPhoto,
    onDeletePhoto,
    onComparePhotos,
    checkedNutritionItems,
    onToggleNutritionItem,
}) => {
    const [activeSubTab, setActiveSubTab] = useState<ProfileSubTab>('Photos');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    const activePlan = NUTRITION_PLANS_DATA.find(p => p.isActive && !p.isTemplate);
    const dateKey = new Date(selectedDate.getTime() - (selectedDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
    const itemsForDate = additionalDietItems.filter(item => item.date === dateKey);

    const renderContent = () => {
        if (activeSubTab === 'Nutrition') {
            const checkedItemsForSelectedDate = checkedNutritionItems[dateKey] || new Set<string>();
            return (
                <div className="p-4 space-y-6">
                     {activePlan && <button
                        onClick={() => onViewPlan(activePlan)}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors bg-zinc-800 hover:bg-zinc-700 text-amber-300 border border-zinc-700"
                    >
                        <Icon type="note" className="w-5 h-5" />
                        <span>View Active Plan</span>
                    </button>}
                    {activePlan ? (
                        <NutritionTracker
                            plan={activePlan}
                            checkedItems={checkedItemsForSelectedDate}
                            onToggleItem={(itemId) => onToggleNutritionItem(itemId, selectedDate)}
                            additionalItems={itemsForDate}
                            onEditItem={onEditDietIntake}
                            onDeleteItem={onDeleteDietIntake}
                        />
                    ) : (
                         <div className="text-center py-8 text-zinc-500">
                            <p>No active nutrition plan.</p>
                             <button
                                onClick={() => onNavigate('My Nutrition Plans')}
                                className="mt-4 text-sm font-semibold text-amber-400 hover:text-amber-300 underline"
                            >
                                Activate a plan from your Nutrition Plans
                            </button>
                        </div>
                    )}
                </div>
            );
        }

        if (activeSubTab === 'Photos') {
            const photosForDate = userPhotos.filter(photo => photo.date === dateKey);
            return (
                <div className="p-4 space-y-6">
                    {photosForDate.length > 0 ? (
                        photosForDate.map(photo => (
                            <div key={photo.id} className="bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800">
                                <div className="p-4 flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold text-lg text-zinc-100">{photo.type}</h3>
                                        <p className="text-sm text-zinc-400">
                                            {new Date(photo.date + 'T00:00:00').toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button onClick={() => onEditPhoto(photo)} className="p-2 text-zinc-400 hover:text-amber-400 rounded-full hover:bg-zinc-800 transition-colors" aria-label="Edit photo">
                                            <Icon type="pencil" className="w-5 h-5" />
                                        </button>
                                        <button onClick={() => onDeletePhoto(photo.id)} className="p-2 text-zinc-400 hover:text-amber-400 rounded-full hover:bg-zinc-800 transition-colors" aria-label="Delete photo">
                                            <Icon type="trash" className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                                <img src={photo.src} alt={`${photo.type} - ${photo.date}`} className="w-full h-auto" />
                                {photo.description && (
                                    <div className="p-4 border-t border-zinc-800">
                                        <p className="text-sm text-zinc-300">{photo.description}</p>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-16 text-zinc-500">
                            <p>No photos for this day.</p>
                            <p className="text-sm">Add your first progress photo for this date.</p>
                        </div>
                    )}
                </div>
            );
        }

        if (activeSubTab === 'Notes') {
            const notesForDate = userNotes.filter(note => note.date === dateKey);
            return (
                <div className="p-4 space-y-4">
                    {notesForDate.length > 0 ? (
                        notesForDate.map(note => (
                            <div key={note.id} className="bg-zinc-900 p-4 rounded-lg border border-zinc-800">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm text-zinc-400">
                                            {new Date(note.date + 'T00:00:00').toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </p>
                                        <p className="text-zinc-200 mt-2 whitespace-pre-wrap">{note.content}</p>
                                    </div>
                                    <div className="flex items-center space-x-2 shrink-0 ml-4">
                                        <button onClick={() => onEditNote(note)} className="p-2 text-zinc-400 hover:text-amber-400 rounded-full hover:bg-zinc-800 transition-colors" aria-label="Edit note">
                                            <Icon type="pencil" className="w-5 h-5" />
                                        </button>
                                        <button onClick={() => onDeleteNote(note.id)} className="p-2 text-zinc-400 hover:text-amber-400 rounded-full hover:bg-zinc-800 transition-colors" aria-label="Delete note">
                                            <Icon type="trash" className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-16 text-zinc-500">
                            <p>No notes for this day.</p>
                            <p className="text-sm">Add your first note for this date.</p>
                        </div>
                    )}
                </div>
            );
        }
        
        if (activeSubTab === 'Measurements') {
            const selectedDateKey = dateKey;
            const latestMeasurement = [...userMeasurements]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .find(m => m.date <= selectedDateKey);
            
            let tagText = '';
            if (latestMeasurement) {
                const measurementDate = new Date(latestMeasurement.date);
                const selectedD = new Date(selectedDate);
                measurementDate.setUTCHours(0, 0, 0, 0);
                selectedD.setUTCHours(0, 0, 0, 0);

                const diffTime = selectedD.getTime() - measurementDate.getTime();
                const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
                
                if (diffDays === 1) {
                    tagText = 'Data from yesterday';
                } else if (diffDays > 1) {
                    tagText = `Data from ${diffDays} days ago`;
                }
            }

            const measurementLabels: { [key: string]: { label: string; unit: string } } = {
                weight: { label: 'Weight', unit: 'kg' },
                height: { label: 'Height', unit: 'cm' },
                chest: { label: 'Chest', unit: 'in' },
                waist: { label: 'Waist', unit: 'in' },
                hips: { label: 'Hips', unit: 'in' },
                neck: { label: 'Neck', unit: 'in' },
                thigh: { label: 'Thigh', unit: 'in' },
                biceps: { label: 'Biceps', unit: 'in' },
                triceps: { label: 'Triceps', unit: 'in' },
                subscapular: { label: 'Subscapular', unit: 'mm' },
                suprailiac: { label: 'Suprailiac', unit: 'mm' },
                bodyfat: { label: 'Body fat', unit: '%' },
            };

            return (
                 <div className="p-4 space-y-4">
                    {latestMeasurement ? (
                        <div key={latestMeasurement.id} className="bg-[#F3EADF] p-4 rounded-lg text-zinc-800">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-bold text-lg">Measurements</h3>
                                    {tagText && (
                                        <div className="text-xs text-zinc-500 font-medium mt-1 bg-zinc-800/10 px-2 py-0.5 rounded-full inline-block">
                                            {tagText}
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button onClick={() => onAddMeasurement(selectedDate)} className="p-2 text-zinc-600 hover:text-black rounded-full hover:bg-black/10 transition-colors" aria-label="Edit measurements">
                                        <Icon type="pencil" className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => onDeleteMeasurement(latestMeasurement.id)} className="p-2 text-zinc-600 hover:text-black rounded-full hover:bg-black/10 transition-colors" aria-label="Delete measurements">
                                        <Icon type="trash" className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                {Object.entries(latestMeasurement).map(([key, value]) => {
                                    if (key === 'id' || key === 'date' || value === null || value === undefined) return null;
                                    const config = measurementLabels[key];
                                    if (!config) return null;
                                    return (
                                        <div key={key} className="flex justify-between border-b border-zinc-300 py-1">
                                            <span className="text-sm text-zinc-600">{config.label}</span>
                                            <span className="font-semibold">{value} {config.unit}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-16 text-zinc-500">
                            <p>No measurements recorded yet.</p>
                            <p className="text-sm mt-1">Add your first measurement entry to get started.</p>
                        </div>
                    )}
                 </div>
            );
        }
        
        return <UnderDevelopmentPage pageName={activeSubTab} onMenuClick={onMenuClick} showHeader={false} />;
    };

    const formatDate = (date: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const compareDate = new Date(date);
        compareDate.setHours(0, 0, 0, 0);

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
    
    const renderFAB = () => {
        if (activeSubTab === 'Photos') {
            return (
                <div className="absolute bottom-24 right-6 flex flex-col items-end space-y-3">
                     <button
                        onClick={onComparePhotos}
                        className="bg-zinc-700 hover:bg-zinc-600 text-amber-300 shadow-lg transition-transform hover:scale-105 flex items-center justify-center rounded-full px-4 py-3 space-x-2"
                        aria-label="Compare Photos"
                    >
                        <Icon type="refresh" className="w-5 h-5" />
                        <span className="font-semibold text-sm">Compare</span>
                    </button>
                    <button
                        onClick={() => onAddPhoto(selectedDate)}
                        className="bg-amber-500 hover:bg-amber-600 text-black shadow-lg transition-transform hover:scale-105 flex items-center justify-center rounded-full px-4 py-3 space-x-2"
                        aria-label="Add photo"
                    >
                        <Icon type="plus" className="w-6 h-6" />
                        <span className="font-semibold text-sm">Add Photo</span>
                    </button>
                </div>
            );
        }

        const fabConfig = {
            'Nutrition': { onClick: () => onAddDietIntake(selectedDate), label: 'Add Diet', isCompact: false },
            'Measurements': { onClick: () => onAddMeasurement(selectedDate), label: 'Add Measurement', isCompact: false },
            'Notes': { onClick: () => onAddNote(selectedDate), label: 'Add Note', isCompact: true },
        }[activeSubTab];

        if (!fabConfig) return null;

        return (
            <button
                onClick={fabConfig.onClick}
                className={`absolute bottom-24 right-6 bg-amber-500 hover:bg-amber-600 text-black shadow-lg transition-transform hover:scale-105 flex items-center justify-center ${
                    fabConfig.isCompact ? 'rounded-full w-16 h-16' : 'rounded-full px-4 py-3 space-x-2'
                }`}
                aria-label={fabConfig.label}
            >
                <Icon type="plus" className="w-6 h-6" />
                {!fabConfig.isCompact && <span className="font-semibold text-sm">{fabConfig.label}</span>}
            </button>
        );
    };

    return (
        <>
            <CalendarModal 
                isOpen={isCalendarOpen}
                onClose={() => setIsCalendarOpen(false)}
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
            />
            <div className="w-full h-full flex flex-col relative">
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
                    <nav className="flex justify-around items-start text-center py-4">
                        {SUB_TABS.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveSubTab(tab.id)}
                                className="flex flex-col items-center space-y-2 w-20"
                            >
                                <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors duration-200 ${
                                    activeSubTab === tab.id
                                    ? 'bg-amber-400'
                                    : 'bg-zinc-800 hover:bg-zinc-700'
                                }`}>
                                    <Icon type={tab.icon} className={`w-7 h-7 ${
                                        activeSubTab === tab.id
                                        ? 'text-black'
                                        : 'text-zinc-400'
                                    }`} />
                                </div>
                                <span className={`text-xs font-semibold transition-colors duration-200 ${
                                    activeSubTab === tab.id
                                    ? 'text-amber-400'
                                    : 'text-zinc-500'
                                }`}>
                                    {tab.id}
                                </span>
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content */}
                <div className="flex-grow min-h-0 overflow-y-auto">
                    {renderContent()}
                </div>

                {/* Floating Action Buttons */}
                {renderFAB()}
            </div>
        </>
    );
};

export default ProfilePage;