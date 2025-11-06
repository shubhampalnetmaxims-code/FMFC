


import React from 'react';
import Icon from '../components/Icon';
import { UserMeasurement, DietIntakeItem, NutritionPlan, UserPhoto, UserNote } from '../types';
import ProgressGraphs from '../components/ProgressGraphs';
import ProgressTimeline from '../components/ProgressTimeline';

interface JournalPageProps {
    onBack: () => void;
    userMeasurements: UserMeasurement[];
    additionalDietItems: DietIntakeItem[];
    activePlan: NutritionPlan | undefined;
    checkedNutritionItems: Record<string, Set<string>>;
    userPhotos: UserPhoto[];
    userNotes: UserNote[];
    onShareProgress: (data: {
        before: UserPhoto;
        after: UserPhoto;
        generatedImage: string;
        description: string;
    }) => void;
    onAskAi: () => void;
}

const JournalPage: React.FC<JournalPageProps> = (props) => {
    const { onBack, userMeasurements, additionalDietItems, activePlan, checkedNutritionItems, onAskAi, userPhotos, userNotes, onShareProgress } = props;

    return (
        <div className="h-full flex flex-col bg-zinc-950 text-zinc-200 relative">
            <header className="sticky top-0 bg-zinc-950/80 backdrop-blur-sm z-10 p-4 flex items-center">
                <button onClick={onBack} className="mr-4 text-zinc-400 hover:text-zinc-200">
                    <Icon type="arrow-left" />
                </button>
                <h1 className="text-xl font-bold text-zinc-100 uppercase tracking-wider">Progress</h1>
            </header>
            <main className="flex-grow overflow-y-auto pb-24">
                <ProgressGraphs
                    userMeasurements={userMeasurements}
                    additionalDietItems={additionalDietItems}
                    activePlan={activePlan}
                    checkedNutritionItems={checkedNutritionItems}
                />
                <ProgressTimeline userPhotos={userPhotos} userNotes={userNotes} onShare={onShareProgress} />
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

export default JournalPage;