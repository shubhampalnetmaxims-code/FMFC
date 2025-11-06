



import React, { useState, useMemo } from 'react';
import Icon from '../components/Icon';
import { UserPhoto, UserMeasurement, UserNote, DietIntakeItem, NutritionPlan } from '../types';
import ProgressGraphs from '../components/ProgressGraphs';
import { useToast } from '../components/ToastProvider';

interface JournalPageProps {
    onBack: () => void;
    userPhotos: UserPhoto[];
    userMeasurements: UserMeasurement[];
    userNotes: UserNote[];
    additionalDietItems: DietIntakeItem[];
    activePlan: NutritionPlan | undefined;
    checkedNutritionItems: Record<string, Set<string>>;
    onToggleNutritionItem: (itemId: string, date: Date) => void;
    onEditDietIntake: (item: DietIntakeItem) => void;
    onDeleteDietIntake: (itemId: string) => void;
    onAskAi: () => void;
}

const JournalPage: React.FC<JournalPageProps> = (props) => {
    const { onBack, userPhotos, userMeasurements, userNotes, additionalDietItems, activePlan, checkedNutritionItems, onToggleNutritionItem, onEditDietIntake, onDeleteDietIntake, onAskAi } = props;
    const { addToast } = useToast();
    const [visibleEntriesCount, setVisibleEntriesCount] = useState(5);

    const groupedData = useMemo(() => {
        const dataByDate: Record<string, {
            photos: UserPhoto[];
            measurements: UserMeasurement[];
            notes: UserNote[];
            additionalDietItems: DietIntakeItem[];
        }> = {};

        const addDate = (date: string) => {
            if (!dataByDate[date]) {
                dataByDate[date] = {
                    photos: [],
                    measurements: [],
                    notes: [],
                    additionalDietItems: [],
                };
            }
        };

        userPhotos.forEach(p => { addDate(p.date); dataByDate[p.date].photos.push(p); });
        userMeasurements.forEach(m => { addDate(m.date); dataByDate[m.date].measurements.push(m); });
        userNotes.forEach(n => { addDate(n.date); dataByDate[n.date].notes.push(n); });
        additionalDietItems.forEach(d => { addDate(d.date); dataByDate[d.date].additionalDietItems.push(d); });
        
        if (activePlan) {
            Object.keys(checkedNutritionItems).forEach(date => {
                if (checkedNutritionItems[date].size > 0) {
                    addDate(date);
                }
            });
        }

        return dataByDate;
    }, [userPhotos, userMeasurements, userNotes, additionalDietItems, checkedNutritionItems, activePlan]);

    const sortedDates = Object.keys(groupedData).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    return (
        <div className="h-full flex flex-col bg-zinc-950 text-zinc-200 relative">
            <header className="sticky top-0 bg-zinc-950/80 backdrop-blur-sm z-10 p-4 flex items-center">
                <button onClick={onBack} className="mr-4 text-zinc-400 hover:text-zinc-200">
                    <Icon type="arrow-left" />
                </button>
                <h1 className="text-xl font-bold text-zinc-100 uppercase tracking-wider">Progress</h1>
            </header>
            <main className="flex-grow overflow-y-auto">
                <ProgressGraphs
                    userMeasurements={userMeasurements}
                    additionalDietItems={additionalDietItems}
                    activePlan={activePlan}
                    checkedNutritionItems={checkedNutritionItems}
                />
                <div className="p-4 space-y-4">
                     <h2 className="text-lg font-bold text-zinc-300 mt-2">Journal Entries</h2>
                    {sortedDates.length > 0 ? sortedDates.slice(0, visibleEntriesCount).map(date => (
                        <DateEntry
                            key={date}
                            date={date}
                            data={groupedData[date]}
                            activePlan={activePlan}
                            checkedItems={checkedNutritionItems[date] || new Set()}
                            onToggleNutritionItem={(itemId) => onToggleNutritionItem(itemId, new Date(date + 'T00:00:00'))}
                            onEditDietIntake={onEditDietIntake}
                            onDeleteDietIntake={onDeleteDietIntake}
                        />
                    )) : (
                        <div className="text-center py-16 text-zinc-500">
                            <p>Your journal is empty.</p>
                            <p className="text-sm mt-1">Log photos, meals, and notes from the Profile tab to see them here.</p>
                        </div>
                    )}
                    {sortedDates.length > visibleEntriesCount && (
                        <button
                            onClick={() => setVisibleEntriesCount(prev => prev + 5)}
                            className="w-full text-center py-3 bg-zinc-800 hover:bg-zinc-700 text-sm font-semibold rounded-lg transition-colors"
                        >
                            Load More
                        </button>
                    )}
                </div>
            </main>
             <button
                onClick={onAskAi}
                className="absolute bottom-6 left-6 bg-amber-500 hover:bg-amber-600 text-black shadow-lg transition-transform hover:scale-105 flex items-center justify-center rounded-full px-4 py-3 space-x-2 z-20"
                aria-label="Ask AI"
            >
                <Icon type="sparkles" className="w-5 h-5" />
                <span className="font-semibold text-sm">Ask AI</span>
            </button>
        </div>
    );
};


// --- Sub-components for the Journal Page ---

type DateEntryData = {
    photos: UserPhoto[];
    measurements: UserMeasurement[];
    notes: UserNote[];
    additionalDietItems: DietIntakeItem[];
};

interface DateEntryProps {
    date: string;
    data: DateEntryData;
    activePlan: NutritionPlan | undefined;
    checkedItems: Set<string>;
    onToggleNutritionItem: (itemId: string) => void;
    onEditDietIntake: (item: DietIntakeItem) => void;
    onDeleteDietIntake: (itemId: string) => void;
}

