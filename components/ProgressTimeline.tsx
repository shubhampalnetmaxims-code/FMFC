import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { UserPhoto, UserNote } from '../types';
import Icon from './Icon';
import { useToast } from './ToastProvider';

interface ProgressTimelineProps {
    userPhotos: UserPhoto[];
    userNotes: UserNote[];
    onShare: (data: {
        before: UserPhoto;
        after: UserPhoto;
        generatedImage: string;
        description: string;
    }) => void;
}

const generateComparisonImage = async (before: UserPhoto, after: UserPhoto): Promise<string> => {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('Could not get canvas context');

        const img1 = new Image();
        const img2 = new Image();
        img1.crossOrigin = "anonymous";
        img2.crossOrigin = "anonymous";

        let img1Loaded = false;
        let img2Loaded = false;

        const draw = () => {
            if (!img1Loaded || !img2Loaded) return;
            
            const imgWidth = img1.naturalWidth || 600;
            const imgHeight = img1.naturalHeight || 800;
            
            canvas.width = imgWidth * 2;
            canvas.height = imgHeight + 100;

            ctx.fillStyle = '#18181b'; // zinc-900
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.drawImage(img1, 0, 100, imgWidth, imgHeight);
            ctx.drawImage(img2, imgWidth, 100, imgWidth, imgHeight);
            
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.fillRect(0, 100, canvas.width, 60);

            ctx.fillStyle = 'white';
            ctx.font = 'bold 32px sans-serif';
            ctx.textAlign = 'center';

            ctx.fillText('BEFORE', imgWidth / 2, 145);
            ctx.fillText('AFTER', imgWidth + (imgWidth / 2), 145);

            ctx.font = '24px sans-serif';
            ctx.fillText(before.date, imgWidth / 2, 80);
            ctx.fillText(after.date, imgWidth + (imgWidth / 2), 80);

            resolve(canvas.toDataURL('image/jpeg', 0.9));
        };

        img1.onload = () => { img1Loaded = true; draw(); };
        img2.onload = () => { img2Loaded = true; draw(); };
        img1.onerror = (e) => reject(`Image 1 failed to load: ${e}`);
        img2.onerror = (e) => reject(`Image 2 failed to load: ${e}`);

        img1.src = before.src;
        img2.src = after.src;
    });
};


