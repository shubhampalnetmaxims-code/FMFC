
import React from 'react';
import type { NutritionPlan, DietIntakeItem } from '../types';
import Icon from './Icon';

interface NutritionTrackerProps {
    plan: NutritionPlan;
    checkedItems: Set<string>;
    onToggleItem: (itemId: string) => void;
    additionalItems?: DietIntakeItem[];
    onEditItem?: (item: DietIntakeItem) => void;
    onDeleteItem?: (itemId: string) => void;
}

const NutritionTracker: React.FC<NutritionTrackerProps> = ({ plan, checkedItems, onToggleItem, additionalItems, onEditItem, onDeleteItem }) => {
    const totalPlanItems = plan.content.flatMap(m => m.items);
    const totalAdditionalItems = additionalItems || [];
    
    // Create a stable ID for plan items and a map for easy lookup
    const planItemsWithIds = totalPlanItems.map(item => ({ ...item, id: `${item.name}-${item.calories}` }));
    
    const checkedPlanItemsCount = planItemsWithIds.filter(item => checkedItems.has(item.id)).length;
    const checkedAdditionalItemsCount = totalAdditionalItems.filter(item => checkedItems.has(item.id)).length;
    
    const totalItemsCount = planItemsWithIds.length + totalAdditionalItems.length;
    const totalCheckedCount = checkedPlanItemsCount + checkedAdditionalItemsCount;
    const progress = totalItemsCount > 0 ? (totalCheckedCount / totalItemsCount) * 100 : 0;

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
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
                                <Icon type="fire" className="w-5 h-5 text-amber-400" />
                            </div>
                            <h4 className="font-bold text-lg text-zinc-300">{meal.mealTime}</h4>
                        </div>
                        <div className="space-y-3">
                            {meal.items.map((item, itemIndex) => {
                                const itemId = `${item.name}-${item.calories}`;
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

                {/* Additional Items */}
                {additionalItems && additionalItems.length > 0 && (
                    <div>
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
                                <Icon type="plus" className="w-5 h-5 text-amber-400" />
                            </div>
                            <h4 className="font-bold text-lg text-zinc-300">Additional</h4>
                        </div>
                        <div className="space-y-3">
                            {additionalItems.map((item) => {
                                const isChecked = checkedItems.has(item.id);
                                return (
                                    <div key={item.id} className="flex items-center p-3 rounded-lg bg-zinc-900 hover:bg-zinc-800/50 transition-colors">
                                        <input
                                            id={item.id}
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={() => onToggleItem?.(item.id)}
                                            className="h-5 w-5 rounded bg-zinc-700 border-zinc-600 text-amber-500 focus:ring-amber-500 focus:ring-2 shrink-0"
                                        />
                                        <div
                                            onClick={() => onEditItem?.(item)}
                                            className={`flex-grow ml-4 cursor-pointer transition-colors ${isChecked ? 'text-zinc-500 line-through' : 'text-zinc-200'}`}
                                        >
                                            <p className="font-medium">{item.description}</p>
                                            <p className="text-sm">
                                                {item.energy.toFixed(0)} Cal
                                            </p>
                                        </div>
                                        <button onClick={() => onDeleteItem?.(item.id)} className="p-2 text-zinc-400 hover:text-amber-400 rounded-full hover:bg-zinc-800 transition-colors shrink-0">
                                            <Icon type="trash" className="w-5 h-5" />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default NutritionTracker;