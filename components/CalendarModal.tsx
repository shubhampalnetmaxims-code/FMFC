
import React, { useState } from 'react';
import Icon from './Icon';

interface CalendarModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedDate: Date;
    onDateSelect: (date: Date) => void;
}

const CalendarModal: React.FC<CalendarModalProps> = ({ isOpen, onClose, selectedDate, onDateSelect }) => {
    const [displayDate, setDisplayDate] = useState(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));

    if (!isOpen) return null;

    const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const renderDays = () => {
        const year = displayDate.getFullYear();
        const month = displayDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);

        const days = [];
        // Padding for previous month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`pad-start-${i}`} className="text-center p-2"></div>);
        }

        // Days of the current month
        for (let day = 1; day <= daysInMonth; day++) {
            const currentDate = new Date(year, month, day);
            const isSelected = selectedDate.toDateString() === currentDate.toDateString();
            const isToday = new Date().toDateString() === currentDate.toDateString();

            let dayClass = 'text-center p-2 rounded-full cursor-pointer hover:bg-zinc-700 transition-colors';
            if (isSelected) {
                dayClass += ' bg-amber-500 text-black font-bold';
            } else if (isToday) {
                dayClass += ' border border-zinc-500';
            } else {
                dayClass += ' text-zinc-200';
            }

            days.push(
                <button key={day} onClick={() => onDateSelect(currentDate)} className={dayClass}>
                    {day}
                </button>
            );
        }
        return days;
    };

    const handlePrevMonth = () => {
        setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 1));
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-xs" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                    <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-zinc-800 transition-colors">
                        <Icon type="arrow-left" className="w-5 h-5 text-zinc-400"/>
                    </button>
                    <h2 className="font-bold text-lg text-zinc-100">
                        {displayDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </h2>
                    <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-zinc-800 transition-colors">
                         <Icon type="arrow-right" className="w-5 h-5 text-zinc-400"/>
                    </button>
                </div>
                <div className="p-4">
                    <div className="grid grid-cols-7 gap-1 text-center text-xs text-zinc-500 font-semibold mb-2">
                        {daysOfWeek.map(day => <div key={day}>{day}</div>)}
                    </div>
                    <div className="grid grid-cols-7 gap-2 text-sm">
                        {renderDays()}
                    </div>
                </div>
                 <div className="p-4 border-t border-zinc-800">
                    <button onClick={() => onDateSelect(new Date())} className="w-full text-center py-2 bg-zinc-800 hover:bg-zinc-700 text-sm font-semibold rounded-lg transition-colors">
                        Go to Today
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CalendarModal;
