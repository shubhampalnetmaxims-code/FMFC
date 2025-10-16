import React from 'react';

interface PremiumModalProps {
    onClose: () => void;
    onBuy: () => void;
}

const PremiumModal: React.FC<PremiumModalProps> = ({ onClose, onBuy }) => {
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-sm text-center p-8">
                <div className="text-5xl mb-4">✨</div>
                <h2 className="text-2xl font-bold text-white mb-2">Unlock Premium Feature</h2>
                <p className="text-zinc-400 mb-6">Creating your own community is a premium feature. Purchase now to connect with like-minded individuals and build your own fitness hub!</p>
                <div className="flex flex-col space-y-3">
                    <button 
                        onClick={onBuy}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-200"
                    >
                        Buy Now
                    </button>
                    <button 
                        onClick={onClose}
                        className="w-full bg-zinc-700 hover:bg-zinc-600 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-200"
                    >
                        Maybe Later
                    </button>
                </div>
                 <p className="text-xs text-zinc-500 mt-4">You will be redirected to the App Store / Play Store to complete your purchase.</p>
            </div>
        </div>
    );
};

export default PremiumModal;