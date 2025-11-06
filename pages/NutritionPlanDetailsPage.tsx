import React from 'react';
import type { NutritionPlan, FoodItem } from '../types';
import Icon from '../components/Icon';

interface NutritionPlanDetailsPageProps {
    plan: NutritionPlan;
    onBack: () => void;
    isEditable: boolean;
    onAddItemToMeal: (mealTime: string) => void;
    onEditItem: (mealTime: string, item: FoodItem) => void;
    onDeleteItem: (mealTime: string, itemId: string) => void;
    onShare?: (plan: NutritionPlan) => void;
    onCopyPlan?: (plan: NutritionPlan) => void;
}

const NutritionPlanDetailsPage: React.FC<NutritionPlanDetailsPageProps> = ({ plan, onBack, isEditable, onAddItemToMeal, onEditItem, onDeleteItem, onShare, onCopyPlan }) => {

    const Card: React.FC<{title: string, children: React.ReactNode, hasMenu?: boolean}> = ({title, children, hasMenu}) => (
        <div className="bg-zinc-900 border border-zinc-800 p-4 sm:p-6 rounded-2xl shadow-md text-zinc-200">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">{title}</h3>
                {hasMenu && isEditable && (
                    <button className="text-zinc-500 hover:text-zinc-300 p-1 -mr-2">
                        <Icon type="dots-horizontal" className="w-6 h-6"/>
                    </button>
                )}
            </div>
            {children}
        </div>
    );
    
    return (
        <div className="h-full flex flex-col bg-zinc-950 relative">
            <header className="sticky top-0 bg-zinc-950/80 backdrop-blur-sm z-10 p-4 flex items-center">
                 <button onClick={onBack} className="mr-4 text-zinc-400 hover:text-zinc-200">
                    <Icon type="arrow-left" />
                </button>
                <h1 className="text-xl font-bold text-zinc-100">{plan.name}</h1>
                 {plan.isActive && !plan.isTemplate && (
                    <span className="ml-3 text-xs font-bold bg-amber-400 text-black px-2 py-0.5 rounded-full">ACTIVE</span>
                 )}
                 {plan.isTemplate && onShare && (
                    <button onClick={() => onShare(plan)} className="ml-auto p-2 text-zinc-400 hover:text-amber-400">
                        <Icon type="share" className="w-5 h-5" />
                    </button>
                )}
            </header>
            
            <main className="flex-grow overflow-y-auto p-4 space-y-6">
                <Card title="Notes" hasMenu>
                    <p className="text-zinc-400">{plan.notes}</p>
                </Card>
                
                <Card title="Nutrition totals">
                    <div className="space-y-3">
                        {Object.entries(plan.totals).map(([key, value]) => {
                            const units: { [key: string]: string } = {
                                energy: 'Cal',
                                carbohydrates: 'g',
                                proteins: 'g',
                                fats: 'g',
                                fibre: 'g',
                                water: 'mL'
                            };
                            return (
                                <div key={key} className="flex justify-between items-baseline">
                                    <p className="capitalize text-zinc-400">{key}</p>
                                    <p className="font-semibold text-lg">{value.toLocaleString()} {units[key]}</p>
                                </div>
                            );
                        })}
                    </div>
                </Card>
                
                 <Card title="Nutrition plan content">
                    <div className="space-y-6">
                        {plan.content.map((meal, index) => (
                            <div key={index}>
                                <div className="flex justify-between items-center">
                                    <h4 className="font-bold text-zinc-500 mb-2">{meal.mealTime}</h4>
                                    {isEditable && (
                                        <button onClick={() => onAddItemToMeal(meal.mealTime)} className="text-xs font-semibold flex items-center space-x-1 text-amber-400 hover:text-amber-300">
                                            <Icon type="plus" className="w-4 h-4" />
                                            <span>Add Food</span>
                                        </button>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    {meal.items.map((item, itemIndex) => (
                                        <div key={item.id} className="flex justify-between items-center group">
                                            <div className="pr-4">
                                                <p className="text-zinc-300 ">{item.name}</p>
                                                <p className="font-semibold text-sm">
                                                    (x{item.quantity}) {item.calories.toLocaleString(undefined, {
                                                        minimumFractionDigits: 0,
                                                        maximumFractionDigits: 2,
                                                    })} Cal
                                                </p>
                                            </div>
                                            {isEditable && (
                                                <div className="flex items-center shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => onEditItem(meal.mealTime, item)} className="p-2 text-zinc-400 hover:text-amber-400 rounded-full hover:bg-zinc-800">
                                                        <Icon type="pencil" className="w-4 h-4" />
                                                    </button>
                                                     <button onClick={() => onDeleteItem(meal.mealTime, item.id)} className="p-2 text-zinc-400 hover:text-red-500 rounded-full hover:bg-zinc-800">
                                                        <Icon type="trash" className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    {meal.items.length === 0 && isEditable && (
                                        <p className="text-sm text-zinc-600 italic">No items in this meal. Add one!</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </main>
            {onCopyPlan && (
                 <footer className="p-4 border-t border-zinc-800 sticky bottom-0 bg-zinc-950">
                    <button
                        onClick={() => onCopyPlan(plan)}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                        <Icon type="plus" className="w-5 h-5" />
                        <span>Copy to My Templates</span>
                    </button>
                </footer>
            )}
        </div>
    );
};

export default NutritionPlanDetailsPage;