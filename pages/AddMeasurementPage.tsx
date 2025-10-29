
import React, { useState, useEffect } from 'react';
import Icon from '../components/Icon';
import { UserMeasurement } from '../types';
import CalendarModal from '../components/CalendarModal';
import { useToast } from '../components/ToastProvider';

interface AddMeasurementPageProps {
    onClose: () => void;
    onSave: (data: Omit<UserMeasurement, 'id'>) => void;
    initialData?: UserMeasurement | null;
    date: Date;
}

const measurementFields: { key: keyof Omit<UserMeasurement, 'id' | 'date'>; label: string; unit: string }[] = [
    { key: 'weight', label: 'Weight', unit: 'kg' },
    { key: 'height', label: 'Height', unit: 'cm' },
    { key: 'chest', label: 'Chest', unit: 'inches' },
    { key: 'waist', label: 'Waist', unit: 'inches' },
    { key: 'hips', label: 'Hips', unit: 'inches' },
    { key: 'neck', label: 'Neck', unit: 'inches' },
    { key: 'thigh', label: 'Thigh', unit: 'inches' },
    { key: 'biceps', label: 'Biceps', unit: 'inches' },
    { key: 'triceps', label: 'Triceps', unit: 'inches' },
    { key: 'subscapular', label: 'Subscapular', unit: 'mm' },
    { key: 'suprailiac', label: 'Suprailiac', unit: 'mm' },
    { key: 'bodyfat', label: 'Body fat', unit: '%' },
];

const AddMeasurementPage: React.FC<AddMeasurementPageProps> = ({ onClose, onSave, initialData, date }) => {
    const { addToast } = useToast();
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [measurementDate, setMeasurementDate] = useState(() => {
        if (initialData?.date) {
            return new Date(initialData.date + 'T00:00:00');
        }
        return date;
    });

    useEffect(() => {
        if (initialData) {
            const initialFormState: Record<string, string> = {};
            for (const field of measurementFields) {
                const value = initialData[field.key];
                if (value !== undefined && value !== null) {
                    initialFormState[field.key] = String(value);
                } else {
                    initialFormState[field.key] = '';
                }
            }
            setFormData(initialFormState);
        }
    }, [initialData]);

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSave = () => {
        const savedData: Omit<UserMeasurement, 'id' | 'date'> = {};
        let hasValue = false;
        for (const field of measurementFields) {
            const value = formData[field.key];
            if (value && value.trim() !== '') {
                savedData[field.key] = parseFloat(value);
                hasValue = true;
            } else {
                 savedData[field.key] = undefined;
            }
        }

        if (!hasValue) {
            addToast('Please enter at least one measurement.', 'error');
            return;
        }

        onSave({
            date: measurementDate.toISOString().split('T')[0],
            ...savedData
        });
    };
    
    const handleDateSelect = (d: Date) => {
        setMeasurementDate(d);
        setIsCalendarOpen(false);
    };

    return (
        <>
            <CalendarModal 
                isOpen={isCalendarOpen}
                onClose={() => setIsCalendarOpen(false)}
                selectedDate={measurementDate}
                onDateSelect={handleDateSelect}
            />
            <div className="h-full flex flex-col bg-zinc-950 text-zinc-200">
                <header className="flex items-center p-4 shrink-0 border-b border-zinc-800">
                    <button onClick={onClose} className="p-2 -ml-2 mr-2 text-zinc-400 hover:text-zinc-200">
                        <Icon type="arrow-left" className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl font-bold">{initialData ? 'Edit Measurements' : 'Add Measurements'}</h1>
                    <button 
                        onClick={handleSave}
                        className="ml-auto text-sm font-semibold text-amber-400 hover:text-amber-300 px-4 py-2 rounded-lg bg-amber-400/10 transition-colors"
                    >
                        Save
                    </button>
                </header>
                <main className="flex-grow overflow-y-auto p-4 space-y-4">
                     <div>
                        <label className="text-xs text-zinc-400 mb-1 block">Date</label>
                        <button
                            onClick={() => setIsCalendarOpen(true)}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-sm text-zinc-200 text-left focus:outline-none focus:ring-2 focus:ring-amber-500 flex justify-between items-center"
                        >
                            <span>
                                {measurementDate.toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </span>
                            <Icon type="session" className="w-5 h-5 text-zinc-400" />
                        </button>
                    </div>
                     <div className="space-y-4">
                        {measurementFields.map(field => (
                            <div key={field.key}>
                                <label htmlFor={field.key} className="block text-sm text-zinc-400 mb-1">{field.label}</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        inputMode="decimal"
                                        id={field.key}
                                        name={field.key}
                                        value={formData[field.key] || ''}
                                        onChange={handleNumberChange}
                                        placeholder="0"
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 pr-16"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">{field.unit}</span>
                                </div>
                            </div>
                        ))}
                     </div>
                </main>
            </div>
        </>
    );
};

export default AddMeasurementPage;
