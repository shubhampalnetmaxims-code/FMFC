

import React, { useState, useRef, useEffect } from 'react';
import Icon from '../components/Icon';
import { UserPhoto } from '../types';

interface AddPhotoPageProps {
    onClose: () => void;
    onSave: (data: { src: string; type: string; date: string; description: string }) => void;
    initialData?: UserPhoto | null;
}

const AddPhotoPage: React.FC<AddPhotoPageProps> = ({ onClose, onSave, initialData }) => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [photoType, setPhotoType] = useState('');
    const [description, setDescription] = useState('');
    const [photoDate, setPhotoDate] = useState(new Date().toISOString().split('T')[0]);
    
    const galleryInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (initialData) {
            setImageSrc(initialData.src);
            setPhotoType(initialData.type);
            setDescription(initialData.description);
            setPhotoDate(initialData.date);
        }
    }, [initialData]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageSrc(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        if (!imageSrc || !photoType) {
            alert('Please select a photo and a type.');
            return;
        }
        onSave({
            src: imageSrc,
            type: photoType,
            date: photoDate,
            description: description,
        });
    };

    return (
        <div className="h-full flex flex-col bg-zinc-950 text-zinc-200">
            {/* Hidden file inputs */}
            <input
                type="file"
                ref={galleryInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
            />
            <input
                type="file"
                ref={cameraInputRef}
                onChange={handleFileChange}
                accept="image/*"
                capture="environment"
                className="hidden"
            />
            
            <header className="flex items-center p-4 shrink-0 border-b border-zinc-800">
                <button onClick={onClose} className="p-2 -ml-2 mr-2 text-zinc-400 hover:text-zinc-200">
                    <Icon type="arrow-left" className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold">{initialData ? 'Edit Photo' : 'Add Photo'}</h1>
            </header>

            <main className="flex-grow overflow-y-auto p-4 space-y-6">
                <div className="aspect-[3/4] bg-zinc-800 rounded-lg flex items-center justify-center overflow-hidden">
                    {imageSrc ? (
                        <img src={imageSrc} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                        <div className="text-center text-zinc-500">
                            <Icon type="photo" className="w-16 h-16 mx-auto" />
                            <p className="mt-2 text-sm">Your photo will appear here</p>
                        </div>
                    )}
                </div>

                {imageSrc ? (
                    <>
                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label htmlFor="photo-type-select" className="text-xs text-zinc-400 mb-1 block">Photo Type *</label>
                                <select
                                    id="photo-type-select"
                                    value={photoType}
                                    onChange={(e) => setPhotoType(e.target.value)}
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                >
                                    <option value="" disabled>Select photo type...</option>
                                    <option value="Front">Front</option>
                                    <option value="Back">Back</option>
                                    <option value="Side">Side</option>
                                </select>
                            </div>
                             <div>
                                <label htmlFor="photo-date" className="text-xs text-zinc-400 mb-1 block">Date</label>
                                <input
                                    type="date"
                                    id="photo-date"
                                    value={photoDate}
                                    onChange={(e) => setPhotoDate(e.target.value)}
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="description" className="text-xs text-zinc-400 mb-1 block">Description</label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Add notes about this photo..."
                                rows={3}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                        </div>
                        <button
                            onClick={() => galleryInputRef.current?.click()}
                            className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold py-3 rounded-lg text-center transition-colors"
                        >
                            Replace Photo...
                        </button>
                    </>
                ) : (
                    <div className="space-y-3">
                        <button
                            onClick={() => galleryInputRef.current?.click()}
                            className="w-full flex items-center justify-center space-x-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold py-3 rounded-lg text-center transition-colors"
                        >
                             <Icon type="photo" className="w-5 h-5" />
                             <span>Choose from Gallery</span>
                        </button>
                        <button
                            onClick={() => cameraInputRef.current?.click()}
                            className="w-full flex items-center justify-center space-x-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold py-3 rounded-lg text-center transition-colors"
                        >
                            <Icon type="video-camera" className="w-5 h-5" />
                            <span>Take Photo</span>
                        </button>
                    </div>
                )}
            </main>

            <footer className="p-4 border-t border-zinc-800">
                <button
                    onClick={handleSave}
                    disabled={!imageSrc || !photoType}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-200 disabled:bg-zinc-600 disabled:cursor-not-allowed"
                >
                    Save
                </button>
            </footer>
        </div>
    );
};

export default AddPhotoPage;