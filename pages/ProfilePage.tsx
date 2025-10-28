

import React, { useState } from 'react';
import type { User, NutritionPlan, DietIntakeItem, UserPhoto } from '../types';
import UnderDevelopmentPage from './UnderDevelopmentPage';
import Icon from '../components/Icon';
import CalendarModal from '../components/CalendarModal';
import { NUTRITION_PLANS_DATA } from '../constants';
import NutritionTracker from '../components/NutritionTracker';
import AddPhotoPage from './AddPhotoPage';

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
    onAddDietIntake: () => void;
    onEditDietIntake: (item: DietIntakeItem) => void;
    onDeleteDietIntake: (itemId: string) => void;
    additionalDietItems: DietIntakeItem[];
}

const ProfilePage: React.FC<ProfilePageProps> = ({ currentUser, onNavigate, onMenuClick, onViewPlan, onAddDietIntake, onEditDietIntake, onDeleteDietIntake, additionalDietItems }) => {
    const [activeSubTab, setActiveSubTab] = useState<ProfileSubTab>('Nutrition');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [checkedItems, setCheckedItems] = useState<Record<string, Set<string>>>({});
    
    // Photo management state
    const [isAddingPhoto, setIsAddingPhoto] = useState(false);
    const [userPhotos, setUserPhotos] = useState<UserPhoto[]>([]);
    const [editingPhoto, setEditingPhoto] = useState<UserPhoto | null>(null);


    const activePlan = NUTRITION_PLANS_DATA.find(p => p.isActive && !p.isTemplate);
    const itemsForDate = additionalDietItems.filter(item => item.date === selectedDate.toISOString().split('T')[0]);

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

    const handleOpenAddPhoto = () => {
        setEditingPhoto(null);
        setIsAddingPhoto(true);
    };

    const handleOpenEditPhoto = (photo: UserPhoto) => {
        setEditingPhoto(photo);
        setIsAddingPhoto(true);
    };
    
    const handleClosePhotoPage = () => {
        setIsAddingPhoto(false);
        setEditingPhoto(null);
    };

    const handleSavePhoto = (photoData: { src: string; type: string; date: string; description: string; }) => {
        if (editingPhoto) {
            // Update existing photo
            const updatedPhoto: UserPhoto = { ...editingPhoto, ...photoData };
            setUserPhotos(prev => prev.map(p => p.id === editingPhoto.id ? updatedPhoto : p)
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            );
        } else {
            // Add new photo
            const newPhoto: UserPhoto = {
                id: Date.now().toString(),
                ...photoData,
            };
            setUserPhotos(prev => [newPhoto, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        }
        handleClosePhotoPage();
    };

    const handleDeletePhoto = (photoId: string) => {
        if (window.confirm("Are you sure you want to delete this photo?")) {
            setUserPhotos(prev => prev.filter(p => p.id !== photoId));
        }
    };

    const renderContent = () => {
        if (activeSubTab === 'Nutrition') {
            const checkedItemsForSelectedDate = checkedItems[selectedDate.toDateString()] || new Set<string>();
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
                            onToggleItem={(itemId) => handleToggleItem(selectedDate, itemId)}
                            additionalItems={itemsForDate}
                            onEditItem={onEditDietIntake}
                            onDeleteItem={onDeleteDietIntake}
                            onToggleAdditionalItem={(itemId) => handleToggleItem(selectedDate, itemId)}
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
            return (
                <div className="p-4 space-y-6">
                    {userPhotos.length > 0 ? (
                        userPhotos.map(photo => (
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
                                        <button onClick={() => handleOpenEditPhoto(photo)} className="p-2 text-zinc-400 hover:text-amber-400 rounded-full hover:bg-zinc-800 transition-colors" aria-label="Edit photo">
                                            <Icon type="pencil" className="w-5 h-5" />
                                        </button>
                                        <button onClick={() => handleDeletePhoto(photo.id)} className="p-2 text-zinc-400 hover:text-red-500 rounded-full hover:bg-zinc-800 transition-colors" aria-label="Delete photo">
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
                            <p>No photos yet.</p>
                            <p className="text-sm">Add your first progress photo.</p>
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

    if (isAddingPhoto) {
        return <AddPhotoPage onClose={handleClosePhotoPage} onSave={handleSavePhoto} initialData={editingPhoto} />;
    }

    return (
        <>
            <CalendarModal 
                isOpen={isCalendarOpen}
                onClose={() => setIsCalendarOpen(false)}
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
            />
            <div className="w-full max-w-lg mx-auto h-full flex flex-col relative">
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
                <div className="flex-grow min-h-0 overflow-y-auto pb-28">
                    {renderContent()}
                </div>

                {/* Floating Action Button */}
                {(activeSubTab === 'Nutrition' || activeSubTab === 'Photos') && (
                    <button
                        onClick={activeSubTab === 'Nutrition' ? onAddDietIntake : handleOpenAddPhoto}
                        className="absolute bottom-24 right-6 bg-amber-500 hover:bg-amber-600 text-black rounded-full px-4 py-3 shadow-lg transition-transform hover:scale-105 flex items-center space-x-2"
                        aria-label={activeSubTab === 'Nutrition' ? "Add diet intake" : "Add photo"}
                    >
                        <Icon type="plus" className="w-6 h-6" />
                        <span className="font-semibold text-sm">
                            {activeSubTab === 'Nutrition' ? 'Add Diet' : 'Add Photo'}
                        </span>
                    </button>
                )}
            </div>
        </>
    );
};

export default ProfilePage;