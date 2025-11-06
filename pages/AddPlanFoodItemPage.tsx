
import React, { useState, useEffect } from 'react';
import Icon from '../components/Icon';
import { FoodItem } from '../types';
import { useToast } from '../components/ToastProvider';

interface AddPlanFoodItemPageProps {
    onClose: () => void;
    onSave: (data: { name: string, quantity: number, calories: number }) => void;
    initialData?: FoodItem | null;
    mealTime: string;
}

const AddPlanFoodItemPage: React.FC<AddPlanFoodItemPageProps> = ({ onClose, onSave, initialData, mealTime }) => {
    const { addToast } = useToast();
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('1');
    const [calories, setCalories] = useState('');

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setQuantity(String(initialData.quantity));
            setCalories(String(initialData.calories));
        }
    }, [initialData]);

    const handleNumberChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            setter(value);
        }
    };

    const handleSave = () => {
        if (!name.trim() || !calories.trim()) {
            addToast('Name and calories are required.', 'error');
            return;
        }
        onSave({
            name,
            quantity: parseFloat(quantity) || 1,
            calories: parseFloat(calories) || 0,
        });
    };
    
    const isEditMode = !!initialData;

    return (
        <div className="absolute inset-0 bg-zinc-950 z-50 flex flex-col font-sans text-zinc-200">
            <header className="flex items-center justify-between p-4 shrink-0">
                <button onClick={onClose} className="p-2">
                    <Icon type="x" className="w-6 h-6 text-zinc-400" />
                </button>
                <h1 className="text-xl font-bold">{isEditMode ? 'Edit' : 'Add'} Food for {mealTime}</h1>
                <button onClick={handleSave} className="p-2 bg-zinc-800 rounded-full">
                    <Icon type="check" className="w-6 h-6 text-amber-400" />
                </button>
            </header>

            <main className="flex-grow overflow-y-auto p-4 space-y-4">
                <div>
                    <label htmlFor="food-name" className="text-xs text-zinc-400 mb-1 block">Food Name *</label>
                    <input
                        id="food-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., Grilled Chicken Breast"
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="food-quantity" className="text-xs text-zinc-400 mb-1 block">Quantity</label>
                        <input
                            id="food-quantity"
                            type="text"
                            inputMode="decimal"
                            value={quantity}
                            onChange={handleNumberChange(setQuantity)}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="food-calories" className="text-xs text-zinc-400 mb-1 block">Total Calories *</label>
                        <input
                            id="food-calories"
                            type="text"
                            inputMode="decimal"
                            value={calories}
                            onChange={handleNumberChange(setCalories)}
                            placeholder="e.g., 250"
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AddPlanFoodItemPage;
