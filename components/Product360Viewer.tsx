import React, { useState, useRef, useEffect, useCallback } from 'react';
import RotateIcon from './icons/RotateIcon.tsx';
import PlayIcon from './icons/PlayIcon.tsx';
import PauseIcon from './icons/PauseIcon.tsx';

interface Product360ViewerProps {
    images: string[];
}

const Product360Viewer: React.FC<Product360ViewerProps> = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const dragStartXRef = useRef(0);
    const [isAutoRotating, setIsAutoRotating] = useState(false);
    const [showInteractionHint, setShowInteractionHint] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);

    const imageCount = images.length;
    const sensitivity = 20; // Lower number means more sensitive

    const handleInteractionStart = () => {
        if (showInteractionHint) {
            setShowInteractionHint(false);
        }
        if (isAutoRotating) {
            setIsAutoRotating(false);
        }
    };

    // Mouse Events
    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        handleInteractionStart();
        setIsDragging(true);
        dragStartXRef.current = e.clientX;
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging || !containerRef.current) return;
        
        const dragCurrentX = e.clientX;
        const deltaX = dragCurrentX - dragStartXRef.current;

        if (Math.abs(deltaX) > sensitivity) {
            const direction = deltaX > 0 ? -1 : 1; // Drag right moves image left (so index decreases)
            setCurrentIndex(prev => (prev + direction + imageCount) % imageCount);
            dragStartXRef.current = dragCurrentX;
        }
    }, [isDragging, imageCount, sensitivity]);


    // Touch Events
    const handleTouchStart = (e: React.TouchEvent) => {
        handleInteractionStart();
        setIsDragging(true);
        dragStartXRef.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
    };

    const handleTouchMove = useCallback((e: TouchEvent) => {
        if (!isDragging || !containerRef.current) return;
        
        const touchCurrentX = e.touches[0].clientX;
        const deltaX = touchCurrentX - dragStartXRef.current;

        if (Math.abs(deltaX) > sensitivity) {
            const direction = deltaX > 0 ? -1 : 1;
            setCurrentIndex(prev => (prev + direction + imageCount) % imageCount);
            dragStartXRef.current = touchCurrentX;
        }
    }, [isDragging, imageCount, sensitivity]);

    // Auto-rotation
    useEffect(() => {
        let interval: number;
        if (isAutoRotating) {
            interval = window.setInterval(() => {
                setCurrentIndex(prev => (prev + 1) % imageCount);
            }, 100);
        }
        return () => clearInterval(interval);
    }, [isAutoRotating, imageCount]);
    
    // Add global event listeners for mouse move/up
    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            window.addEventListener('touchmove', handleTouchMove);
            window.addEventListener('touchend', handleTouchEnd);
        }
        
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, [isDragging, handleMouseMove, handleTouchMove, handleMouseUp, handleTouchEnd]);


    const toggleAutoRotate = () => {
        handleInteractionStart();
        setIsAutoRotating(prev => !prev);
    };

    return (
        <div className="relative select-none" ref={containerRef}>
            <div
                className="w-full aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-grab active:cursor-grabbing"
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
            >
                {/* Preload images for smoother transition */}
                {images.map((img, index) => (
                    <img
                        key={img}
                        src={img}
                        alt={`Product view ${index + 1}`}
                        className={`w-full h-full object-contain transition-opacity duration-100 ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                        style={{ position: 'absolute', top: 0, left: 0 }}
                        draggable="false"
                    />
                ))}
            </div>

            {showInteractionHint && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 text-white rounded-lg pointer-events-none">
                    <RotateIcon className="w-12 h-12" />
                    <p className="mt-2 font-semibold">לחצו וגררו כדי לסובב</p>
                </div>
            )}

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <button
                    onClick={toggleAutoRotate}
                    className="p-3 bg-white/70 backdrop-blur-sm rounded-full text-gray-700 hover:bg-white transition-colors shadow-md"
                    aria-label={isAutoRotating ? 'Pause rotation' : 'Play rotation'}
                >
                    {isAutoRotating ? <PauseIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6" />}
                </button>
            </div>
        </div>
    );
};
export default Product360Viewer;