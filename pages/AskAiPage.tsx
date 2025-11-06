import React, { useState, useMemo, useEffect } from 'react';
import Icon from '../components/Icon';
import { UserMeasurement, DietIntakeItem, NutritionPlan } from '../types';
import { useToast } from '../components/ToastProvider';

type AiStep = 'dateSelection' | 'promptSelection' | 'loading' | 'result';

const SUGGESTIONS = [
    'Give me a nutrition plan for fat loss',
    'Create a nutrition plan for muscle building',
    'Design a nutrition plan for a lean body',
    'Generate a plan for a healthy balanced diet'
];

const LOADING_MESSAGES = [
    "Analyzing your journal...",
    "Consulting with expert trainers...",
    "Calculating macronutrients...",
    "Building your personalized plan...",
];

interface AskAiPageProps {
    onClose: () => void;
    userMeasurements: UserMeasurement[];
    additionalDietItems: DietIntakeItem[];
    activePlan: NutritionPlan | undefined;
    checkedNutritionItems: Record<string, Set<string>>;
    onSavePlan: (plan: NutritionPlan) => void;
}

const generateMockPlan = (goal: string): NutritionPlan => {
    const baseId = Date.now();
    const commonTotals = { fibre: 35, water: 2500 };
    let planData: Omit<NutritionPlan, 'id' | 'isTemplate' | 'isActive'> = { name: '', description: '', notes: '', totals: { energy: 0, carbohydrates: 0, proteins: 0, fats: 0, ...commonTotals }, content: [] };

    if (goal.includes('loss')) {
        planData = {
            name: "AI Fat Loss Plan",
            description: "AI-generated plan focused on a caloric deficit for sustainable fat loss.",
            notes: "This plan is a template. Focus on whole foods and consistent protein intake. Consult a professional before starting any new diet.",
            totals: { ...commonTotals, energy: 1800, carbohydrates: 150, proteins: 150, fats: 60 },
            content: [
                // FIX: Added 'id' property to FoodItem to match the required type.
                { mealTime: "Breakfast", items: [{ id: `${baseId}-0-0`, name: "Oatmeal with Berries", quantity: 1, calories: 350 }] },
                // FIX: Added 'id' property to FoodItem to match the required type.
                { mealTime: "Lunch", items: [{ id: `${baseId}-1-0`, name: "Grilled Chicken Salad", quantity: 1, calories: 500 }] },
                // FIX: Added 'id' property to FoodItem to match the required type.
                { mealTime: "Dinner", items: [{ id: `${baseId}-2-0`, name: "Salmon with Asparagus", quantity: 1, calories: 600 }] },
                // FIX: Added 'id' property to FoodItem to match the required type.
                { mealTime: "Snack", items: [{ id: `${baseId}-3-0`, name: "Greek Yogurt", quantity: 1, calories: 150 }, { id: `${baseId}-3-1`, name: "Apple", quantity: 1, calories: 200 }] }
            ]
        };
    } else if (goal.includes('building')) {
        planData = {
            name: "AI Muscle Building Plan",
            description: "AI-generated high-protein plan to support muscle growth and recovery.",
            notes: "This plan is a template. Ensure you are in a slight caloric surplus. Meal timing around workouts can be beneficial. Consult a professional.",
            totals: { ...commonTotals, energy: 2800, carbohydrates: 300, proteins: 180, fats: 90 },
            content: [
                // FIX: Added 'id' property to FoodItem to match the required type.
                { mealTime: "Meal 1", items: [{ id: `${baseId}-0-0`, name: "Scrambled Eggs & Whole Wheat Toast", quantity: 1, calories: 500 }] },
                // FIX: Added 'id' property to FoodItem to match the required type.
                { mealTime: "Meal 2", items: [{ id: `${baseId}-1-0`, name: "Chicken Breast with Brown Rice", quantity: 1, calories: 600 }] },
                // FIX: Added 'id' property to FoodItem to match the required type.
                { mealTime: "Post-Workout", items: [{ id: `${baseId}-2-0`, name: "Whey Protein Shake", quantity: 1, calories: 300 }] },
                // FIX: Added 'id' property to FoodItem to match the required type.
                { mealTime: "Meal 4", items: [{ id: `${baseId}-3-0`, name: "Steak with Sweet Potato", quantity: 1, calories: 800 }] },
                // FIX: Added 'id' property to FoodItem to match the required type.
                { mealTime: "Meal 5", items: [{ id: `${baseId}-4-0`, name: "Cottage Cheese with Almonds", quantity: 1, calories: 400 }] }
            ]
        };
    } else { // Lean or healthy body
        planData = {
            name: "AI Balanced Health Plan",
            description: "AI-generated plan for maintaining a healthy, lean physique with balanced macronutrients.",
            notes: "This plan is a template. Consistency is key. Listen to your body and adjust portions as needed. Consult a professional.",
            totals: { ...commonTotals, energy: 2200, carbohydrates: 220, proteins: 140, fats: 80 },
            content: [
                // FIX: Added 'id' property to FoodItem to match the required type.
                { mealTime: "Breakfast", items: [{ id: `${baseId}-0-0`, name: "Avocado Toast with Eggs", quantity: 1, calories: 450 }] },
                // FIX: Added 'id' property to FoodItem to match the required type.
                { mealTime: "Lunch", items: [{ id: `${baseId}-1-0`, name: "Quinoa Bowl with Mixed Veggies & Tofu", quantity: 1, calories: 600 }] },
                // FIX: Added 'id' property to FoodItem to match the required type.
                { mealTime: "Dinner", items: [{ id: `${baseId}-2-0`, name: "Lean Turkey Mince with Zucchini Noodles", quantity: 1, calories: 650 }] },
                // FIX: Added 'id' property to FoodItem to match the required type.
                { mealTime: "Snacks", items: [{ id: `${baseId}-3-0`, name: "Mixed Nuts", quantity: 1, calories: 250 }, { id: `${baseId}-3-1`, name: "Protein Smoothie", quantity: 1, calories: 250 }] }
            ]
        };
    }

    return { id: baseId, isTemplate: true, isActive: false, ...planData };
};


