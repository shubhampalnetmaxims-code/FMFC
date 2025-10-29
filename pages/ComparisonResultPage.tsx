
import React from 'react';
import Icon from '../components/Icon';
import { UserPhoto } from '../types';

interface ComparisonResultPageProps {
    comparisonData: {
        fromPhoto: UserPhoto;
        toPhoto: UserPhoto;
        description: string;
    };
    onBack: () => void;
    onShare: (data: { fromPhoto: UserPhoto; toPhoto: UserPhoto; description: string }) => void;
}

const ComparisonResultPage: React.FC<ComparisonResultPageProps> = ({ comparisonData, onBack, onShare }) => {
    const { fromPhoto, toPhoto, description } = comparisonData;

    return (
        <div className="h-full flex flex-col bg-zinc-950 text-zinc-200">
            <header className="sticky top-0 bg-zinc-950/80 backdrop-blur-sm z-10 flex items-center p-4">
                <button onClick={onBack} className="mr-4 text-zinc-400 hover:text-zinc-200">
                    <Icon type="arrow-left" />
                </button>
                <h1 className="text-xl font-bold text-white">Your Comparison</h1>
            </header>

            <main className="flex-grow overflow-y-auto p-4 space-y-4">
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <img src={fromPhoto.src} alt="From" className="w-full h-auto object-cover rounded-lg" />
                        <div className="text-center mt-2">
                            <p className="font-semibold text-sm text-zinc-300">From</p>
                            <p className="text-xs text-zinc-400">{fromPhoto.date}</p>
                        </div>
                    </div>
                    <div>
                        <img src={toPhoto.src} alt="To" className="w-full h-auto object-cover rounded-lg" />
                         <div className="text-center mt-2">
                            <p className="font-semibold text-sm text-zinc-300">To</p>
                            <p className="text-xs text-zinc-400">{toPhoto.date}</p>
                        </div>
                    </div>
                </div>

                {description && (
                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                        <p className="text-sm text-zinc-300 whitespace-pre-wrap">{description}</p>
                    </div>
                )}
            </main>

            <footer className="p-4 border-t border-zinc-800 sticky bottom-0 bg-zinc-950">
                <button
                    onClick={() => onShare(comparisonData)}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                    <Icon type="share" className="w-5 h-5" />
                    <span>Share to Community</span>
                </button>
            </footer>
        </div>
    );
};

export default ComparisonResultPage;
