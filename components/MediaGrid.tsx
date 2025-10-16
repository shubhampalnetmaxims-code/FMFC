import React from 'react';

interface MediaGridProps {
    imageUrls: string[];
    onImageClick: (url: string) => void;
}

const MediaGrid: React.FC<MediaGridProps> = ({ imageUrls, onImageClick }) => {
    if (imageUrls.length === 0) {
        return (
            <div className="text-center py-16 text-zinc-500">
                <p>No photos have been shared in this community yet.</p>
            </div>
        );
    }
    
    return (
        <div className="grid grid-cols-3 gap-1 p-4">
            {imageUrls.map((url, index) => (
                <button 
                    key={index} 
                    className="aspect-square bg-zinc-800 group focus:outline-none focus:ring-2 focus:ring-amber-500"
                    onClick={() => onImageClick(url)}
                >
                    <img 
                        src={url} 
                        alt={`Community media ${index + 1}`} 
                        className="w-full h-full object-cover transition-opacity group-hover:opacity-80"
                    />
                </button>
            ))}
        </div>
    );
};

export default MediaGrid;