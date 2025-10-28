import React, { useState, useEffect, useRef } from 'react';
import Icon from '../components/Icon';
import { DietIntakeItem } from '../types';

interface AiScanFlowProps {
    onClose: () => void;
    onComplete: (data: Omit<DietIntakeItem, 'id' | 'meal' | 'date'>) => void;
}

type ScanStep = 'camera' | 'preview' | 'loading';

const LOADING_MESSAGES = [
    "Analyzing image...",
    "Identifying ingredients...",
    "Calculating nutritional values...",
];

const AiScanFlow: React.FC<AiScanFlowProps> = ({ onClose, onComplete }) => {
    const [step, setStep] = useState<ScanStep>('camera');
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [description, setDescription] = useState('');
    const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);
    const videoRef = useRef<HTMLVideoElement>(null);
    
    // Effect for camera initialization and simulated capture
    useEffect(() => {
        let stream: MediaStream | null = null;

        if (step === 'camera') {
             navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
                .then(s => {
                    stream = s;
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                })
                .catch(err => {
                    console.error("Camera error:", err);
                    alert('Could not access camera. Please check permissions.');
                    onClose();
                });
            
            const captureTimeout = setTimeout(() => {
                setImageSrc('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto.format&fit=crop');
                setStep('preview');
            }, 2000);

            return () => {
                clearTimeout(captureTimeout);
                stream?.getTracks().forEach(track => track.stop());
            };
        }
    }, [step, onClose]);

    // Effect for loading animation
    useEffect(() => {
        if (step === 'loading') {
            let messageIndex = 0;
            const messageInterval = setInterval(() => {
                messageIndex = (messageIndex + 1) % LOADING_MESSAGES.length;
                setLoadingMessage(LOADING_MESSAGES[messageIndex]);
            }, 1000);

            const analysisTimeout = setTimeout(() => {
                const mockData = {
                    quantity: 1,
                    energy: 350,
                    carbohydrates: 15,
                    proteins: 8,
                    fats: 28,
                    fibre: 5,
                    water: 80,
                };
                onComplete({ description, ...mockData });
            }, 3500);

            return () => {
                clearInterval(messageInterval);
                clearTimeout(analysisTimeout);
            };
        }
    }, [step, description, onComplete]);

    const handleAnalyze = () => {
        if (!description.trim()) {
            alert('Please describe the food in the image.');
            return;
        }
        setStep('loading');
    };

    const renderContent = () => {
        switch (step) {
            case 'camera':
                return (
                    <div className="relative w-full h-full flex flex-col justify-center items-center">
                        <video ref={videoRef} autoPlay playsInline muted className="absolute w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50" />
                        <div className="relative z-10 text-center text-white">
                            <p className="text-lg font-semibold">Point camera at your food</p>
                            <p className="text-sm">Scanning automatically...</p>
                        </div>
                    </div>
                );
            case 'preview':
                return (
                    <div className="flex flex-col h-full">
                        <header className="flex items-center p-4 shrink-0">
                            <h1 className="text-xl font-bold">Describe Your Meal</h1>
                        </header>
                        <main className="flex-grow overflow-y-auto p-4 space-y-4">
                            {imageSrc && (
                                <img src={imageSrc} alt="Captured food" className="w-full rounded-lg object-cover" />
                            )}
                            <div>
                                <label htmlFor="description" className="text-xs text-zinc-400 mb-1 block">Description</label>
                                <input
                                    id="description"
                                    type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="e.g., Salad with chicken and avocado"
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                />
                            </div>
                        </main>
                        <footer className="p-4">
                            <button
                                onClick={handleAnalyze}
                                className="w-full bg-amber-400 hover:bg-amber-500 text-black font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-200"
                            >
                                Analyze with AI
                            </button>
                        </footer>
                    </div>
                );
            case 'loading':
                return (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <Icon type="spinner" className="w-16 h-16 text-amber-400 animate-spin" />
                        <p className="mt-4 text-lg font-semibold text-zinc-200">{loadingMessage}</p>
                    </div>
                );
        }
    };

    return (
        <div className="fixed inset-0 bg-zinc-950 z-[80] flex flex-col font-sans text-zinc-200">
             {step !== 'loading' && (
                <button onClick={onClose} className="absolute top-4 left-4 p-2 z-20 bg-black/30 rounded-full">
                    <Icon type="x" className="w-6 h-6 text-white" />
                </button>
            )}
            {renderContent()}
        </div>
    );
};

export default AiScanFlow;