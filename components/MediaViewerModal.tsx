import React from 'react';
import Icon from './Icon';

interface MediaViewerModalProps {
    imageUrl: string;
    onClose: () => void;
}

const MediaViewerModal: React.FC<MediaViewerModalProps> = ({ imageUrl, onClose }) => {
    
    const getFileNameFromUrl = (url: string) => {
        try {
            const path = new URL(url).pathname;
            return path.substring(path.lastIndexOf('/') + 1) || 'image.jpg';
        } catch (e) {
            return 'image.jpg';
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center" onClick={onClose}>
            <div className="relative max-w-4xl max-h-[90vh] p-4" onClick={(e) => e.stopPropagation()}>
                <img src={imageUrl} alt="Full size media" className="w-auto h-auto max-w-full max-h-full object-contain rounded-lg" />
                <div className="absolute top-4 right-4 flex space-x-2">
                     <a
                        href={imageUrl}
                        download={getFileNameFromUrl(imageUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-black/50 text-white rounded-full p-2 hover:bg-black/80 transition-colors"
                        title="Download image"
                    >
                        <Icon type="download" className="w-6 h-6" />
                    </a>
                    <button
                        onClick={onClose}
                        className="bg-black/50 text-white rounded-full p-2 hover:bg-black/80 transition-colors"
                        aria-label="Close media viewer"
                    >
                        <span className="text-2xl leading-none">&times;</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MediaViewerModal;