const ProgressTimeline: React.FC<ProgressTimelineProps> = ({ userPhotos, userNotes, onShare }) => {
    const { addToast } = useToast();
    const [selectedType, setSelectedType] = useState('Front');
    const [sliderIndex, setSliderIndex] = useState(0);
    const [isSharing, setIsSharing] = useState(false);
    const [tooltip, setTooltip] = useState<{ visible: boolean; date: string; left: number }>({ visible: false, date: '', left: 0 });
    const sliderContainerRef = useRef<HTMLDivElement>(null);

    const photoTypes = useMemo(() => ['All', ...Array.from(new Set(userPhotos.map(p => p.type)))], [userPhotos]);

    const filteredPhotos = useMemo(() => {
        const photos = selectedType === 'All' ? userPhotos : userPhotos.filter(p => p.type === selectedType);
        return [...photos].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [userPhotos, selectedType]);

    useEffect(() => {
        setSliderIndex(0);
    }, [filteredPhotos.length, selectedType]);

    const updateTooltip = useCallback(() => {
        if (!sliderContainerRef.current || filteredPhotos.length < 2) return;

        const slider = sliderContainerRef.current.querySelector('input[type="range"]');
        if (!slider) return;

        const max = filteredPhotos.length - 2;
        const percent = max > 0 ? sliderIndex / max : 0;
        // FIX: Cast slider to HTMLInputElement to access offsetWidth property.
        const sliderWidth = (slider as HTMLInputElement).offsetWidth;
        const thumbWidth = 16; // Approximate thumb width
        const left = percent * (sliderWidth - thumbWidth) + (thumbWidth / 2);

        setTooltip(prev => ({
            ...prev,
            date: filteredPhotos[sliderIndex]?.date || '',
            left: left
        }));
    }, [sliderIndex, filteredPhotos]);

    useEffect(() => {
        updateTooltip();
        window.addEventListener('resize', updateTooltip);
        return () => window.removeEventListener('resize', updateTooltip);
    }, [updateTooltip]);

    const afterPhoto = filteredPhotos.length > 1 ? filteredPhotos[filteredPhotos.length - 1] : null;
    const beforePhoto = filteredPhotos.length > 0 ? filteredPhotos[sliderIndex] : null;

    const notesForDate = useMemo(() => {
        if (!beforePhoto) return [];
        return userNotes.filter(note => note.date === beforePhoto.date);
    }, [beforePhoto, userNotes]);

    const handleShare = useCallback(async () => {
        if (!beforePhoto || !afterPhoto) return;
        setIsSharing(true);
        try {
            const generatedImage = await generateComparisonImage(beforePhoto, afterPhoto);
            const timeDiff = new Date(afterPhoto.date).getTime() - new Date(beforePhoto.date).getTime();
            const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
            const description = `Check out my ${daysDiff}-day progress!`;
            onShare({ before: beforePhoto, after: afterPhoto, generatedImage, description });
        } catch (error) {
            console.error("Error generating comparison image:", error);
            addToast('Could not generate comparison image.', 'error');
        } finally {
            setIsSharing(false);
        }
    }, [beforePhoto, afterPhoto, onShare, addToast]);

    if (userPhotos.length === 0) {
        return null; // Don't render if no photos
    }
    
    return (
        <div className="p-4 mt-4">
            <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-zinc-200">Progress Timeline</h3>
                    <select
                        value={selectedType}
                        onChange={e => setSelectedType(e.target.value)}
                        className="bg-zinc-800 border border-zinc-700 text-zinc-300 text-sm font-semibold rounded-full px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none"
                    >
                        {photoTypes.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>
                
                {filteredPhotos.length < 2 && (
                    <div className="text-center py-10 text-zinc-500">
                        <p>Not enough photos of type "{selectedType}" to compare.</p>
                        <p className="text-sm">Add at least two to get started.</p>
                    </div>
                )}
                
                {filteredPhotos.length >= 2 && beforePhoto && afterPhoto && (
                    <>
                        <div className="grid grid-cols-2 gap-2 relative">
                            <PhotoCard photo={beforePhoto} label="BEFORE" />
                            <PhotoCard photo={afterPhoto} label="AFTER" />
                        </div>
                        <div 
                            ref={sliderContainerRef} 
                            className="mt-4 relative"
                            onMouseEnter={() => setTooltip(p => ({ ...p, visible: true }))}
                            onMouseLeave={() => setTooltip(p => ({ ...p, visible: false }))}
                        >
                            {tooltip.visible && (
                                <div 
                                    className="absolute bottom-full mb-2 bg-zinc-700 text-white text-xs font-bold px-2 py-1 rounded -translate-x-1/2 pointer-events-none"
                                    style={{ left: `${tooltip.left}px` }}
                                >
                                    {tooltip.date}
                                </div>
                            )}
                            <input
                                type="range"
                                min="0"
                                max={Math.max(0, filteredPhotos.length - 2)}
                                value={sliderIndex}
                                onInput={e => setSliderIndex(parseInt((e.target as HTMLInputElement).value, 10))}
                                className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer range-lg"
                            />
                        </div>

                        {notesForDate.length > 0 && (
                            <div className="mt-4 border-t border-zinc-800 pt-4">
                                <h4 className="font-semibold text-zinc-400 text-sm mb-2">Notes for {beforePhoto.date}</h4>
                                {notesForDate.map(note => (
                                    <p key={note.id} className="text-sm text-zinc-300 bg-zinc-800/50 p-2 rounded-md whitespace-pre-wrap">{note.content}</p>
                                ))}
                            </div>
                        )}

                        <button
                            onClick={handleShare}
                            disabled={isSharing}
                            className="w-full mt-4 flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors bg-amber-500 hover:bg-amber-600 text-black disabled:bg-zinc-600"
                        >
                            {isSharing ? <Icon type="spinner" className="w-5 h-5 animate-spin" /> : <Icon type="share" className="w-5 h-5" />}
                            <span>{isSharing ? 'Generating...' : 'Share Progress'}</span>
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

const PhotoCard: React.FC<{photo: UserPhoto, label: string}> = ({ photo, label }) => (
    <div className="aspect-[3/4] bg-zinc-800 rounded-lg overflow-hidden relative">
        <img src={photo.src} alt={`${label} - ${photo.date}`} className="w-full h-full object-cover"/>
        <div className="absolute top-0 left-0 w-full p-2 bg-gradient-to-b from-black/60 to-transparent">
            <h4 className="font-bold text-white text-sm tracking-widest">{label}</h4>
            <p className="text-xs text-zinc-300">{photo.date}</p>
        </div>
    </div>
);

export default ProgressTimeline;