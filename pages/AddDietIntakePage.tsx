import React, { useState, useEffect } from 'react';
import Icon from '../components/Icon';
import { DietIntakeItem, FoodSearchItem } from '../types';
import FoodSearchPage from './FoodSearchPage';
import SelectMeasurePage from './SelectMeasurePage';
import BarcodeScannerPage from './BarcodeScannerPage';
import AiScanFlow from './AiScanFlow';

interface AddDietIntakePageProps {
    onClose: () => void;
    onSave: (data: DietIntakeItem) => void;
    initialData?: DietIntakeItem | null;
}

const StyledInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label?: string }> = ({ label, ...props }) => {
    return (
        <div>
            {label && <label className="text-xs text-zinc-400 mb-1 block">{label}</label>}
            <input
                {...props}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
        </div>
    );
};

const AddDietIntakePage: React.FC<AddDietIntakePageProps> = ({ onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState({
        description: '',
        meal: '',
        date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
        energy: '',
        quantity: '1',
        carbohydrates: '',
        proteins: '',
        fats: '',
        fibre: '',
        water: '',
    });

    const [isSearching, setIsSearching] = useState(false);
    const [selectedFood, setSelectedFood] = useState<FoodSearchItem | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [isAiScanning, setIsAiScanning] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                description: initialData.description,
                meal: initialData.meal,
                date: initialData.date,
                energy: String(initialData.energy),
                quantity: String(initialData.quantity),
                carbohydrates: String(initialData.carbohydrates),
                proteins: String(initialData.proteins),
                fats: String(initialData.fats),
                fibre: String(initialData.fibre),
                water: String(initialData.water),
            });
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        // Allow empty string or valid numbers (including decimals)
        if (value === '' || /^-?\d*\.?\d*$/.test(value)) {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSave = () => {
        if (!formData.description) {
            alert('Description is required.');
            return;
        }
        const numericFormData = {
            id: initialData?.id || '',
            description: formData.description,
            meal: formData.meal,
            date: formData.date,
            quantity: parseFloat(formData.quantity) || 0,
            energy: parseFloat(formData.energy) || 0,
            carbohydrates: parseFloat(formData.carbohydrates) || 0,
            proteins: parseFloat(formData.proteins) || 0,
            fats: parseFloat(formData.fats) || 0,
            fibre: parseFloat(formData.fibre) || 0,
            water: parseFloat(formData.water) || 0,
        };
        onSave(numericFormData);
    };
    
    const handleSearchClick = () => {
        setSearchQuery(formData.description);
        setIsSearching(true);
    };

    const handleSelectFood = (food: FoodSearchItem) => {
        setIsSearching(false);
        setSelectedFood(food);
    };

    const populateFormWithData = (data: Omit<DietIntakeItem, 'id' | 'meal' | 'date'>) => {
         setFormData(prev => ({
            ...prev,
            description: data.description,
            quantity: String(data.quantity),
            energy: String(parseFloat(data.energy.toFixed(2))),
            carbohydrates: String(parseFloat(data.carbohydrates.toFixed(2))),
            proteins: String(parseFloat(data.proteins.toFixed(2))),
            fats: String(parseFloat(data.fats.toFixed(2))),
            fibre: String(parseFloat(data.fibre.toFixed(2))),
            water: String(parseFloat(data.water.toFixed(2))),
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

    const formatDateForDisplay = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString + 'T00:00:00');
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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
        <div className="fixed inset-0 bg-zinc-950 z-50 flex flex-col font-sans text-zinc-200">
            <header className="flex items-center justify-between p-4 shrink-0">
                <button onClick={onClose} className="p-2">
                    <Icon type="x" className="w-6 h-6 text-zinc-400" />
                </button>
                <h1 className="text-xl font-bold">{isEditMode ? 'Edit diet intake' : 'Add diet intake'}</h1>
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
                    <label className="text-xs text-zinc-400 mb-1 block">Description</label>
                    <input
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Search for food..."
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                    <button onClick={handleSearchClick} className="absolute right-3 top-1/2 mt-2 text-zinc-500 hover:text-amber-400 transition-colors">
                        <Icon type="search" className="w-5 h-5" />
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <StyledInput
                        name="meal"
                        label="Meal"
                        value={formData.meal}
                        onChange={handleChange}
                        placeholder="e.g. Snack, Lunch"
                    />
                     <div>
                        <label className="text-xs text-zinc-400 mb-1 block">Date</label>
                        <div className="bg-zinc-800 border border-zinc-700 rounded-lg flex items-center justify-center text-sm font-semibold cursor-pointer relative text-zinc-200 h-[46px]">
                             {formatDateForDisplay(formData.date)}
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                        </div>
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                     <StyledInput
                        name="energy"
                        type="text"
                        inputMode="decimal"
                        value={formData.energy}
                        onChange={handleNumberChange}
                        label="Energy (Cal, each)"
                        placeholder="0"
                    />
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
                
                <div className="grid grid-cols-3 gap-3">
                    <StyledInput name="carbohydrates" type="text" inputMode="decimal" label="Carbs (g)" value={formData.carbohydrates} onChange={handleNumberChange} placeholder="0" />
                    <StyledInput name="proteins" type="text" inputMode="decimal" label="Proteins (g)" value={formData.proteins} onChange={handleNumberChange} placeholder="0" />
                    <StyledInput name="fats" type="text" inputMode="decimal" label="Fats (g)" value={formData.fats} onChange={handleNumberChange} placeholder="0" />
                    <StyledInput name="fibre" type="text" inputMode="decimal" label="Fibre (g)" value={formData.fibre} onChange={handleNumberChange} placeholder="0" />
                    <StyledInput name="water" type="text" inputMode="decimal" label="Water (mL)" value={formData.water} onChange={handleNumberChange} placeholder="0" />
                </div>
            </main>
        </div>
    );
};

export default AddDietIntakePage;