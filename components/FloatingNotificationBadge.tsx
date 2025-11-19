
import React, { useState, useRef, useEffect } from 'react';

interface FloatingNotificationBadgeProps {
    communityImage: string;
    onClick: () => void;
}

const FloatingNotificationBadge: React.FC<FloatingNotificationBadgeProps> = ({ communityImage, onClick }) => {
    const [position, setPosition] = useState({ x: window.innerWidth - 80, y: 100 }); // Default top-right
    const [isDragging, setIsDragging] = useState(false);
    const [hasMoved, setHasMoved] = useState(false);
    
    const dragStartPos = useRef({ x: 0, y: 0 });
    const elementPosStart = useRef({ x: 0, y: 0 });

    const handleStart = (clientX: number, clientY: number) => {
        setIsDragging(true);
        setHasMoved(false);
        dragStartPos.current = { x: clientX, y: clientY };
        elementPosStart.current = { ...position };
    };

    const handleMove = (clientX: number, clientY: number) => {
        if (!isDragging) return;

        const dx = clientX - dragStartPos.current.x;
        const dy = clientY - dragStartPos.current.y;

        // If moved more than 5 pixels, consider it a drag operation
        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
            setHasMoved(true);
        }

        setPosition({
            x: elementPosStart.current.x + dx,
            y: elementPosStart.current.y + dy,
        });
    };

    const handleEnd = () => {
        setIsDragging(false);
    };

    const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
        if (!hasMoved) {
            onClick();
        }
    };

    // Mouse Event Handlers
    const onMouseDown = (e: React.MouseEvent) => {
        handleStart(e.clientX, e.clientY);
    };

    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
        const onMouseUp = () => handleEnd();

        if (isDragging) {
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, [isDragging]);

    // Touch Event Handlers
    const onTouchStart = (e: React.TouchEvent) => {
        handleStart(e.touches[0].clientX, e.touches[0].clientY);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
    };

    return (
        <div
            style={{
                position: 'fixed',
                left: `${position.x}px`,
                top: `${position.y}px`,
                zIndex: 60, // Above modals
                touchAction: 'none', // Prevent scrolling while dragging
                cursor: isDragging ? 'grabbing' : 'grab',
            }}
            onMouseDown={onMouseDown}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={handleEnd}
            onClick={handleClick}
        >
            <div className="relative group animate-bounce-in">
                {/* Avatar Container */}
                <div className="w-16 h-16 rounded-full border-2 border-amber-400 shadow-2xl overflow-hidden bg-zinc-900 transition-transform transform hover:scale-105 active:scale-95">
                    <img 
                        src={communityImage} 
                        alt="Community Notification" 
                        className="w-full h-full object-cover"
                        draggable={false}
                    />
                </div>
                
                {/* Red Dot Indicator */}
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full border-4 border-zinc-950 flex items-center justify-center animate-pulse">
                   <span className="text-[10px] font-bold text-white">1</span>
                </div>

                {/* Tooltip hint */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    New Message!
                </div>
            </div>
        </div>
    );
};

export default FloatingNotificationBadge;
