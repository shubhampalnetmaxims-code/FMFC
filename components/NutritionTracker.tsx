

import React from 'react';
import type { NutritionPlan } from '../types';

interface NutritionTrackerProps {
    plan: NutritionPlan;
    checkedItems: Set<string>;
    onToggleItem: (itemId: string) => void;
}

const NutritionTracker: React.FC<NutritionTrackerProps> = ({ plan, checkedItems, onToggleItem }) => {
    const totalItems = plan.content.flatMap(m => m.items).length;
    const checkedCount = checkedItems.size;
    const progress = totalItems > 0 ? (checkedCount / totalItems) * 100 : 0;

    return (
        <>
            {/* Progress Bar */}
            <div>
                <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-zinc-400">Daily Completion</span>
                    <span className="text-sm font-bold text-amber-400">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-zinc-700 rounded-full h-2.5">
                    <div className="bg-amber-400 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
            </div>

            {/* Meal Items */}
            <div className="space-y-6">
                {plan.content.map((meal, index) => (
                    <div key={index}>
                        <h4 className="font-bold text-zinc-400 mb-2 border-b border-zinc-800 pb-1">{meal.mealTime}</h4>
                        <div className="space-y-3">
                            {meal.items.map((item, itemIndex) => {
                                const itemId = `${meal.mealTime}-${item.name}`;
                                const isChecked = checkedItems.has(itemId);
                                return (
                                    <label
                                        key={itemIndex}
                                        htmlFor={itemId}
                                        className="flex items-center p-3 rounded-lg bg-zinc-900 hover:bg-zinc-800/50 transition-colors cursor-pointer"
                                    >
                                        <input
                                            id={itemId}
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={() => onToggleItem(itemId)}
                                            className="h-5 w-5 rounded bg-zinc-700 border-zinc-600 text-amber-500 focus:ring-amber-500 focus:ring-2 shrink-0"
                                        />
                                        <div className={`flex-grow ml-4 transition-colors ${isChecked ? 'text-zinc-500 line-through' : 'text-zinc-200'}`}>
                                            <p className="font-medium">{item.name}</p>
                                            <p className="text-sm">
                                                (x{item.quantity}) - {item.calories.toLocaleString()} Cal
                                            </p>
                                        </div>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default NutritionTracker;