
import React from 'react';
import Icon from '../components/Icon';

interface UnderDevelopmentPageProps {
    pageName: string;
    onMenuClick: () => void;
    showHeader?: boolean;
    onBack?: () => void;
}

const UnderDevelopmentPage: React.FC<UnderDevelopmentPageProps> = ({ pageName, onMenuClick, showHeader = true, onBack }) => {
    return (
        <div className="w-full max-w-lg mx-auto h-full flex flex-col">
             {showHeader && (
                <header className="sticky top-0 bg-zinc-950/80 backdrop-blur-sm z-10 p-4 shrink-0">
                    <div className="flex justify-between items-center">
                        <div className="w-8">
                            {onBack ? (
                                <button onClick={onBack} className="text-zinc-400 hover:text-zinc-200">
                                    <Icon type="arrow-left" className="w-6 h-6" />
                                </button>
                            ) : (
                                <button onClick={onMenuClick} className="text-zinc-400 hover:text-zinc-200">
                                    <Icon type="menu" className="w-6 h-6" />
                                </button>
                            )}
                        </div>
                        <h1 className="text-xl font-bold text-zinc-100 uppercase tracking-wider">{pageName}</h1>
                        <div className="w-8">
                            <button className="relative text-zinc-400 hover:text-zinc-200">
                                <Icon type="bell" className="w-6 h-6" />
                                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-zinc-950"></span>
                            </button>
                        </div>
                    </div>
                </header>
             )}
            <main className="flex flex-col items-center justify-center flex-grow text-center px-4">
                 <div className="text-6xl mb-4">🚧</div>
                <h1 className="text-2xl font-bold text-zinc-200 mb-2">Coming Soon!</h1>
                <p className="text-zinc-400 max-w-md">
                    The <span className="font-semibold text-amber-400">{pageName}</span> section is currently under development.
                    We're working hard to bring you this feature. Please check back later!
                </p>
            </main>
        </div>
    );
};

export default UnderDevelopmentPage;