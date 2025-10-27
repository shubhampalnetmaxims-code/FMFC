import React, { useState } from 'react';
import Icon from '../components/Icon';

interface AddDietIntakePageProps {
    onClose: () => void;
    onSave: (data: any) => void;
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

const AddDietIntakePage: React.FC<AddDietIntakePageProps> = ({ onClose, onSave }) => {
    const [formData, setFormData] = useState({
        description: '',
        meal: '',
        date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
        energy: '',
        quantity: '1',
        carbs: '',
        proteins: '',
        fats: '',
        fibre: '',
        water: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        if (!formData.description) {
            alert('Description is required.');
            return;
        }
        onSave(formData);
    };

    const formatDateForDisplay = (dateString: string) => {
        const date = new Date(dateString + 'T00:00:00'); // Ensure correct date parsing
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="fixed inset-0 bg-zinc-950 z-50 flex flex-col font-sans text-zinc-200">
            <header className="flex items-center justify-between p-4 shrink-0">
                <button onClick={onClose} className="p-2">
                    <Icon type="x" className="w-6 h-6 text-zinc-400" />
                </button>
                <h1 className="text-xl font-bold">Add diet intake</h1>
                <button onClick={handleSave} className="p-2 bg-zinc-800 rounded-full">
                    <Icon type="check" className="w-6 h-6 text-amber-400" />
                </button>
            </header>

            <main className="flex-grow overflow-y-auto p-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    <button className="flex items-center justify-center space-x-2 bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 p-3 rounded-lg text-sm font-semibold text-amber-300">
                        <Icon type="barcode" className="w-5 h-5" />
                        <span>Scan barcode</span>
                    </button>
                    <button className="flex items-center justify-center space-x-2 bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 p-3 rounded-lg text-sm font-semibold text-amber-300">
                        <Icon type="video-camera" className="w-5 h-5" />
                        <span>Scan with AI</span>
                    </button>
                </div>

                <div className="relative">
                    <StyledInput
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Description"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500">
                        <Icon type="search" className="w-5 h-5" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <StyledInput
                        name="meal"
                        value={formData.meal}
                        onChange={handleChange}
                        placeholder="Meal"
                    />
                    <div className="bg-zinc-800 border border-zinc-700 rounded-lg flex items-center justify-center text-sm font-semibold cursor-pointer relative text-zinc-200">
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
                
                <div className="grid grid-cols-2 gap-3">
                     <StyledInput
                        name="energy"
                        type="number"
                        value={formData.energy}
                        onChange={handleChange}
                        placeholder="Energy (Cal, each)"
                    />
                    <StyledInput
                        name="quantity"
                        type="number"
                        value={formData.quantity}
                        onChange={handleChange}
                        label="Quantity"
                    />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                    <StyledInput name="carbs" type="number" value={formData.carbs} onChange={handleChange} placeholder="Carbs (g, each)" />
                    <StyledInput name="proteins" type="number" value={formData.proteins} onChange={handleChange} placeholder="Proteins (g, each)" />
                    <StyledInput name="fats" type="number" value={formData.fats} onChange={handleChange} placeholder="Fats (g, each)" />
                    <StyledInput name="fibre" type="number" value={formData.fibre} onChange={handleChange} placeholder="Fibre (g, each)" />
                    <StyledInput name="water" type="number" value={formData.water} onChange={handleChange} placeholder="Water (mL, each)" />
                </div>
            </main>
        </div>
    );
};

export default AddDietIntakePage;