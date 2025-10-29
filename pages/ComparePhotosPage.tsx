
import React, { useState, useEffect, useMemo } from 'react';
import Icon from '../components/Icon';
import { UserPhoto } from '../types';

interface ComparePhotosPageProps {
    userPhotos: UserPhoto[];
    onBack: () => void;
    onCompare: (data: { fromPhoto: UserPhoto; toPhoto: UserPhoto; description: string }) => void;
}

const PhotoSelector: React.FC<{
    title: string;
    userPhotos: UserPhoto[];
    onPhotoSelect: (photo: UserPhoto | null) => void;
}> = ({ title, userPhotos, onPhotoSelect }) => {
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [selectedPhoto, setSelectedPhoto] = useState<UserPhoto | null>(null);

    const availableDates = useMemo(() => {
        const dates = new Set(userPhotos.map(p => p.date));
        // FIX: Explicitly type 'a' and 'b' as strings to resolve TS inference error inside sort.
        return Array.from(dates).sort((a: string, b: string) => new Date(b).getTime() - new Date(a).getTime());
    }, [userPhotos]);

    const availableTypes = useMemo(() => {
        if (!selectedDate) return [];
        const types = new Set(userPhotos.filter(p => p.date === selectedDate).map(p => p.type));
        return Array.from(types);
    }, [selectedDate, userPhotos]);

    useEffect(() => {
        if (selectedDate && selectedType) {
            const photo = userPhotos.find(p => p.date === selectedDate && p.type === selectedType) || null;
            setSelectedPhoto(photo);
            onPhotoSelect(photo);
        } else {
            setSelectedPhoto(null);
            onPhotoSelect(null);
        }
    }, [selectedDate, selectedType, userPhotos, onPhotoSelect]);
    
    useEffect(() => {
        // Reset type if date changes and the previous type isn't available
        if (!availableTypes.includes(selectedType)) {
            setSelectedType('');
        }
    }, [availableTypes, selectedType]);

    return (
        <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-800 space-y-4">
            <h3 className="font-bold text-lg text-amber-300">{title}</h3>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs text-zinc-400 mb-1 block">Date</label>
                    <select
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                        <option value="">Select Date...</option>
                        {availableDates.map(date => <option key={date} value={date}>{date}</option>)}
                    </select>
                </div>
                <div>
                    <label className="text-xs text-zinc-400 mb-1 block">Photo Type</label>
                    <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        disabled={!selectedDate}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
                    >
                        <option value="">Select Type...</option>
                        {availableTypes.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                </div>
            </div>
            <div className="aspect-[3/4] bg-zinc-800/50 rounded flex items-center justify-center">
                {selectedPhoto ? (
                    <img src={selectedPhoto.src} alt="Selected" className="w-full h-full object-cover rounded" />
                ) : (
                    <Icon type="photo" className="w-12 h-12 text-zinc-600" />
                )}
            </div>
        </div>
    );
};

const ComparePhotosPage: React.FC<ComparePhotosPageProps> = ({ userPhotos, onBack, onCompare }) => {
    const [fromPhoto, setFromPhoto] = useState<UserPhoto | null>(null);
    const [toPhoto, setToPhoto] = useState<UserPhoto | null>(null);
    const [description, setDescription] = useState('Check out my progress!');

    const handleCompareClick = () => {
        if (fromPhoto && toPhoto) {
            onCompare({ fromPhoto, toPhoto, description });
        }
    };

    return (
        <div className="h-full flex flex-col bg-zinc-950 text-zinc-200">
            <header className="sticky top-0 bg-zinc-950/80 backdrop-blur-sm z-10 flex items-center p-4">
                <button onClick={onBack} className="mr-4 text-zinc-400 hover:text-zinc-200">
                    <Icon type="arrow-left" />
                </button>
                <h1 className="text-xl font-bold text-white">Compare Photos</h1>
            </header>

            <main className="flex-grow overflow-y-auto p-4 space-y-6">
                <PhotoSelector title="From" userPhotos={userPhotos} onPhotoSelect={setFromPhoto} />
                <PhotoSelector title="To" userPhotos={userPhotos} onPhotoSelect={setToPhoto} />
                
                <div>
                    <label htmlFor="comparison-description" className="text-xs text-zinc-400 mb-1 block">
                        Description for Post (optional)
                    </label>
                    <textarea
                        id="comparison-description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="Add a caption for your comparison..."
                    />
                </div>
            </main>

            <footer className="p-4 border-t border-zinc-800 sticky bottom-0 bg-zinc-950">
                <button
                    onClick={handleCompareClick}
                    disabled={!fromPhoto || !toPhoto}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-200 disabled:bg-zinc-600 disabled:cursor-not-allowed"
                >
                    Compare
                </button>
            </footer>
        </div>
    );
};

export default ComparePhotosPage;