const DateEntry: React.FC<DateEntryProps> = ({ date, data, activePlan, checkedItems, onToggleNutritionItem, onEditDietIntake, onDeleteDietIntake }) => {
    const tabs = ['Nutrition', 'Photos', 'Measurements', 'Notes'];
    const [activeTab, setActiveTab] = useState('Nutrition');
    const [showPlanItems, setShowPlanItems] = useState(true);

    const formatDate = (dateString: string) => {
        const entryDate = new Date(dateString + 'T00:00:00');
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        if (entryDate.toDateString() === today.toDateString()) return 'Today';
        if (entryDate.toDateString() === yesterday.toDateString()) return 'Yesterday';

        return entryDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'Nutrition':
                const planItemsToShow = showPlanItems ? (activePlan?.content || []) : [];
                const hasAnyNutritionData = planItemsToShow.length > 0 || data.additionalDietItems.length > 0;
                
                if (!hasAnyNutritionData) {
                    return <p className="text-sm text-center text-zinc-500 py-4">No nutrition data logged.</p>;
                }

                return (
                    <div>
                        <button onClick={() => setShowPlanItems(!showPlanItems)} className="flex items-center space-x-2 text-xs text-zinc-400 font-semibold mb-4 hover:text-zinc-200">
                            <Icon type={showPlanItems ? 'eye' : 'eye-off'} className="w-4 h-4"/>
                            <span>{showPlanItems ? 'Hide' : 'Show'} plan items</span>
                        </button>
                        <div className="space-y-4">
                        {planItemsToShow.map(meal => (
                            <div key={meal.mealTime}>
                                <h4 className="font-bold text-sm text-zinc-400 mb-2">{meal.mealTime}</h4>
                                {meal.items.map(item => {
                                    const itemId = `${item.name}-${item.calories}`;
                                    const isChecked = checkedItems.has(itemId);
                                    return (
                                        <div key={itemId} className="flex justify-between items-center mb-2">
                                            <div className="flex-grow mr-2">
                                                <p className="font-semibold text-zinc-200">{item.name}</p>
                                                <p className="text-xs text-zinc-400">From nutrition plan</p>
                                            </div>
                                            <div className="text-right shrink-0 flex items-center space-x-4">
                                                <div>
                                                    <p className="font-semibold text-sm text-zinc-300">(x{item.quantity}) {item.calories} Cal</p>
                                                </div>
                                                <input type="checkbox" checked={isChecked} onChange={() => onToggleNutritionItem(itemId)} className="h-5 w-5 rounded bg-zinc-700 border-zinc-600 text-amber-500 focus:ring-amber-500"/>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                        {data.additionalDietItems.length > 0 && (
                            <div>
                                 <h4 className="font-bold text-sm text-zinc-400 my-2 pt-2 border-t border-zinc-700">Added Items</h4>
                                 {data.additionalDietItems.map(item => {
                                     const isChecked = checkedItems.has(item.id);
                                     return (
                                        <div key={item.id} className="flex justify-between items-center mb-2">
                                            <div className="flex-grow mr-2">
                                                <p className="font-semibold text-zinc-200">{item.description}</p>
                                                <p className="text-xs text-zinc-400">{item.meal}</p>
                                            </div>
                                            <div className="text-right shrink-0 flex items-center space-x-4">
                                                <div>
                                                    <p className="font-semibold text-sm text-zinc-300">(x{item.quantity}) {item.energy.toFixed(0)} Cal</p>
                                                </div>
                                                <input type="checkbox" checked={isChecked} onChange={() => onToggleNutritionItem(item.id)} className="h-5 w-5 rounded bg-zinc-700 border-zinc-600 text-amber-500 focus:ring-amber-500"/>
                                            </div>
                                        </div>
                                     )
                                 })}
                            </div>
                        )}
                        </div>
                    </div>
                );
            case 'Photos':
                return data.photos.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {data.photos.map(p => <img key={p.id} src={p.src} alt={p.type} className="w-full aspect-[3/4] object-cover rounded-md"/>)}
                    </div>
                ) : <p className="text-sm text-center text-zinc-500 py-4">No photos logged.</p>;
            case 'Measurements':
                 return data.measurements.length > 0 ? (
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                        {data.measurements.map(m => Object.entries(m).map(([key, value]) => {
                            if(key === 'id' || key === 'date' || value == null) return null;
                            return <div key={key} className="flex justify-between border-b border-zinc-700 py-1"><span className="capitalize text-zinc-400">{key}</span><span className="font-semibold text-zinc-200">{value}</span></div>
                        }))}
                    </div>
                 ) : <p className="text-sm text-center text-zinc-500 py-4">No measurements logged.</p>;
            case 'Notes':
                 return data.notes.length > 0 ? (
                    <div className="space-y-2">
                        {data.notes.map(n => <p key={n.id} className="text-sm p-3 bg-zinc-800/50 rounded-md whitespace-pre-wrap">{n.content}</p>)}
                    </div>
                 ) : <p className="text-sm text-center text-zinc-500 py-4">No notes logged.</p>;
            default:
                return null;
        }
    };
    
    return (
        <div className="bg-zinc-900 text-zinc-200 rounded-2xl p-4 border border-zinc-800">
            <h2 className="font-bold text-lg mb-2">{formatDate(date)}</h2>
            <div className="flex border-b border-zinc-800 mb-4 overflow-x-auto">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-3 py-2 text-sm font-semibold transition-colors shrink-0 ${activeTab === tab ? 'text-amber-400 border-b-2 border-amber-400' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
            <div>
                {renderContent()}
            </div>
        </div>
    );
}

export default JournalPage;