
import React, { useState, useEffect, useRef } from 'react';
import Icon from '../components/Icon';
import { DietIntakeItem } from '../types';

interface BarcodeScannerPageProps {
    onClose: () => void;
    onScan: (data: Omit<DietIntakeItem, 'id' | 'meal' | 'date'>) => void;
}

const BarcodeScannerPage: React.FC<BarcodeScannerPageProps> = ({ onClose, onScan }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [status, setStatus] = useState('Initializing camera...');

    useEffect(() => {
        let stream: MediaStream | null = null;
        
        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
            .then(s => {
                stream = s;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
                setStatus('Scanning for barcode...');
            })
            .catch(err => {
                console.error("Camera error:", err);
                setStatus('Could not access camera. Please check permissions.');
            });

        return () => {
            stream?.getTracks().forEach(track => track.stop());
        };
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setStatus('Barcode found!');
            
            const scannedData: Omit<DietIntakeItem, 'id' | 'meal' | 'date'> = {
                description: 'Protein Bar, Chocolate Fudge',
                quantity: 1,
                energy: 210,
                carbohydrates: 24,
                proteins: 20,
                fats: 6,
                fibre: 1,
                water: 5,
            };

            // Short delay to show "Barcode found!" message before closing
            setTimeout(() => {
                 onScan(scannedData);
            }, 500);

        }, 2000);

        return () => clearTimeout(timer);
    }, [onScan]);

    return (
        <div className="fixed inset-0 bg-black z-[80] flex flex-col justify-center items-center text-white">
            <video ref={videoRef} autoPlay playsInline muted className="absolute w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50" />
            
            <div className="relative z-10 flex flex-col items-center">
                <div className="relative w-64 h-32">
                     <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-lg" />
                     <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-lg" />
                     <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-lg" />
                     <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-lg" />
                </div>
                <p className="mt-4 text-lg font-semibold bg-black/50 px-4 py-2 rounded-md">{status}</p>
            </div>

            <button onClick={onClose} className="absolute top-4 left-4 p-2 z-20 bg-black/30 rounded-full">
                <Icon type="arrow-left" className="w-6 h-6 text-white" />
            </button>
        </div>
    );
};

export default BarcodeScannerPage;
    