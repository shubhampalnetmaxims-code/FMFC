
import React from 'react';
import { Exercise } from '../types';
import Icon from '../components/Icon';

interface ExerciseDetailsPageProps {
    exercise: Exercise;
    onBack: () => void;
}

const ExerciseDetailsPage: React.FC<ExerciseDetailsPageProps> = ({ exercise, onBack }) => {
    return (
        <div className="h-full flex flex-col bg-zinc-950 text-zinc-200">
            <header className="sticky top-0 bg-zinc-950/80 backdrop-blur-sm z-10 p-4 flex items-center border-b border-zinc-800">
                <button onClick={onBack} className="p-2 -ml-2 mr-2 text-zinc-400 hover:text-zinc-200">
                    <Icon type="arrow-left" className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold text-zinc-100">{exercise.name}</h1>
            </header>

            <main className="flex-grow overflow-y-auto p-4 space-y-6">
                {/* Video Section */}
                <div className="rounded-xl overflow-hidden bg-black aspect-video relative group border border-zinc-800">
                    {exercise.videoUrl ? (
                        <video 
                            src={exercise.videoUrl} 
                            controls 
                            className="w-full h-full object-cover" 
                            poster={exercise.image}
                        >
                            Your browser does not support the video tag.
                        </video>
                    ) : (
                        <div className="w-full h-full relative">
                            <img src={exercise.image} alt={exercise.name} className="w-full h-full object-cover opacity-70" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="bg-zinc-900/80 p-4 rounded-full">
                                    <Icon type="video-camera" className="w-8 h-8 text-zinc-400" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Instructions Section */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center">
                        <Icon type="check" className="w-5 h-5 text-amber-400 mr-2" />
                        Instructions
                    </h2>
                    <div className="space-y-4">
                        {exercise.steps && exercise.steps.length > 0 ? (
                            exercise.steps.map((step, index) => (
                                <div key={index} className="flex items-start">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-800 text-zinc-400 text-xs font-bold flex items-center justify-center mr-3 mt-0.5 border border-zinc-700">
                                        {index + 1}
                                    </span>
                                    <p className="text-zinc-300 text-sm leading-relaxed">{step}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-zinc-500 text-sm italic">No instructions available.</p>
                        )}
                    </div>
                </div>

                {/* Benefits Section */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center">
                        <Icon type="sparkles" className="w-5 h-5 text-amber-400 mr-2" />
                        Benefits
                    </h2>
                    <ul className="space-y-2">
                        {exercise.benefits && exercise.benefits.length > 0 ? (
                            exercise.benefits.map((benefit, index) => (
                                <li key={index} className="flex items-start text-sm text-zinc-300">
                                    <span className="mr-2 text-amber-500">•</span>
                                    {benefit}
                                </li>
                            ))
                        ) : (
                            <p className="text-zinc-500 text-sm italic">No benefits listed.</p>
                        )}
                    </ul>
                </div>
            </main>
        </div>
    );
};

export default ExerciseDetailsPage;
