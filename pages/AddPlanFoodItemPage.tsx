

import React, { useState, useEffect } from 'react';
import Icon from '../components/Icon';
import { FoodItem, FoodSearchItem, DietIntakeItem } from '../types';
import FoodSearchPage from './FoodSearchPage';
import SelectMeasurePage from './SelectMeasurePage';
import BarcodeScannerPage from './BarcodeScannerPage';
import AiScanFlow from './AiScanFlow';
import { useToast } from '../components/ToastProvider';

interface AddPlanFoodItemPageProps {
    onClose: () => void;
    onSave: (data: Omit<FoodItem, 'id'>) => void;
    initialData?: FoodItem | null;
    mealTime: string;
}

const StyledInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label?: string }> = ({ label, ...props }) => {
    return (
        <div>
            {label && <label className="text-xs text-zinc-400 mb-1 block">{label}</label>}
            <input
                {...props}
                className={`w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-500 ${props.readOnly ? 'bg-zinc-800/50 text-zinc-400' : ''}`}
            />
        </div>
    );
};

const AddPlanFoodItemPage: React.FC<AddPlanFoodItemPageProps> = ({ onClose, onSave, initialData, mealTime }) => {
    const { addToast } = useToast();
    const [formData, setFormData] = useState({
        name: '',
        quantity: '1',
        calories: '',
        carbohydrates: '',
        proteins: '',
        fats: '',
        fibre: '',
        water: '',
        vitaminA: '',
        vitaminC: '',
        calcium: '',
        iron: '',
    });

    const [showMicros, setShowMicros] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedFood, setSelectedFood] = useState<FoodSearchItem | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [isAiScanning, setIsAiScanning] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                quantity: String(initialData.quantity),
                calories: String(initialData.calories),
                carbohydrates: String(initialData.carbohydrates || ''),
                proteins: String(initialData.proteins || ''),
                fats: String(initialData.fats || ''),
                fibre: String(initialData.fibre || ''),
                water: String(initialData.water || ''),
                vitaminA: String(initialData.vitaminA || ''),
                vitaminC: String(initialData.vitaminC || ''),
                calcium: String(initialData.calcium || ''),
                iron: String(initialData.iron || ''),
            });
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSave = () => {
        if (!formData.name) {
            addToast('Food name is required.', 'error');
            return;
        }
        const dataToSave: Omit<FoodItem, 'id'> = {
            name: formData.name,
            quantity: parseFloat(formData.quantity) || 0,
            calories: parseFloat(formData.calories) || 0,
            carbohydrates: parseFloat(formData.carbohydrates) || 0,
            proteins: parseFloat(formData.proteins) || 0,
            fats: parseFloat(formData.fats) || 0,
            fibre: parseFloat(formData.fibre) || 0,
            water: parseFloat(formData.water) || 0,
            vitaminA: parseFloat(formData.vitaminA) || 0,
            vitaminC: parseFloat(formData.vitaminC) || 0,
            calcium: parseFloat(formData.calcium) || 0,
            iron: parseFloat(formData.iron) || 0,
        };
        onSave(dataToSave);
    };
    
    const handleSearchClick = () => {
        setSearchQuery(formData.name);
        setIsSearching(true);
    };

    const handleSelectFood = (food: FoodSearchItem) => {
        setIsSearching(false);
        setSelectedFood(food);
    };

    const populateFormWithData = (data: Omit<DietIntakeItem, 'id' | 'meal' | 'date'>) => {
         setFormData(prev => ({
            ...prev,
            name: data.description,
            quantity: String(data.quantity),
            calories: String(parseFloat(data.energy.toFixed(2))),
            carbohydrates: String(data.carbohydrates ? parseFloat(data.carbohydrates.toFixed(2)) : ''),
            proteins: String(data.proteins ? parseFloat(data.proteins.toFixed(2)) : ''),
            fats: String(data.fats ? parseFloat(data.fats.toFixed(2)) : ''),
            fibre: String(data.fibre ? parseFloat(data.fibre.toFixed(2)) : ''),
            water: String(data.water ? parseFloat(data.water.toFixed(2)) : ''),
            vitaminA: String(data.vitaminA ? parseFloat(data.vitaminA.toFixed(2)) : ''),
            vitaminC: String(data.vitaminC ? parseFloat(data.vitaminC.toFixed(2)) : ''),
            calcium: String(data.calcium ? parseFloat(data.calcium.toFixed(2)) : ''),
            iron: String(data.iron ? parseFloat(data.iron.toFixed(2)) : ''),
        }));
    }

    const handleMeasureDone = (data: Omit<DietIntakeItem, 'id' | 'meal' | 'date'>) => {
        setSelectedFood(null);
        populateFormWithData(data);
    };

    const handleBarcodeScan = (data: Omit<DietIntakeItem, 'id' | 'meal' | 'date'>) => {
        populateFormWithData(data);
        setIsScanning(false);
    };
    
    const handleAiScanComplete = (data: Omit<DietIntakeItem, 'id' | 'meal' | 'date'>) => {
        populateFormWithData(data);
        setIsAiScanning(false);
    };

    if (isScanning) {
        return <BarcodeScannerPage onClose={() => setIsScanning(false)} onScan={handleBarcodeScan} />;
    }

    if (isAiScanning) {
        return <AiScanFlow onClose={() => setIsAiScanning(false)} onComplete={handleAiScanComplete} />;
    }

    if (isSearching) {
        return <FoodSearchPage initialQuery={searchQuery} onClose={() => setIsSearching(false)} onSelectFood={handleSelectFood} />;
    }

    if (selectedFood) {
        return <SelectMeasurePage foodItem={selectedFood} onClose={() => setSelectedFood(null)} onDone={handleMeasureDone} />;
    }

    const isEditMode = !!initialData;

    return (
        <div className="absolute inset-0 bg-zinc-950 z-50 flex flex-col font-sans text-zinc-200">
            <header className="flex items-center justify-between p-4 shrink-0">
                <button onClick={onClose} className="p-2">
                    <Icon type="x" className="w-6 h-6 text-zinc-400" />
                </button>
                <h1 className="text-xl font-bold text-center">{isEditMode ? 'Edit' : 'Add'} Food <br /> for {mealTime}</h1>
                <button onClick={handleSave} className="p-2 bg-zinc-800 rounded-full">
                    <Icon type="check" className="w-6 h-6 text-amber-400" />
                </button>
            </header>

            <main className="flex-grow overflow-y-auto p-4 space-y-4">
                {!isEditMode && (
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => setIsScanning(true)} className="flex items-center justify-center space-x-2 bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 p-3 rounded-lg text-sm font-semibold text-amber-300">
                            <Icon type="barcode" className="w-5 h-5" />
                            <span>Scan barcode</span>
                        </button>
                        <button onClick={() => setIsAiScanning(true)} className="flex items-center justify-center space-x-2 bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 p-3 rounded-lg text-sm font-semibold text-amber-300">
                            <Icon type="video-camera" className="w-5 h-5" />
                            <span>Scan with AI</span>
                        </button>
                    </div>
                )}

                <div className="relative">
                    <label className="text-xs text-zinc-400 mb-1 block">Food Name</label>
                    <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Search for food..."
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                    <button onClick={handleSearchClick} className="absolute right-3 top-1/2 mt-2 text-zinc-500 hover:text-amber-400 transition-colors">
                        <Icon type="search" className="w-5 h-5" />
                    </button>
                </div>

                <StyledInput
                    name="meal"
                    label="Meal"
                    value={mealTime}
                    readOnly
                />
                
                <div className="flex gap-3">
                     <div className="w-1/2">
                        <StyledInput
                            name="calories"
                            type="text"
                            inputMode="decimal"
                            value={formData.calories}
                            onChange={handleNumberChange}
                            label="Energy (Cal, each)"
                            placeholder="0"
                        />
                    </div>
                    <div className="w-1/2">
                        <StyledInput
                            name="quantity"
                            type="text"
                            inputMode="decimal"
                            value={formData.quantity}
                            onChange={handleNumberChange}
                            label="Quantity"
                            placeholder="0"
                        />
                    </div>
                </div>
                
                <div className="flex gap-3">
                    <div className="w-1/3">
                        <StyledInput name="carbohydrates" type="text" inputMode="decimal" label="Carbs (g)" value={formData.carbohydrates} onChange={handleNumberChange} placeholder="0" />
                    </div>
                     <div className="w-1/3">
                        <StyledInput name="proteins" type="text" inputMode="decimal" label="Proteins (g)" value={formData.proteins} onChange={handleNumberChange} placeholder="0" />
                    </div>
                     <div className="w-1/3">
                        <StyledInput name="fats" type="text" inputMode="decimal" label="Fats (g)" value={formData.fats} onChange={handleNumberChange} placeholder="0" />
                    </div>
                </div>
                <div className="flex gap-3">
                    <div className="w-1/2">
                        <StyledInput name="fibre" type="text" inputMode="decimal" label="Fibre (g)" value={formData.fibre} onChange={handleNumberChange} placeholder="0" />
                    </div>
                    <div className="w-1/2">
                        <StyledInput name="water" type="text" inputMode="decimal" label="Water (mL)" value={formData.water} onChange={handleNumberChange} placeholder="0" />
                    </div>
                </div>

                 <div className="border-t border-zinc-700 pt-4">
                    <button
                        onClick={() => setShowMicros(!showMicros)}
                        className="w-full flex justify-between items-center text-left text-zinc-300 hover:text-white"
                        aria-expanded={showMicros}
                    >
                        <span className="font-semibold">Micronutrients (Optional)</span>
                        <Icon type="arrow-right" className={`w-5 h-5 transition-transform transform ${showMicros ? 'rotate-90' : 'rotate-0'}`} />
                    </button>
                    {showMicros && (
                        <div className="mt-4 space-y-4">
                            <div className="flex gap-3">
                                <div className="w-1/2">
                                    <StyledInput name="vitaminA" type="text" inputMode="decimal" label="Vitamin A (mcg)" value={formData.vitaminA} onChange={handleNumberChange} placeholder="0" />
                                </div>
                                <div className="w-1/2">
                                    <StyledInput name="vitaminC" type="text" inputMode="decimal" label="Vitamin C (mg)" value={formData.vitaminC} onChange={handleNumberChange} placeholder="0" />
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="w-1/2">
                                    <StyledInput name="calcium" type="text" inputMode="decimal" label="Calcium (mg)" value={formData.calcium} onChange={handleNumberChange} placeholder="0" />
                                </div>
                                <div className="w-1/2">
                                    <StyledInput name="iron" type="text" inputMode="decimal" label="Iron (mg)" value={formData.iron} onChange={handleNumberChange} placeholder="0" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AddPlanFoodItemPage;