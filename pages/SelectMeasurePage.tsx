import React, { useState, useMemo } from 'react';
import { FoodSearchItem, NutritionTotals, DietIntakeItem, FoodMeasure } from '../types';
import Icon from '../components/Icon';

interface SelectMeasurePageProps {
    foodItem: FoodSearchItem;
    onClose: () => void;
    onDone: (data: Omit<DietIntakeItem, 'id' | 'meal' | 'date'>) => void;
}

const SelectMeasurePage: React.FC<SelectMeasurePageProps> = ({ foodItem, onClose, onDone }) => {
    const [quantity, setQuantity] = useState('1');
    const [selectedMeasureIndex, setSelectedMeasureIndex] = useState(0);

    const selectedMeasure: FoodMeasure = foodItem.measures[selectedMeasureIndex];
    const quantityNum = parseFloat(quantity) || 0;

    const calculatedNutrients = useMemo<NutritionTotals>(() => {
        const nutrients: NutritionTotals = {
            energy: 0, carbohydrates: 0, proteins: 0, fats: 0, fibre: 0, water: 0
        };
        if (!selectedMeasure || quantityNum <= 0) return nutrients;

        const ratio = (selectedMeasure.grams * quantityNum) / 100;
        
        for (const key in foodItem.nutrients_per_100g) {
            const nutrientKey = key as keyof NutritionTotals;
            nutrients[nutrientKey] = foodItem.nutrients_per_100g[nutrientKey] * ratio;
        }
        return nutrients;
    }, [quantityNum, selectedMeasure, foodItem.nutrients_per_100g]);

    const handleDone = () => {
        const finalData = {
            description: foodItem.description,
            quantity: quantityNum,
            ...calculatedNutrients,
        };
        onDone(finalData);
    };
    
    const formatNumber = (num: number) => {
        if (num === 0) return '0';
        if (num < 0.1 && num > 0) return num.toPrecision(2);
        return parseFloat(num.toFixed(2)).toLocaleString();
    }

    return (
        <div className="fixed inset-0 bg-zinc-950 z-[70] flex flex-col font-sans text-zinc-200">
            <header className="flex items-center p-4 shrink-0 border-b border-zinc-800">
                <button onClick={onClose} className="p-2 -ml-2 mr-2">
                    <Icon type="arrow-left" className="w-6 h-6 text-zinc-400" />
                </button>
                <h1 className="text-xl font-bold truncate">Select measure</h1>
            </header>

            <main className="flex-grow overflow-y-auto p-4 space-y-4">
                <div className="bg-zinc-900 p-4 rounded-lg">
                    <h2 className="font-bold text-lg text-zinc-100 mb-2">{foodItem.description}</h2>
                    <div className="space-y-2 text-sm">
                        {Object.entries(foodItem.nutrients_per_100g).map(([key, value]) => (
                             <div key={key} className="flex justify-between text-zinc-400">
                                <span className="capitalize">{key}</span>
                                <span>{value} per 100 g</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="quantity" className="block text-xs font-medium text-zinc-400 mb-1">Quantity</label>
                         <input
                            id="quantity"
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                    </div>
                     <div>
                        <label htmlFor="measure" className="block text-xs font-medium text-zinc-400 mb-1">Measure</label>
                        <select
                            id="measure"
                            value={selectedMeasureIndex}
                            onChange={(e) => setSelectedMeasureIndex(parseInt(e.target.value, 10))}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-amber-500 appearance-none"
                        >
                            {foodItem.measures.map((measure, index) => (
                                <option key={index} value={index}>
                                    {measure.name} ({measure.grams} g)
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                 <div className="bg-zinc-900 p-4 rounded-lg space-y-2">
                     <h3 className="font-semibold text-zinc-200">Calculated Nutrients</h3>
                     {Object.entries(calculatedNutrients).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-zinc-300">
                            <span className="capitalize text-zinc-400">{key}</span>
                            {/* FIX: Cast value to number as Object.entries infers it as unknown. */}
                            <span className="font-medium">{formatNumber(value as number)}</span>
                        </div>
                     ))}
                </div>
            </main>
            
            <footer className="p-4">
                <button
                    onClick={handleDone}
                    className="w-full bg-amber-400 hover:bg-amber-500 text-black font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-200"
                >
                    Done
                </button>
            </footer>
        </div>
    );
};

export default SelectMeasurePage;