const AskAiPage: React.FC<AskAiPageProps> = ({ onClose, userMeasurements, additionalDietItems, onSavePlan }) => {
    const { addToast } = useToast();
    const [step, setStep] = useState<AiStep>('dateSelection');
    const today = new Date().toISOString().split('T')[0];
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const [startDate, setStartDate] = useState(sevenDaysAgo);
    const [endDate, setEndDate] = useState(today);
    const [generatedPlan, setGeneratedPlan] = useState<NutritionPlan | null>(null);
    const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);

    const filteredData = useMemo(() => {
        if (!startDate || !endDate) return { measurements: [], diet: [] };
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        const measurements = userMeasurements.filter(m => {
            const d = new Date(m.date);
            return d >= start && d <= end;
        });

        const diet = additionalDietItems.filter(d => {
            const itemDate = new Date(d.date);
            return itemDate >= start && itemDate <= end;
        });

        return { measurements, diet };
    }, [startDate, endDate, userMeasurements, additionalDietItems]);

    const handleGenerate = (suggestion: string) => {
        setStep('loading');
        let messageIndex = 0;
        const messageInterval = setInterval(() => {
            messageIndex = (messageIndex + 1) % LOADING_MESSAGES.length;
            setLoadingMessage(LOADING_MESSAGES[messageIndex]);
        }, 1500);

        setTimeout(() => {
            clearInterval(messageInterval);
            const plan = generateMockPlan(suggestion);
            setGeneratedPlan(plan);
            setStep('result');
        }, 4000);
    };

    const handleSave = () => {
        if (generatedPlan) {
            onSavePlan(generatedPlan);
        }
    }

    const handleBack = () => {
        if (step === 'result') setStep('promptSelection');
        else if (step === 'promptSelection') setStep('dateSelection');
        else onClose();
    }

    return (
        <div className="absolute inset-0 bg-zinc-950 z-50 flex flex-col font-sans text-zinc-200">
            <header className="flex items-center p-4 shrink-0 border-b border-zinc-800">
                <button onClick={handleBack} className="p-2 -ml-2 mr-2 text-zinc-400 hover:text-zinc-200">
                    <Icon type="arrow-left" className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold">Ask AI</h1>
            </header>

            {step === 'dateSelection' && (
                <main className="flex-grow overflow-y-auto p-4 space-y-6">
                    <h2 className="text-lg font-semibold text-zinc-300">Select Date Range for Analysis</h2>
                    <p className="text-sm text-zinc-400">The AI will use your nutrition and measurement data from this period to generate a personalized plan.</p>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="start-date" className="text-xs text-zinc-400 mb-1 block">Start Date</label>
                            <input type="date" id="start-date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500"/>
                        </div>
                         <div>
                            <label htmlFor="end-date" className="text-xs text-zinc-400 mb-1 block">End Date</label>
                            <input type="date" id="end-date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500"/>
                        </div>
                    </div>
                    <button onClick={() => setStep('promptSelection')} disabled={!startDate || !endDate || startDate > endDate} className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-200 disabled:bg-zinc-600">
                        Continue
                    </button>
                </main>
            )}

            {step === 'promptSelection' && (
                <main className="flex-grow overflow-y-auto p-4 space-y-6">
                    <div>
                        <h3 className="font-semibold text-zinc-300 mb-2">Data for AI Analysis ({startDate} to {endDate})</h3>
                        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 max-h-40 overflow-y-auto text-xs space-y-2">
                            {filteredData.measurements.length === 0 && filteredData.diet.length === 0 && <p className="text-zinc-500">No data in selected range.</p>}
                            {filteredData.measurements.map(m => <p key={m.id} className="text-zinc-400">[{m.date}] Measurement: {m.weight}kg, {m.bodyfat}% body fat.</p>)}
                            {filteredData.diet.map(d => <p key={d.id} className="text-zinc-400">[{d.date}] Eaten: {d.description} ({d.energy.toFixed(0)} Cal).</p>)}
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold text-zinc-300 mb-3">What is your primary goal?</h3>
                        <div className="space-y-3">
                            {SUGGESTIONS.map(s => (
                                <button key={s} onClick={() => handleGenerate(s)} className="w-full text-left p-4 bg-zinc-800 hover:bg-zinc-700 rounded-lg font-medium transition-colors">
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                </main>
            )}
            
            {step === 'loading' && (
                 <main className="flex flex-col items-center justify-center h-full text-center p-4">
                    <Icon type="spinner" className="w-16 h-16 text-amber-400 animate-spin" />
                    <p className="mt-4 text-lg font-semibold text-zinc-200">{loadingMessage}</p>
                </main>
            )}

            {step === 'result' && generatedPlan && (
                <>
                    <main className="flex-grow overflow-y-auto p-4 space-y-4">
                        <div className="bg-zinc-800/50 p-4 rounded-lg text-center">
                            <h2 className="text-xl font-bold text-amber-300">{generatedPlan.name}</h2>
                            <p className="text-sm text-zinc-400">{generatedPlan.description}</p>
                        </div>
                        <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-800">
                             <h3 className="font-semibold text-zinc-300 mb-2">Nutrition Content</h3>
                            {generatedPlan.content.map((meal, index) => (
                                <div key={index} className="mb-3">
                                    <h4 className="font-bold text-zinc-400 text-sm mb-1">{meal.mealTime}</h4>
                                    {meal.items.map((item, itemIndex) => (
                                        <p key={itemIndex} className="text-sm text-zinc-300 ml-2">&bull; {item.name} ({item.calories} Cal)</p>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </main>
                    <footer className="p-4 border-t border-zinc-800">
                        <button onClick={handleSave} className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 px-4 rounded-lg">
                            Save as Template
                        </button>
                    </footer>
                </>
            )}
        </div>
    );
};

export default AskAiPage;