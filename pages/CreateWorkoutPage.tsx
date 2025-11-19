
import React, { useState } from 'react';
import Icon from '../components/Icon';
import { Workout, WorkoutPhase, ExerciseSet, Exercise, WorkoutStyle, MuscleGroup, WorkoutDay, Equipment } from '../types';
import { WORKOUT_STYLES, MUSCLE_GROUPS, WORKOUT_DAYS, WORKOUT_DIFFICULTIES, EQUIPMENT_TYPES } from '../constants';
import { useToast } from '../components/ToastProvider';

interface CreateWorkoutPageProps {
    onClose: () => void;
    onSave: (workout: Workout, isPrivate: boolean) => void;
}

type Step = 'details' | 'builder' | 'review';

// Placeholder image for custom exercises if none provided
const DEFAULT_EXERCISE_IMAGE = 'https://images.unsplash.com/photo-1517836357463-d257692635c3?q=80&w=200&auto.format&fit=crop';

const CreateWorkoutPage: React.FC<CreateWorkoutPageProps> = ({ onClose, onSave }) => {
    const { addToast } = useToast();
    const [step, setStep] = useState<Step>('details');

    // Step 1 State: Details
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [style, setStyle] = useState<WorkoutStyle>('Bodybuilding');
    const [muscleGroup, setMuscleGroup] = useState<MuscleGroup>('Full Body' as MuscleGroup); // Cast as there is no Full Body in type, defaults to first valid later if needed or update type
    const [difficulty, setDifficulty] = useState<number>(3);
    const [equipment, setEquipment] = useState<Equipment>('Dumbbell');

    // Step 2 State: Builder
    const [phases, setPhases] = useState<WorkoutPhase[]>([]);
    const [isAddingPhase, setIsAddingPhase] = useState(false);
    const [newPhaseName, setNewPhaseName] = useState('');
    
    // Adding Exercise State
    const [isAddingExercise, setIsAddingExercise] = useState<{ phaseId: string } | null>(null);
    const [newExerciseName, setNewExerciseName] = useState('');
    const [newExerciseReps, setNewExerciseReps] = useState('');
    const [newExerciseDuration, setNewExerciseDuration] = useState(''); // in seconds/minutes
    const [breakTime, setBreakTime] = useState('60'); // Default break time in seconds for the phase

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
        if (!newExerciseName.trim()) {
            addToast('Exercise name is required.', 'error');
            return;
        }

        const exercise: Exercise = {
            id: `ex-${Date.now()}`,
            name: newExerciseName,
            image: DEFAULT_EXERCISE_IMAGE, // Default image
            steps: ['Perform the exercise with good form.'],
            benefits: ['Strength', 'Endurance']
        };

        setPhases(prev => prev.map(p => {
            if (p.id === isAddingExercise.phaseId) {
                // Check if a generic set already exists, if not create one
                // In this simplified builder, a Section (Phase) contains a list of exercises (which we group into one "Set" internally for the data structure)
                let targetSet = p.sets[0];
                if (!targetSet) {
                    targetSet = {
                        id: `set-${Date.now()}`,
                        name: 'Circuit',
                        reps: parseInt(newExerciseReps) || 10,
                        duration: parseInt(newExerciseDuration) || 0,
                        exercises: []
                    };
                    p.sets = [targetSet];
                }
                
                // Add exercise to the set
                // NOTE: ideally each exercise might have its own reps/duration in a more complex model, 
                // but the `ExerciseSet` type groups them. We will attach metadata to the Exercise object if strictly needed, 
                // or just assume the Set's params apply. 
                // For this simplified "Section -> Exercises" flow, we'll just push the exercise.
                targetSet.exercises.push(exercise);
                
                // Update set duration roughly
                targetSet.duration += (parseInt(newExerciseDuration) || 0);

                return { ...p };
            }
            return p;
        }));

        setNewExerciseName('');
        setNewExerciseReps('');
        setNewExerciseDuration('');
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
        const totalDuration = phases.reduce((acc, p) => acc + (p.sets[0]?.duration || 0), 0);
        
        const newWorkout: Workout = {
            id: Date.now(),
            title,
            description: description || 'Custom workout',
            image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto.format&fit=crop', // Generic gym image
            duration: Math.ceil(totalDuration), // Approximate minutes
            style,
            muscleGroup: muscleGroup as MuscleGroup, // Fallback cast
            day: 'Monday', // Default
            difficulty: difficulty as 1|2|3|4|5,
            equipment,
            phases,
            isTemplate: false
        };
        
        onSave(newWorkout, isPrivate);
    };

    // --- RENDERERS ---

    const renderDetailsStep = () => (
        <div className="space-y-6 p-4">
            <div>
                <label className="block text-sm text-zinc-400 mb-1">Workout Name</label>
                <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Morning Blast"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
            </div>
            <div>
                <label className="block text-sm text-zinc-400 mb-1">Description</label>
                <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Describe your workout..."
                    rows={3}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm text-zinc-400 mb-1">Style</label>
                    <select 
                        value={style} 
                        onChange={e => setStyle(e.target.value as WorkoutStyle)}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                        {WORKOUT_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm text-zinc-400 mb-1">Muscle Group</label>
                    <select 
                        value={muscleGroup} 
                        onChange={e => setMuscleGroup(e.target.value as MuscleGroup)}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                        {MUSCLE_GROUPS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                 <div>
                    <label className="block text-sm text-zinc-400 mb-1">Difficulty</label>
                    <select 
                        value={difficulty} 
                        onChange={e => setDifficulty(parseInt(e.target.value))}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                        {WORKOUT_DIFFICULTIES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm text-zinc-400 mb-1">Equipment</label>
                    <select 
                        value={equipment} 
                        onChange={e => setEquipment(e.target.value as Equipment)}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                        {EQUIPMENT_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>
        </div>
    );

    const renderBuilderStep = () => (
        <div className="p-4 space-y-4">
             <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 mb-4">
                <h3 className="font-bold text-zinc-100 text-lg">{title}</h3>
                <p className="text-zinc-400 text-sm">{style} · {muscleGroup}</p>
            </div>

            {phases.map((phase, index) => (
                <div key={phase.id} className="bg-zinc-800/50 rounded-xl border border-zinc-700 overflow-hidden">
                    <div className="p-4 flex justify-between items-center bg-zinc-800">
                        <h4 className="font-bold text-amber-400">Section {index + 1}: {phase.name}</h4>
                        <button onClick={() => handleRemovePhase(phase.id)} className="text-zinc-500 hover:text-red-500">
                            <Icon type="trash" className="w-4 h-4"/>
                        </button>
                    </div>
                    <div className="p-4 space-y-2">
                        {phase.sets[0]?.exercises.map((ex, idx) => (
                            <div key={ex.id} className="flex justify-between items-center bg-zinc-900 p-3 rounded-lg">
                                <span className="text-zinc-200">{idx + 1}. {ex.name}</span>
                                <button onClick={() => handleRemoveExercise(phase.id, ex.id)} className="text-zinc-600 hover:text-red-400">
                                    <Icon type="x" className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                        
                        {phase.sets[0]?.exercises.length === 0 && (
                            <p className="text-sm text-zinc-500 italic text-center py-2">No exercises added yet.</p>
                        )}

                        {isAddingExercise?.phaseId === phase.id ? (
                            <div className="mt-3 bg-zinc-900 p-3 rounded-lg space-y-3 border border-amber-500/30">
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Exercise Name"
                                    value={newExerciseName}
                                    onChange={e => setNewExerciseName(e.target.value)}
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1.5 text-sm text-white focus:outline-none focus:border-amber-500"
                                />
                                <div className="flex space-x-2">
                                    <input
                                        type="number"
                                        placeholder="Reps (e.g. 10)"
                                        value={newExerciseReps}
                                        onChange={e => setNewExerciseReps(e.target.value)}
                                        className="w-1/2 bg-zinc-800 border border-zinc-700 rounded px-2 py-1.5 text-sm text-white focus:outline-none focus:border-amber-500"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Mins (approx)"
                                        value={newExerciseDuration}
                                        onChange={e => setNewExerciseDuration(e.target.value)}
                                        className="w-1/2 bg-zinc-800 border border-zinc-700 rounded px-2 py-1.5 text-sm text-white focus:outline-none focus:border-amber-500"
                                    />
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <button onClick={() => setIsAddingExercise(null)} className="px-3 py-1 text-xs text-zinc-400 hover:text-white">Cancel</button>
                                    <button onClick={handleAddExercise} className="px-3 py-1 bg-amber-500 text-black text-xs font-bold rounded hover:bg-amber-600">Add</button>
                                </div>
                            </div>
                        ) : (
                            <button 
                                onClick={() => setIsAddingExercise({ phaseId: phase.id })}
                                className="w-full py-2 mt-2 border border-dashed border-zinc-600 text-zinc-400 rounded-lg text-sm hover:border-amber-500 hover:text-amber-400 transition-colors flex items-center justify-center space-x-1"
                            >
                                <Icon type="plus" className="w-4 h-4" />
                                <span>Add Exercise</span>
                            </button>
                        )}
                        
                        <div className="mt-4 pt-3 border-t border-zinc-700 flex items-center justify-between text-sm text-zinc-400">
                            <span>Break after section:</span>
                            <select 
                                className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-zinc-200 text-xs"
                                defaultValue="60"
                            >
                                <option value="30">30s</option>
                                <option value="60">60s</option>
                                <option value="90">90s</option>
                                <option value="120">2 mins</option>
                            </select>
                        </div>
                    </div>
                </div>
            ))}

            {isAddingPhase ? (
                <div className="bg-zinc-800 p-4 rounded-xl border border-amber-500/50 animate-slide-in-bottom">
                    <label className="block text-sm text-zinc-400 mb-2">Section Title</label>
                    <input
                        autoFocus
                        type="text"
                        value={newPhaseName}
                        onChange={e => setNewPhaseName(e.target.value)}
                        placeholder="e.g. Warmup, Core, Main Lift"
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-zinc-200 mb-4 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                    <div className="flex justify-end space-x-3">
                        <button onClick={() => setIsAddingPhase(false)} className="px-4 py-2 text-zinc-400 font-medium">Cancel</button>
                        <button onClick={handleAddPhase} className="px-4 py-2 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-600">Add Section</button>
                    </div>
                </div>
            ) : (
                <button 
                    onClick={() => setIsAddingPhase(true)}
                    className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-zinc-300 font-semibold flex items-center justify-center space-x-2 transition-colors"
                >
                    <Icon type="plus" className="w-5 h-5" />
                    <span>Add Section</span>
                </button>
            )}
        </div>
    );

    const renderReviewStep = () => (
        <div className="p-4 space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Ready to Create?</h2>
                <p className="text-zinc-400">Review your workout details below.</p>
            </div>

            <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 space-y-4">
                <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider font-bold">Workout</p>
                    <p className="text-lg font-bold text-white">{title}</p>
                    <p className="text-sm text-zinc-400">{phases.length} Sections · {phases.reduce((acc, p) => acc + (p.sets[0]?.exercises.length || 0), 0)} Exercises</p>
                </div>
                
                <div className="border-t border-zinc-800 pt-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-bold text-zinc-200">Private Workout</p>
                            <p className="text-xs text-zinc-500">Only visible to you in "My Workouts"</p>
                        </div>
                        <button
                            onClick={() => setIsPrivate(!isPrivate)}
                            className={`${
                                isPrivate ? 'bg-amber-500' : 'bg-zinc-700'
                            } relative inline-flex items-center h-6 rounded-full w-11 transition-colors`}
                        >
                            <span className={`${
                                isPrivate ? 'translate-x-6' : 'translate-x-1'
                            } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} />
                        </button>
                    </div>
                     {!isPrivate && (
                         <p className="text-xs text-amber-400/80 mt-2 bg-amber-900/20 p-2 rounded">
                             Note: Public workouts will be visible to the entire community.
                         </p>
                     )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="h-full flex flex-col bg-zinc-950 text-zinc-200">
            <header className="p-4 border-b border-zinc-800 flex items-center shrink-0 sticky top-0 bg-zinc-950 z-10">
                <button onClick={step === 'details' ? onClose : () => setStep(step === 'builder' ? 'details' : 'builder')} className="p-2 -ml-2 mr-2 text-zinc-400 hover:text-zinc-200">
                    <Icon type="arrow-left" className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold">Create Workout</h1>
            </header>

            <main className="flex-grow overflow-y-auto">
                {step === 'details' && renderDetailsStep()}
                {step === 'builder' && renderBuilderStep()}
                {step === 'review' && renderReviewStep()}
            </main>

            <footer className="p-4 border-t border-zinc-800 shrink-0 bg-zinc-950">
                {step === 'review' ? (
                    <button
                        onClick={handleSave}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 px-4 rounded-lg transition-colors"
                    >
                        Create Workout
                    </button>
                ) : (
                     <button
                        onClick={handleNextStep}
                        className="w-full bg-white hover:bg-gray-200 text-black font-bold py-3 px-4 rounded-lg transition-colors"
                    >
                        Next
                    </button>
                )}
            </footer>
        </div>
    );
};

export default CreateWorkoutPage;
