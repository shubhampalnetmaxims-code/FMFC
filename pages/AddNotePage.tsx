
import React, { useState, useEffect } from 'react';
import Icon from '../components/Icon';
import { UserNote } from '../types';
import { useToast } from '../components/ToastProvider';

interface AddNotePageProps {
    onClose: () => void;
    onSave: (data: { date: string; content: string }) => void;
    initialData?: UserNote | null;
    date: Date;
}

const AddNotePage: React.FC<AddNotePageProps> = ({ onClose, onSave, initialData, date: propDate }) => {
    const { addToast } = useToast();
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [content, setContent] = useState('');

    useEffect(() => {
        if (initialData) {
            setDate(initialData.date);
            setContent(initialData.content);
        } else {
            setDate(propDate.toISOString().split('T')[0]);
            setContent('');
        }
    }, [initialData, propDate]);

    const handleSave = () => {
        if (!content.trim()) {
            addToast('Note content cannot be empty.', 'error');
            return;
        }
        onSave({ date, content });
    };

    return (
        <div className="h-full flex flex-col bg-zinc-950 text-zinc-200">
            <header className="flex items-center p-4 shrink-0 border-b border-zinc-800">
                <button onClick={onClose} className="p-2 -ml-2 mr-2 text-zinc-400 hover:text-zinc-200">
                    <Icon type="arrow-left" className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold">{initialData ? 'Edit Note' : 'Add Note'}</h1>
                <button 
                    onClick={handleSave}
                    className="ml-auto text-sm font-semibold text-amber-400 hover:text-amber-300 px-4 py-2 rounded-lg bg-amber-400/10 transition-colors"
                >
                    Save
                </button>
            </header>

            <main className="flex-grow overflow-y-auto p-4 space-y-6">
                <div>
                    <label htmlFor="note-date" className="text-xs text-zinc-400 mb-1 block">Date</label>
                    <input
                        type="date"
                        id="note-date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                </div>
                <div>
                    <label htmlFor="note-content" className="text-xs text-zinc-400 mb-1 block">Note</label>
                    <textarea
                        id="note-content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write your notes here..."
                        rows={10}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                </div>
            </main>
        </div>
    );
};

export default AddNotePage;
