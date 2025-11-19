
import React, { useState } from 'react';
import Icon from '../components/Icon';
import { Workout, WorkoutPhase, Exercise, WorkoutStyle, MuscleGroup, Equipment } from '../types';
import { WORKOUT_STYLES, MUSCLE_GROUPS, WORKOUT_DIFFICULTIES, EQUIPMENT_TYPES } from '../constants';
import { useToast } from '../components/ToastProvider';

interface CreateWorkoutPageProps {
    onClose: () => void;
    onSave: (workout: Workout, isPrivate: boolean) => void;
}

type Step = 'details' | 'builder' | 'review';

// Placeholder image for custom exercises if none provided
const DEFAULT_EXERCISE_IMAGE = 'https://images.unsplash.com/photo-1517836357463-d257692635c3?q=80&w=200&auto.format&fit=crop';

const AVAILABLE_EXERCISES: Partial<Exercise>[] = [
    { id: 'sq', name: 'Squat', image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=200&auto.format&fit=crop' },
    { id: 'pu', name: 'Push Up', image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=200&auto.format&fit=crop' },
    { id: 'bp', name: 'Bench Press', image: 'https://images.unsplash.com/photo-1571019614242-c5c5792c6c39?q=80&w=200&auto.format&fit=crop' },
    { id: 'dl', name: 'Deadlift', image: 'https://images.unsplash.com/photo-1581009137042-c552e485697a?q=80&w=200&auto.format&fit=crop' },
    { id: 'lu', name: 'Lunges', image: 'https://images.unsplash.com/photo-1434608519344-49d77a699e1d?q=80&w=200&auto.format&fit=crop' },
    { id: 'pl', name: 'Plank', image: 'https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?q=80&w=200&auto.format&fit=crop' },
    { id: 'pu-ll', name: 'Pull Up', image: 'https://images.unsplash.com/photo-1598971639058-79b9722e8a86?q=80&w=200&auto.format&fit=crop' },
    { id: 'bur', name: 'Burpees', image: 'https://images.unsplash.com/photo-1544367563-12123d8965cd?q=80&w=200&auto.format&fit=crop' },
    { id: 'jj', name: 'Jumping Jacks', image: 'https://images.unsplash.com/photo-1544367563-12123d8965cd?q=80&w=200&auto.format&fit=crop' },
    { id: 'mtn', name: 'Mountain Climbers', image: 'https://images.unsplash.com/photo-1434608519344-49d77a699e1d?q=80&w=200&auto.format&fit=crop' },
    { id: 'dips', name: 'Dips', image: 'https://images.unsplash.com/photo-1571019614242-c5c5792c6c39?q=80&w=200&auto.format&fit=crop' },
    { id: 'curls', name: 'Bicep Curls', image: 'https://images.unsplash.com/photo-1581009137042-c552e485697a?q=80&w=200&auto.format&fit=crop' },
];

const CreateWorkoutPage: React.FC<CreateWorkoutPageProps> = ({ onClose, onSave }) => {
    const { addToast } = useToast();
    const [step, setStep] = useState<Step>('details');

    // Step 1 State: Details
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [style, setStyle] = useState<WorkoutStyle>('Bodybuilding');
    const [muscleGroup, setMuscleGroup] = useState<MuscleGroup>('Chest'); // Default to Chest
    const [difficulty, setDifficulty] = useState<number>(3);
    const [equipment, setEquipment] = useState<Equipment>('Dumbbell');

    // Step 2 State: Builder
    const [phases, setPhases] = useState<WorkoutPhase[]>([]);
    const [isAddingPhase, setIsAddingPhase] = useState(false);
    const [newPhaseName, setNewPhaseName] = useState('');
    
    // Adding Exercise State
    const [isAddingExercise, setIsAddingExercise] = useState<{ phaseId: string } | null>(null);
    const [selectedExerciseId, setSelectedExerciseId] = useState('');

    // Step 3 State: Review
    const [isPrivate, setIsPrivate] = useState(true);

    // --- HANDLERS ---

    const handleNextStep = () => {
        if (step === 'details') {
            if (!title.trim()) {
                addToast('Please enter a workout title.', 'error');
                return;
            }
            setStep('builder');
        } else if (step === 'builder') {
            if (phases.length === 0) {
                addToast('Please add at least one section to your workout.', 'error');
                return;
            }
            // Check if all phases have exercises
            const emptyPhase = phases.find(p => p.sets.length === 0 || p.sets[0].exercises.length === 0);
            if (emptyPhase) {
                addToast(`Section "${emptyPhase.name}" has no exercises. Add some or remove the section.`, 'error');
                return;
            }
            setStep('review');
        }
    };

    const handleAddPhase = () => {
        if (!newPhaseName.trim()) {
            addToast('Section title is required.', 'error');
            return;
        }
        const newPhase: WorkoutPhase = {
            id: `phase-${Date.now()}`,
            name: newPhaseName,
            sets: [] // We will initialize with one empty set container that we'll fill with exercises
        };
        setPhases([...phases, newPhase]);
        setNewPhaseName('');
        setIsAddingPhase(false);
    };

    const handleAddExercise = () => {
        if (!isAddingExercise) return;
        if (!selectedExerciseId) {
            addToast('Please select an exercise.', 'error');
            return;
        }

        const selectedExInfo = AVAILABLE_EXERCISES.find(ex => ex.id === selectedExerciseId);
        const exerciseName = selectedExInfo?.name || 'Unknown Exercise';
        const exerciseImage = selectedExInfo?.image || DEFAULT_EXERCISE_IMAGE;

        const exercise: Exercise = {
            id: `ex-${Date.now()}`,
            name: exerciseName,
            image: exerciseImage, 
            steps: ['Perform the exercise with good form.'],
            benefits: ['Strength', 'Endurance']
        };

        setPhases(prev => prev.map(p => {
            if (p.id === isAddingExercise.phaseId) {
                // Check if a generic set already exists, if not create one
                let targetSet = p.sets[0];
                if (!targetSet) {
                    targetSet = {
                        id: `set-${Date.now()}`,
                        name: 'Circuit',
                        reps: 0, 
                        duration: 0, 
                        exercises: []
                    };
                    p.sets = [targetSet];
                }
                
                // Add exercise to the set
                targetSet.exercises.push(exercise);
                
                return { ...p };
            }
            return p;
        }));

        setSelectedExerciseId('');
        setIsAddingExercise(null);
    };

    const handleRemovePhase = (phaseId: string) => {
        setPhases(prev => prev.filter(p => p.id !== phaseId));
    };

    const handleRemoveExercise = (phaseId: string, exerciseId: string) => {
        setPhases(prev => prev.map(p => {
            if (p.id === phaseId) {
                if (p.sets.length > 0) {
                    p.sets[0].exercises = p.sets[0].exercises.filter(ex => ex.id !== exerciseId);
                }
            }
            return p;
        }));
    };

    const handleSave = () => {
        // Estimate duration: 3 mins per exercise + 2 mins per phase transition
        const totalExercises = phases.reduce((acc, p) => acc + (p.sets[0]?.exercises.length || 0), 0);
        const totalDuration = (totalExercises * 3) + (phases.length * 2);
        
        const newWorkout: Workout = {
            id: Date.now(),
            title,
            description: description || 'Custom workout',
            image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto.format&fit=crop',
            duration: Math.max(10, Math.ceil(totalDuration)),
            style,
            muscleGroup: muscleGroup as MuscleGroup, 
            day: 'Monday', 
            difficulty: difficulty as 1|2|3|4|5,
            equipment,
            phases,
            isTemplate: false
        };
        
        onSave(newWorkout, isPrivate);
    };

    // --- SUB-COMPONENTS ---
    
    const ProgressBar = () => {
        const steps = ['Details', 'Exercises', 'Review'];
        const currentIdx = steps.indexOf(step === 'details' ? 'Details' : step === 'builder' ? 'Exercises' : 'Review');
        
        return (
            <div className="flex items-center justify-between px-8 py-4">
                {steps.map((s, idx) => (
                    <div key={s} className="flex flex-col items-center">
                         <div className={`w-3 h-3 rounded-full mb-1 transition-colors duration-300 ${idx <= currentIdx ? 'bg-amber-400' : 'bg-zinc-800'}`} />
                         <span className={`text-[10px] uppercase font-bold tracking-wider ${idx <= currentIdx ? 'text-zinc-200' : 'text-zinc-600'}`}>{s}</span>
                    </div>
                ))}
            </div>
        );
    };

    // --- RENDERERS ---

    const renderDetailsStep = () => (
        <div className="space-y-6 p-4 animate-slide-in">
            <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 space-y-5">
                <h3 className="text-zinc-100 font-bold text-lg flex items-center">
                    <Icon type="file-document" className="w-5 h-5 mr-2 text-amber-400" />
                    Basic Info
                </h3>
                <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Workout Name</label>
                    <input
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="e.g. Morning Blast"
                        className="w-full bg-black border border-zinc-800 rounded-xl p-4 text-zinc-200 focus:outline-none focus:border-amber-500 transition-colors"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Description</label>
                    <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="Briefly describe the goal of this workout..."
                        rows={3}
                        className="w-full bg-black border border-zinc-800 rounded-xl p-4 text-zinc-200 focus:outline-none focus:border-amber-500 transition-colors resize-none"
                    />
                </div>
            </div>

            <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 space-y-5">
                 <h3 className="text-zinc-100 font-bold text-lg flex items-center">
                    <Icon type="cog" className="w-5 h-5 mr-2 text-amber-400" />
                    Categorization
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Style</label>
                        <div className="relative">
                             <select 
                                value={style} 
                                onChange={e => setStyle(e.target.value as WorkoutStyle)}
                                className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-zinc-300 focus:outline-none focus:border-amber-500 appearance-none"
                            >
                                {WORKOUT_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-zinc-500">
                                <Icon type="chevron-down" className="w-4 h-4" />
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Muscle Group</label>
                        <div className="relative">
                            <select 
                                value={muscleGroup} 
                                onChange={e => setMuscleGroup(e.target.value as MuscleGroup)}
                                className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-zinc-300 focus:outline-none focus:border-amber-500 appearance-none"
                            >
                                {MUSCLE_GROUPS.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-zinc-500">
                                <Icon type="chevron-down" className="w-4 h-4" />
                            </div>
                        </div>
                    </div>
                     <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Difficulty</label>
                        <div className="relative">
                            <select 
                                value={difficulty} 
                                onChange={e => setDifficulty(parseInt(e.target.value))}
                                className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-zinc-300 focus:outline-none focus:border-amber-500 appearance-none"
                            >
                                {WORKOUT_DIFFICULTIES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-zinc-500">
                                <Icon type="chevron-down" className="w-4 h-4" />
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Equipment</label>
                        <div className="relative">
                            <select 
                                value={equipment} 
                                onChange={e => setEquipment(e.target.value as Equipment)}
                                className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-zinc-300 focus:outline-none focus:border-amber-500 appearance-none"
                            >
                                {EQUIPMENT_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-zinc-500">
                                <Icon type="chevron-down" className="w-4 h-4" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderBuilderStep = () => (
        <div className="p-4 space-y-6 animate-slide-in">
             <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800 flex justify-between items-center">
                <div>
                    <h3 className="font-bold text-zinc-100 text-lg">{title}</h3>
                    <p className="text-zinc-500 text-sm uppercase tracking-wider mt-1">{style} · {muscleGroup}</p>
                </div>
                <div className="h-10 w-10 bg-amber-400/10 rounded-full flex items-center justify-center text-amber-400">
                    <Icon type="workouts" className="w-6 h-6" />
                </div>
            </div>

            <div className="space-y-4">
                {phases.map((phase, index) => (
                    <div key={phase.id} className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden shadow-md transition-all hover:border-zinc-700">
                        <div className="p-4 flex justify-between items-center border-b border-zinc-800 bg-zinc-900">
                            <h4 className="font-bold text-zinc-200 flex items-center">
                                <span className="bg-zinc-800 text-zinc-400 text-xs font-bold px-2 py-1 rounded mr-3">#{index + 1}</span>
                                {phase.name}
                            </h4>
                            <button onClick={() => handleRemovePhase(phase.id)} className="text-zinc-500 hover:text-red-500 transition-colors p-1">
                                <Icon type="trash" className="w-4 h-4"/>
                            </button>
                        </div>
                        <div className="p-2">
                            <div className="space-y-1">
                                {phase.sets[0]?.exercises.map((ex, idx) => (
                                    <div key={ex.id} className="flex items-center bg-black p-2 rounded-xl border border-zinc-800">
                                        <img 
                                            src={ex.image || DEFAULT_EXERCISE_IMAGE} 
                                            alt={ex.name} 
                                            className="w-10 h-10 rounded-lg object-cover mr-3 bg-zinc-800"
                                        />
                                        <span className="text-zinc-200 font-medium flex-grow text-sm">{ex.name}</span>
                                        <button onClick={() => handleRemoveExercise(phase.id, ex.id)} className="text-zinc-600 hover:text-red-400 p-2">
                                            <Icon type="x" className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            
                            {phase.sets[0]?.exercises.length === 0 && (
                                <div className="text-center py-6">
                                    <p className="text-sm text-zinc-500">No exercises yet.</p>
                                </div>
                            )}

                            {isAddingExercise?.phaseId === phase.id ? (
                                <div className="mt-3 p-3 bg-black rounded-xl border border-amber-500/30 animate-slide-in">
                                    <label className="block text-xs font-bold text-amber-500 uppercase tracking-wider mb-2">Select Exercise</label>
                                    <div className="relative">
                                        <select
                                            autoFocus
                                            value={selectedExerciseId}
                                            onChange={e => setSelectedExerciseId(e.target.value)}
                                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-3 text-sm text-white focus:outline-none focus:border-amber-500 appearance-none"
                                        >
                                            <option value="" disabled>Choose an exercise...</option>
                                            {AVAILABLE_EXERCISES.map(ex => (
                                                <option key={ex.id} value={ex.id}>{ex.name}</option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-zinc-500">
                                            <Icon type="chevron-down" className="w-4 h-4" />
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-end space-x-3 mt-3">
                                        <button onClick={() => setIsAddingExercise(null)} className="px-4 py-2 text-xs font-bold text-zinc-400 hover:text-white uppercase tracking-wide">Cancel</button>
                                        <button onClick={handleAddExercise} className="px-4 py-2 bg-amber-500 text-black text-xs font-bold rounded-lg hover:bg-amber-600 uppercase tracking-wide">Add</button>
                                    </div>
                                </div>
                            ) : (
                                <button 
                                    onClick={() => setIsAddingExercise({ phaseId: phase.id })}
                                    className="w-full py-3 mt-2 border-2 border-dashed border-zinc-800 text-zinc-500 rounded-xl text-sm font-semibold hover:border-amber-500/50 hover:text-amber-400 hover:bg-zinc-900 transition-all flex items-center justify-center space-x-2"
                                >
                                    <Icon type="plus" className="w-4 h-4" />
                                    <span>Add Exercise</span>
                                </button>
                            )}
                            
                            <div className="mt-2 px-2 pb-1 flex items-center justify-between text-xs font-medium text-zinc-500">
                                <span>Section Break</span>
                                <div className="flex items-center space-x-2 bg-black px-2 py-1 rounded-lg border border-zinc-800">
                                    <Icon type="session" className="w-3 h-3" />
                                    <span>60s</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {isAddingPhase ? (
                    <div className="bg-zinc-900 p-5 rounded-2xl border border-amber-500/50 animate-slide-in-bottom shadow-lg">
                        <label className="block text-xs font-bold text-amber-500 uppercase tracking-wider mb-2">New Section Title</label>
                        <input
                            autoFocus
                            type="text"
                            value={newPhaseName}
                            onChange={e => setNewPhaseName(e.target.value)}
                            placeholder="e.g. Warmup, Core, Main Lift"
                            className="w-full bg-black border border-zinc-700 rounded-xl p-4 text-zinc-200 mb-4 focus:outline-none focus:border-amber-500 transition-colors"
                        />
                        <div className="flex justify-end space-x-3">
                            <button onClick={() => setIsAddingPhase(false)} className="px-4 py-2 text-zinc-400 text-sm font-bold uppercase tracking-wide">Cancel</button>
                            <button onClick={handleAddPhase} className="px-6 py-3 bg-amber-500 text-black text-sm font-bold rounded-xl hover:bg-amber-600 uppercase tracking-wide">Create Section</button>
                        </div>
                    </div>
                ) : (
                    <button 
                        onClick={() => setIsAddingPhase(true)}
                        className="w-full py-5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-2xl text-zinc-300 font-bold flex items-center justify-center space-x-2 transition-all shadow-sm"
                    >
                        <Icon type="plus" className="w-5 h-5 text-amber-400" />
                        <span>Add New Section</span>
                    </button>
                )}
            </div>
        </div>
    );

    const renderReviewStep = () => (
        <div className="p-4 space-y-8 animate-slide-in">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-white">Almost Done!</h2>
                <p className="text-zinc-400 text-sm">Review your workout details before creating.</p>
            </div>

            <div className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl">
                 <div className="relative h-48">
                    <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto.format&fit=crop" alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-2xl font-bold text-white mb-1">{title}</h3>
                        <p className="text-zinc-300 text-sm">{description}</p>
                    </div>
                </div>
                <div className="p-5 space-y-4">
                    <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-zinc-800 text-zinc-300 text-xs font-bold uppercase tracking-wider rounded-full">{style}</span>
                        <span className="px-3 py-1 bg-zinc-800 text-zinc-300 text-xs font-bold uppercase tracking-wider rounded-full">{muscleGroup}</span>
                        <span className="px-3 py-1 bg-zinc-800 text-zinc-300 text-xs font-bold uppercase tracking-wider rounded-full">{difficulty} / 5</span>
                    </div>
                    
                    <div className="border-t border-zinc-800 pt-4 flex justify-between items-center text-sm">
                        <span className="text-zinc-500">Total Sections</span>
                        <span className="text-zinc-200 font-bold">{phases.length}</span>
                    </div>
                     <div className="flex justify-between items-center text-sm">
                        <span className="text-zinc-500">Total Exercises</span>
                        <span className="text-zinc-200 font-bold">{phases.reduce((acc, p) => acc + (p.sets[0]?.exercises.length || 0), 0)}</span>
                    </div>
                </div>
                
                <div className="bg-black p-4 border-t border-zinc-800 flex items-center justify-between">
                    <div>
                        <p className="font-bold text-zinc-200">Private Workout</p>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-0.5">Only visible to you</p>
                    </div>
                    <button
                        onClick={() => setIsPrivate(!isPrivate)}
                        className={`${
                            isPrivate ? 'bg-amber-500' : 'bg-zinc-800'
                        } relative inline-flex items-center h-7 rounded-full w-12 transition-colors focus:outline-none`}
                    >
                        <span className={`${
                            isPrivate ? 'translate-x-6 bg-black' : 'translate-x-1 bg-zinc-500'
                        } inline-block w-5 h-5 transform rounded-full transition-transform`} />
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="h-full flex flex-col bg-zinc-950 text-zinc-200">
            <header className="border-b border-zinc-800 bg-zinc-950 sticky top-0 z-20">
                <div className="flex items-center justify-between p-4">
                    <button onClick={step === 'details' ? onClose : () => setStep(step === 'builder' ? 'details' : 'builder')} className="p-2 -ml-2 text-zinc-400 hover:text-zinc-200 transition-colors">
                        <Icon type="arrow-left" className="w-6 h-6" />
                    </button>
                    <h1 className="text-lg font-bold uppercase tracking-wider">Create Workout</h1>
                    <div className="w-8" /> {/* Spacer */}
                </div>
                <ProgressBar />
            </header>

            <main className="flex-grow overflow-y-auto">
                {step === 'details' && renderDetailsStep()}
                {step === 'builder' && renderBuilderStep()}
                {step === 'review' && renderReviewStep()}
            </main>

            <footer className="p-5 border-t border-zinc-800 shrink-0 bg-zinc-950">
                {step === 'review' ? (
                    <button
                        onClick={handleSave}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-4 px-4 rounded-xl transition-all transform active:scale-[0.98] shadow-lg shadow-amber-500/20"
                    >
                        Create Workout
                    </button>
                ) : (
                     <button
                        onClick={handleNextStep}
                        className="w-full bg-zinc-100 hover:bg-white text-black font-bold py-4 px-4 rounded-xl transition-all transform active:scale-[0.98]"
                    >
                        Next Step
                    </button>
                )}
            </footer>
        </div>
    );
};

export default CreateWorkoutPage;
