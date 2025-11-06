

import React from 'react';
import { NutritionPlan } from '../types';
import Icon from '../components/Icon';
import { useToast } from '../components/ToastProvider';

interface NutritionPageProps {
    onBack: () => void;
    plans: NutritionPlan[];
    onViewPlan: (plan: NutritionPlan) => void;
    onActivatePlan: (planId: number) => void;
}

const NutritionPage: React.FC<NutritionPageProps> = ({ onBack, plans, onViewPlan, onActivatePlan }) => {
    const { addToast } = useToast();
    
    const activePlan = plans.find(p => p.isActive && !p.isTemplate);
    const templates = plans.filter(p => p.isTemplate);

    return (
        <div className="h-full flex flex-col bg-zinc-950 text-zinc-200">
            <header className="sticky top-0 bg-zinc-950/80 backdrop-blur-sm z-10 p-4 flex items-center">
                 <button onClick={onBack} className="mr-4 text-zinc-400 hover:text-zinc-200">
                    <Icon type="arrow-left" />
                </button>
                <h1 className="text-xl font-bold text-zinc-100 uppercase tracking-wider">My Nutrition Plans</h1>
            </header>

            <main className="flex-grow overflow-y-auto p-4 space-y-8">
                {/* Active Plan Section */}
                <div>
                    <h2 className="text-lg font-semibold text-zinc-300 mb-3 px-2">Active Plan</h2>
                    {activePlan ? (
                        <div 
                            onClick={() => onViewPlan(activePlan)} 
                            className="bg-zinc-900 border-2 border-amber-400 p-4 rounded-xl shadow-lg cursor-pointer transition-transform active:scale-[0.99] relative"
                        >
                            <span className="absolute top-3 right-3 text-xs font-bold bg-amber-400 text-black px-2 py-0.5 rounded-full">ACTIVE</span>
                            <h3 className="text-xl font-bold text-amber-300">{activePlan.name}</h3>
                            <p className="text-zinc-400 mt-1 text-sm">{activePlan.description}</p>
                            <div className="flex justify-between items-baseline mt-4 border-t border-zinc-700 pt-3">
                                <span className="text-zinc-500 text-sm font-medium">Energy</span>
                                <span className="font-bold text-white">{activePlan.totals.energy.toLocaleString()} Cal</span>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-10 text-zinc-500 bg-zinc-900 border border-zinc-800 rounded-lg">
                            <p>No active nutrition plan.</p>
                            <p className="text-sm mt-1">Activate a plan from the templates below.</p>
                        </div>
                    )}
                </div>

                {/* Templates Section */}
                <div>
                    <h2 className="text-lg font-semibold text-zinc-300 mb-3 px-2">Plan Templates</h2>
                    <div className="space-y-4">
                        {templates.map(template => (
                            <div key={template.id} className="bg-zinc-900 p-4 rounded-xl shadow-md border border-zinc-800">
                                <div 
                                    className="cursor-pointer" 
                                    onClick={() => onViewPlan(template)}
                                >
                                    <h3 className="text-lg font-bold text-zinc-200">{template.name}</h3>
                                    <p className="text-zinc-400 text-sm mt-1 mb-3">{template.description}</p>
                                </div>
                                <div className="border-t border-zinc-800 pt-3 flex justify-between items-center">
                                    <div className="text-sm">
                                        <span className="text-zinc-500">Energy: </span>
                                        <span className="font-semibold text-zinc-300">{template.totals.energy.toLocaleString()} Cal</span>
                                    </div>
                                    <button 
                                        onClick={() => onActivatePlan(template.id)}
                                        className="text-sm font-semibold bg-amber-500 text-black px-4 py-2 rounded-full hover:bg-amber-600 transition-colors"
                                    >
                                        Use this plan
                                    </button>
                                </div>
                            </div>
                        ))}
                         {/* Add new plan button */}
                        <button 
                            onClick={() => addToast("Creating custom plans is coming soon!", "info")}
                            className="w-full flex items-center justify-center space-x-2 border-2 border-dashed border-zinc-700 text-zinc-500 hover:text-amber-400 hover:border-amber-400/50 rounded-lg py-4 transition-colors"
                        >
                            <Icon type="plus" className="w-5 h-5"/>
                            <span className="font-semibold">Create New Plan</span>
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default NutritionPage;