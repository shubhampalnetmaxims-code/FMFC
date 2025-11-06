import React from 'react';
import type { NutritionPlan } from '../types';
import { useToast } from './ToastProvider';
import Icon from './Icon';

interface SharedPlansPaneProps {
    plans: NutritionPlan[];
    onCopyPlan: (plan: NutritionPlan) => void;
    onView: (plan: NutritionPlan) => void;
}

const SharedPlansPane: React.FC<SharedPlansPaneProps> = ({ plans, onCopyPlan, onView }) => {
    if (!plans || plans.length === 0) {
        return (
            <div className="text-center py-16 text-zinc-500">
                <p>No nutrition plans have been shared in this community yet.</p>
            </div>
        );
    }
    
    return (
        <div className="p-4 space-y-4">
            {plans.map(plan => (
                <div key={plan.id} className="bg-zinc-900 p-4 rounded-xl shadow-md border border-zinc-800">
                    <div>
                        <h3 className="text-lg font-bold text-zinc-200">{plan.name}</h3>
                        <p className="text-zinc-400 text-sm mt-1 mb-3">{plan.description}</p>
                    </div>
                     <div className="border-t border-zinc-800 pt-3 flex flex-wrap gap-2 justify-between items-center">
                        <div className="text-sm">
                            <span className="text-zinc-500">Energy: </span>
                            <span className="font-semibold text-zinc-300">{plan.totals.energy.toLocaleString()} Cal</span>
                        </div>
                        <div className="flex items-center gap-2">
                             <button 
                                onClick={() => onView(plan)}
                                className="text-sm font-semibold bg-zinc-700 text-white px-4 py-2 rounded-full hover:bg-zinc-600 transition-colors"
                            >
                                View Details
                            </button>
                            <button 
                                onClick={() => onCopyPlan(plan)}
                                className="text-sm font-semibold bg-amber-500 text-black px-4 py-2 rounded-full hover:bg-amber-600 transition-colors flex items-center space-x-1.5"
                            >
                                <Icon type="plus" className="w-4 h-4" />
                                <span>Copy</span>
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SharedPlansPane;