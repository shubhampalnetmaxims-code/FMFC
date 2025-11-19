
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Workout, Exercise } from '../types';
import Icon from '../components/Icon';
import { useToast } from '../components/ToastProvider';

interface WorkoutSessionPageProps {
    workout: Workout;
    onClose: () => void;
    onComplete: () => void;
}

type SessionPhase = 'get-ready' | 'exercise' | 'rest' | 'completed';

interface FlatExerciseItem {
    exercise: Exercise;
    durationSeconds: number; // Calculated from set duration / num exercises
    setIndex: number;
    totalIndex: number;
}

const WorkoutSessionPage: React.FC<WorkoutSessionPageProps> = ({ workout, onClose, onComplete }) => {
    const { addToast } = useToast();
    
    // --- STATE ---
    const [phase, setPhase] = useState<SessionPhase>('get-ready');
    const [flatExercises, setFlatExercises] = useState<FlatExerciseItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(10); // Start with 10s Get Ready
    const [isPaused, setIsPaused] = useState(false);
    const [isCasting, setIsCasting] = useState(false);
    const [showCastModal, setShowCastModal] = useState(false);
    const [connectedDevice, setConnectedDevice] = useState<string | null>(null);
    const [showExitConfirmation, setShowExitConfirmation] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);

    // --- INITIALIZATION ---
    useEffect(() => {
        const flat: FlatExerciseItem[] = [];
        let totalIdx = 0;
        
        workout.phases.forEach(phase => {
            phase.sets.forEach((set, setIdx) => {
                const durationPerExercise = (set.duration * 60) / set.exercises.length;
                set.exercises.forEach(ex => {
                    flat.push({
                        exercise: ex,
                        durationSeconds: Math.floor(durationPerExercise),
                        setIndex: setIdx,
                        totalIndex: totalIdx++
                    });
                });
            });
        });
        setFlatExercises(flat);
    }, [workout]);

    // --- TIMER LOGIC ---
    useEffect(() => {
        if (phase === 'completed') return;
        
        let interval: number | undefined;

        if (!isPaused) {
            interval = window.setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        handleTimerComplete();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [isPaused, phase, currentIndex, flatExercises]);

    // Sync Video Play/Pause with State
    useEffect(() => {
        if (videoRef.current) {
            if (isPaused) {
                videoRef.current.pause();
            } else {
                videoRef.current.play().catch(e => console.log("Autoplay prevented", e));
            }
        }
    }, [isPaused, phase]);


    // --- HANDLERS ---

    const handleTimerComplete = () => {
        if (phase === 'get-ready') {
            startExercise(0);
        } else if (phase === 'exercise') {
            finishExercise();
        } else if (phase === 'rest') {
            startExercise(currentIndex + 1);
        }
    };

    const startExercise = (index: number) => {
        if (index >= flatExercises.length) {
            setPhase('completed');
            return;
        }
        setCurrentIndex(index);
        setPhase('exercise');
        setTimeLeft(flatExercises[index].durationSeconds);
        setIsPaused(false);
    };

    const finishExercise = () => {
        // Check if there is a next exercise
        if (currentIndex < flatExercises.length - 1) {
            setPhase('rest');
            setTimeLeft(30); // 30 seconds rest
            setIsPaused(false);
        } else {
            setPhase('completed');
        }
    };

    const handleSkip = () => {
        if (phase === 'rest') {
            // Skip rest -> start next exercise immediately
            startExercise(currentIndex + 1);
        } else {
            // Skip exercise -> go to rest
            finishExercise();
        }
    };

    const handleTogglePause = () => {
        setIsPaused(!isPaused);
    };

    const handleConnectToTv = () => {
        // Simulate connection delay
        setTimeout(() => {
            setConnectedDevice("Dummy TV");
            setIsCasting(true);
            setShowCastModal(false);
            addToast("Connected to Dummy TV", 'success');
        }, 1500);
    };

    const handleStopCasting = () => {
        setIsCasting(false);
        setConnectedDevice(null);
        addToast("Disconnected from TV", 'info');
    };
    
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const currentItem = flatExercises[currentIndex];
    const nextItem = flatExercises[currentIndex + 1];

    // --- RENDERERS ---

    if (phase === 'get-ready') {
        return (
            <div className="h-full flex flex-col items-center justify-center bg-zinc-900 text-zinc-100 animate-slide-in relative">
                 <button onClick={() => setShowExitConfirmation(true)} className="absolute top-4 left-4 bg-black/40 p-2 rounded-full text-white backdrop-blur-sm z-50">
                    <Icon type="x" className="w-6 h-6" />
                </button>
                <h1 className="text-4xl font-bold text-amber-400 mb-8 uppercase tracking-wider">Get Ready</h1>
                <div className="text-9xl font-black text-white tabular-nums">
                    {timeLeft}
                </div>
                <p className="mt-8 text-zinc-400 text-lg">Up Next: {flatExercises[0]?.exercise.name}</p>
                <button onClick={() => setTimeLeft(0)} className="mt-12 px-8 py-3 bg-zinc-800 rounded-full text-sm font-semibold text-zinc-300">
                    Skip
                </button>
                {showExitConfirmation && (
                    <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-6">
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-sm p-6 text-center">
                            <h2 className="text-xl font-bold text-white mb-2">End Workout?</h2>
                            <p className="text-zinc-400 mb-6">Current progress will be lost.</p>
                            <div className="space-y-3">
                                <button onClick={onClose} className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl">
                                    End & Discard
                                </button>
                                <button onClick={() => setShowExitConfirmation(false)} className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold py-3 rounded-xl">
                                    Continue Workout
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    if (phase === 'completed') {
        return (
            <div className="h-full flex flex-col items-center justify-center bg-zinc-900 text-zinc-100 p-6 text-center animate-slide-in">
                <div className="w-24 h-24 bg-amber-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-amber-500/20">
                    <Icon type="check" className="w-12 h-12 text-black" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Workout Completed!</h1>
                <p className="text-zinc-400 mb-8">You crushed {workout.title}. Great job!</p>
                
                <div className="grid grid-cols-2 gap-4 w-full max-w-xs mb-8">
                    <div className="bg-zinc-800 p-4 rounded-xl">
                        <p className="text-2xl font-bold text-white">{workout.duration}</p>
                        <p className="text-xs text-zinc-500 uppercase">Minutes</p>
                    </div>
                    <div className="bg-zinc-800 p-4 rounded-xl">
                        <p className="text-2xl font-bold text-white">{flatExercises.length}</p>
                        <p className="text-xs text-zinc-500 uppercase">Exercises</p>
                    </div>
                </div>

                <button 
                    onClick={onComplete}
                    className="w-full max-w-xs bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 px-4 rounded-lg transition-colors"
                >
                    Finish
                </button>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-zinc-950 text-zinc-200 relative">
             {/* Exit Confirmation Modal */}
            {showExitConfirmation && (
                <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-6">
                     <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-sm p-6 text-center shadow-2xl">
                        <h2 className="text-xl font-bold text-white mb-2">End Workout?</h2>
                        <p className="text-zinc-400 mb-6">Current progress will be lost.</p>
                        <div className="space-y-3">
                            <button onClick={onClose} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-colors">
                                End & Discard
                            </button>
                            <button onClick={() => setShowExitConfirmation(false)} className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold py-3 rounded-xl transition-colors">
                                Continue Workout
                            </button>
                        </div>
                     </div>
                </div>
            )}

            {/* Header */}
            <header className="absolute top-0 left-0 right-0 z-20 p-4 flex justify-between items-start bg-gradient-to-b from-black/80 to-transparent">
                <button onClick={() => setShowExitConfirmation(true)} className="bg-black/40 p-2 rounded-full text-white backdrop-blur-sm">
                    <Icon type="x" className="w-6 h-6" />
                </button>
                <button 
                    onClick={() => isCasting ? handleStopCasting() : setShowCastModal(true)} 
                    className={`p-2 rounded-full backdrop-blur-sm flex items-center space-x-2 px-3 ${isCasting ? 'bg-amber-500 text-black' : 'bg-black/40 text-white'}`}
                >
                    <Icon type="video-camera" className="w-6 h-6" />
                    {isCasting && <span className="text-xs font-bold">TV</span>}
                </button>
            </header>

            {/* Video / Main Content Area */}
            <div className="relative w-full aspect-[4/3] bg-black flex items-center justify-center overflow-hidden shrink-0">
                {phase === 'rest' ? (
                    <div className="absolute inset-0 bg-zinc-900 flex flex-col items-center justify-center text-center p-6">
                         <h2 className="text-2xl font-bold text-amber-400 mb-4">REST</h2>
                         <div className="text-6xl font-black text-white mb-6 tabular-nums">{timeLeft}</div>
                         <button onClick={handleSkip} className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-full text-sm font-semibold transition-colors mb-6">
                            Skip Rest
                        </button>
                         {nextItem && (
                             <div className="bg-zinc-800/50 p-4 rounded-xl max-w-xs w-full flex items-center text-left">
                                 <img src={nextItem.exercise.image} className="w-16 h-16 rounded-lg object-cover mr-4 bg-zinc-700"/>
                                 <div>
                                     <p className="text-xs text-zinc-400 uppercase">Up Next</p>
                                     <p className="font-bold text-zinc-100 leading-tight">{nextItem.exercise.name}</p>
                                 </div>
                             </div>
                         )}
                    </div>
                ) : (
                    // Exercise Phase
                    <>
                        {isCasting ? (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900">
                                <Icon type="video-camera" className="w-16 h-16 text-zinc-600 mb-4" />
                                <p className="text-lg font-bold text-zinc-300">Casting to {connectedDevice}</p>
                                <p className="text-sm text-zinc-500">Look at the TV for the video</p>
                            </div>
                        ) : (
                            currentItem?.exercise.videoUrl ? (
                                <video 
                                    ref={videoRef}
                                    src={currentItem.exercise.videoUrl}
                                    className="w-full h-full object-cover"
                                    playsInline
                                    loop
                                    muted // Muted for autoplay usually
                                    poster={currentItem.exercise.image}
                                />
                            ) : (
                                <img src={currentItem?.exercise.image} className="w-full h-full object-cover opacity-80" alt="Exercise" />
                            )
                        )}
                        
                        {/* Overlay Info on Video */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                            <h2 className="text-2xl font-bold text-white">{currentItem?.exercise.name}</h2>
                            <div className="flex items-center space-x-2 text-amber-400 mt-1">
                                <Icon type="fire" className="w-4 h-4"/>
                                <span className="font-bold text-lg">{timeLeft}s</span>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Controls Area */}
            <div className="flex-grow bg-zinc-950 p-6 flex flex-col items-center justify-between">
                 {/* Progress Bar */}
                <div className="w-full space-y-2">
                    <div className="flex justify-between text-xs text-zinc-500">
                        <span>Exercise {currentIndex + 1} of {flatExercises.length}</span>
                        <span>{Math.round(((currentIndex) / flatExercises.length) * 100)}% Completed</span>
                    </div>
                    <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                        <div 
                            className="bg-amber-400 h-full transition-all duration-500" 
                            style={{ width: `${((currentIndex) / flatExercises.length) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Big Controls */}
                <div className="flex items-center justify-between w-full max-w-xs mb-8">
                     {/* Prev / Restart */}
                    <button 
                        onClick={() => startExercise(currentIndex > 0 ? currentIndex - 1 : 0)}
                        className="p-4 rounded-full text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300 transition-colors"
                        disabled={currentIndex === 0}
                    >
                        <Icon type="arrow-left" className="w-8 h-8" />
                    </button>

                    {/* Play/Pause - Only active during exercise, disabled during Rest for simplicity or skips rest */}
                    <button 
                        onClick={handleTogglePause}
                        className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center text-black shadow-lg shadow-amber-500/20 hover:scale-105 transition-transform active:scale-95"
                    >
                        {isPaused || phase === 'rest' ? (
                            <Icon type="arrow-right" className="w-8 h-8 ml-1" /> // Use arrow-right as play icon
                        ) : (
                            <div className="w-6 h-8 border-l-4 border-r-4 border-black mx-auto" /> // Custom pause icon visual
                        )}
                    </button>

                     {/* Next / Skip */}
                    <button 
                        onClick={handleSkip}
                        className="p-4 rounded-full text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300 transition-colors"
                    >
                         <Icon type="chevron-right" className="w-8 h-8" />
                    </button>
                </div>

                {/* Instructions / Next Up Preview Text */}
                <div className="w-full bg-zinc-900 rounded-xl p-4 min-h-[100px]">
                    {phase === 'rest' ? (
                         <div className="text-center">
                             <p className="text-zinc-400 text-sm mb-1">Catch your breath!</p>
                             <p className="text-zinc-500 text-xs">Take deep breaths and hydrate.</p>
                         </div>
                    ) : (
                        <div>
                            <h3 className="font-semibold text-zinc-300 mb-2 flex items-center">
                                <Icon type="check" className="w-4 h-4 text-amber-400 mr-2" />
                                Instructions
                            </h3>
                            <p className="text-sm text-zinc-400 line-clamp-3">
                                {currentItem?.exercise.steps?.[0] || "Focus on your form. Keep your core engaged and breathe rhythmically."}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Cast Modal */}
            {showCastModal && (
                <div className="fixed inset-0 bg-black/80 z-50 flex flex-col justify-end items-center" onClick={() => setShowCastModal(false)}>
                    <div className="w-full max-w-md bg-zinc-900 rounded-t-2xl p-6 border-t border-zinc-800 animate-slide-in-bottom shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="w-12 h-1.5 bg-zinc-700 rounded-full mx-auto mb-6" />
                        <h3 className="text-lg font-bold text-amber-400 mb-4 flex items-center">
                            <Icon type="video-camera" className="w-6 h-6 mr-3" />
                            Cast to Device
                        </h3>
                        <div className="space-y-3 mb-6">
                            <button 
                                onClick={() => handleConnectToTv()}
                                className="w-full flex items-center justify-between p-4 bg-zinc-800 rounded-xl hover:bg-zinc-700 transition-colors border border-zinc-700/50 group"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 bg-zinc-700/50 rounded-lg group-hover:bg-zinc-600 transition-colors">
                                        <Icon type="file-document" className="w-6 h-6 text-white" /> 
                                    </div>
                                    <span className="font-semibold text-white text-lg">Dummy TV</span>
                                </div>
                                <span className="text-xs font-bold text-green-400 bg-green-900/30 border border-green-900/50 px-3 py-1 rounded-md">Available</span>
                            </button>
                             <div className="p-4 text-center text-zinc-500 text-sm flex items-center justify-center space-x-3">
                                <Icon type="spinner" className="w-5 h-5 animate-spin text-amber-500" />
                                <span>Searching for devices...</span>
                            </div>
                        </div>
                        <button 
                            onClick={() => setShowCastModal(false)}
                            className="w-full py-4 bg-zinc-800 rounded-xl font-bold text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorkoutSessionPage;
