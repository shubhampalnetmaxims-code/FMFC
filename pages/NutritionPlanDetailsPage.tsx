
import React from 'react';
import type { NutritionPlan } from '../types';
import Icon from '../components/Icon';

interface NutritionPlanDetailsPageProps {
    plan: NutritionPlan;
    onBack: () => void;
}

const NutritionPlanDetailsPage: React.FC<NutritionPlanDetailsPageProps> = ({ plan, onBack }) => {

    const Card: React.FC<{title: string, children: React.ReactNode, hasMenu?: boolean}> = ({title, children, hasMenu}) => (
        <div className="bg-[#F3EADF] p-4 sm:p-6 rounded-2xl shadow-md text-zinc-800">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">{title}</h3>
                {hasMenu && (
                    <button className="text-zinc-500 hover:text-zinc-800 p-1 -mr-2">
                        <Icon type="dots-horizontal" className="w-6 h-6"/>
                    </button>
                )}
            </div>
            {children}
        </div>
    );
    
    return (
        <div className="h-full flex flex-col bg-zinc-900 relative">
            <header className="sticky top-0 bg-zinc-950/80 backdrop-blur-sm z-10 p-4 flex items-center">
                 <button onClick={onBack} className="mr-4 text-zinc-400 hover:text-zinc-200">
                    <Icon type="arrow-left" />
                </button>
                <h1 className="text-xl font-bold text-zinc-100">{plan.name}</h1>
            </header>
            
            <main className="flex-grow overflow-y-auto p-4 space-y-6">
                <Card title="Notes" hasMenu>
                    <p className="text-zinc-600">{plan.notes}</p>
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
                                    <p className="capitalize text-zinc-600">{key}</p>
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
                                <h4 className="font-bold text-zinc-500 mb-2">{meal.mealTime}</h4>
                                <div className="space-y-2">
                                    {meal.items.map((item, itemIndex) => (
                                        <div key={itemIndex} className="flex justify-between items-start">
                                            <p className="text-zinc-700 pr-4">{item.name}</p>
                                            <div className="text-right shrink-0">
                                                <p className="font-semibold">
                                                    (x{item.quantity}) {item.calories.toLocaleString(undefined, {
                                                        minimumFractionDigits: 0,
                                                        maximumFractionDigits: 2,
                                                    })} Cal
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </main>

            <button
                onClick={() => alert("Adding entries is coming soon!")}
                className="absolute bottom-6 right-6 bg-[#FACD83] hover:bg-amber-400 text-black rounded-full p-4 shadow-lg transition-transform hover:scale-105 flex items-center space-x-2"
                aria-label="Add entry"
            >
                <Icon type="plus" className="w-6 h-6" />
                <span className="font-semibold pr-2">Add entry</span>
            </button>
        </div>
    );
};

export default NutritionPlanDetailsPage;
