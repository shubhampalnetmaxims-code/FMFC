
import React, { useState } from 'react';
import { NUTRITION_PLANS_DATA } from '../constants';
import { NutritionPlan } from '../types';
import Icon from '../components/Icon';
import NutritionPlanDetailsPage from './NutritionPlanDetailsPage';

interface NutritionPageProps {
    onBack: () => void;
}

const NutritionPage: React.FC<NutritionPageProps> = ({ onBack }) => {
    const [plans, setPlans] = useState(NUTRITION_PLANS_DATA);
    const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);

    const activePlan = plans.find(p => p.isActive && !p.isTemplate);
    const templates = plans.filter(p => p.isTemplate);

    const handleSelectPlan = (id: number) => {
        setSelectedPlanId(id);
    };

    // Note: State management for activating/deactivating is for demonstration.
    const handleDeactivatePlan = (id: number) => {
        alert("Deactivating plans is not yet implemented.");
    };
    
    const handleActivatePlan = (id: number) => {
        alert("Activating plans is not yet implemented.");
    };


    if (selectedPlanId) {
        const selectedPlan = plans.find(p => p.id === selectedPlanId);
        if (selectedPlan) {
            return <NutritionPlanDetailsPage plan={selectedPlan} onBack={() => setSelectedPlanId(null)} />;
        }
    }

    return (
        <div className="h-full flex flex-col bg-zinc-900 text-zinc-800">
            <header className="sticky top-0 bg-zinc-950/80 backdrop-blur-sm z-10 p-4 flex items-center">
                 <button onClick={onBack} className="mr-4 text-zinc-400 hover:text-zinc-200">
                    <Icon type="arrow-left" />
                </button>
                <h1 className="text-xl font-bold text-zinc-100 uppercase tracking-wider">My Nutrition Plans</h1>
            </header>

            <main className="flex-grow overflow-y-auto p-4 space-y-6">
                {activePlan ? (
                    <div>
                        <h2 className="text-lg font-semibold text-zinc-300 mb-2 px-2">Active Plan</h2>
                        <div onClick={() => handleSelectPlan(activePlan.id)} className="bg-[#F3EADF] p-6 rounded-2xl shadow-md cursor-pointer active:scale-[0.98] transition-transform">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold">{activePlan.name}</h3>
                                    <p className="text-zinc-600 mt-1">{activePlan.description}</p>
                                </div>
                                <button onClick={(e) => { e.stopPropagation(); alert('More options coming soon!')}} className="text-zinc-500 hover:text-zinc-800 p-1 -mr-1 -mt-1">
                                    <Icon type="dots-horizontal" className="w-6 h-6"/>
                                </button>
                            </div>
                            <div className="text-right mt-4">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleDeactivatePlan(activePlan.id); }}
                                    className="px-4 py-2 text-sm font-semibold border border-zinc-400 rounded-full hover:bg-zinc-200/50 transition-colors"
                                >
                                    Deactivate this plan
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8 text-zinc-500 bg-zinc-800/50 rounded-lg">
                        <p>No active nutrition plan.</p>
                        <p className="text-sm">Activate a plan from the templates below.</p>
                    </div>
                )}

                <div>
                    <h2 className="text-lg font-semibold text-zinc-300 mb-2 px-2">Templates</h2>
                    <div className="space-y-4">
                        {templates.map(template => (
                            <div key={template.id} className="bg-[#F3EADF] p-4 rounded-2xl shadow-md">
                                <div className="flex justify-between items-start">
                                    <div className="cursor-pointer flex-grow mr-4" onClick={() => handleSelectPlan(template.id)}>
                                        <h3 className="text-lg font-bold">{template.name}</h3>
                                        <p className="text-zinc-600 text-sm mt-1">{template.description}</p>
                                    </div>
                                    <button 
                                        onClick={() => handleActivatePlan(template.id)}
                                        className="text-sm font-semibold bg-amber-400 text-black px-4 py-2 rounded-full hover:bg-amber-500 transition-colors whitespace-nowrap self-center"
                                    >
                                        Use this plan
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default NutritionPage;
