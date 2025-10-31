import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { Product, Color as ProductColor } from '../types.ts';
import { useLocalization } from '../context/LocalizationContext.tsx';
import { generateRoomPreview } from '../services/geminiService.ts';
import CloseIcon from './icons/CloseIcon.tsx';

interface VirtualDesignerModalProps {
    product: Product;
    isOpen: boolean;
    onClose: () => void;
}

const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            // Remove the data URL prefix
            resolve(base64String.split(',')[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};


const VirtualDesignerModal: React.FC<VirtualDesignerModalProps> = ({ product, isOpen, onClose }) => {
    const { language, t } = useLocalization();
    const [roomImage, setRoomImage] = useState<string | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [prompt, setPrompt] = useState<string>('');
    const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    const handleClose = useCallback(() => {
        // Reset state on close
        setRoomImage(null);
        setGeneratedImage(null);
        setPrompt('');
        setSelectedColor(product.colors[0]);
        setError(null);
        setIsLoading(false);
        onClose();
    }, [onClose, product.colors]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                handleClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';

            const modalElement = modalRef.current;
            if (!modalElement) return;

            const focusableElements = modalElement.querySelectorAll<HTMLElement>(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            const handleTabKeyPress = (e: KeyboardEvent) => {
                if (e.key !== 'Tab') return;
                
                if (e.shiftKey) { // Shift + Tab
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement?.focus();
                    }
                } else { // Tab
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement?.focus();
                    }
                }
            };
            
            firstElement?.focus();
            modalElement.addEventListener('keydown', handleTabKeyPress);

            return () => {
                document.removeEventListener('keydown', handleKeyDown);
                document.body.style.overflow = 'auto';
                modalElement.removeEventListener('keydown', handleTabKeyPress);
            };
        } else {
            document.body.style.overflow = 'auto';
        }

    }, [isOpen, handleClose]);

    if (!isOpen) return null;

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setRoomImage(reader.result as string);
                setGeneratedImage(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGenerate = async () => {
        if (!roomImage) {
            setError('Please upload an image of your room first.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setGeneratedImage(null);
    
        try {
            const response = await fetch(roomImage);
            const blob = await response.blob();
            const base64Data = await blobToBase64(blob);

            const resultBase64 = await generateRoomPreview(
                base64Data,
                product.images[0], // Using main product image as reference
                prompt,
                product.name[language],
                product.dimensions[language],
                selectedColor.name[language]
            );
            setGeneratedImage(`data:image/jpeg;base64,${resultBase64}`);
        } catch (err) {
            setError('Failed to generate the image. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" 
            onClick={handleClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="virtual-designer-title"
        >
            <div ref={modalRef} className="bg-[#F7F5F3] rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-4 flex justify-between items-center border-b border-gray-200">
                    <h2 id="virtual-designer-title" className="text-xl font-bold text-[#2C5F5D]">{'מעצב החדרים הוירטואלי'}</h2>
                    <button onClick={handleClose} className="text-gray-500 hover:text-gray-800" aria-label="Close virtual designer">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 flex flex-col md:flex-row p-4 gap-4 overflow-y-auto">
                    {/* Controls */}
                    <div className="w-full md:w-1/3 space-y-4">
                        <div>
                            <label className="font-semibold text-gray-700 block mb-2">1. העלו תמונת חדר</label>
                            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
                            <button onClick={() => fileInputRef.current?.click()} className="w-full p-3 border-2 border-dashed rounded-lg text-center text-gray-500 hover:border-gray-400">
                                {roomImage ? 'החליפו תמונה' : 'בחרו תמונה'}
                            </button>
                        </div>
                        <div>
                            <label className="font-semibold text-gray-700 block mb-2">2. בחרו צבע</label>
                            <div className="flex gap-2">
                                {product.colors.map(color => (
                                    <button
                                        key={color.hex}
                                        onClick={() => setSelectedColor(color)}
                                        className={`w-8 h-8 rounded-full border-2 ${selectedColor.hex === color.hex ? 'border-[#2C5F5D] ring-2 ring-offset-1 ring-[#2C5F5D]' : 'border-gray-300'}`}
                                        style={{ backgroundColor: color.hex }}
                                        aria-label={`Select color ${color.name[language]}`}
                                    />
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="font-semibold text-gray-700 block mb-2">3. תארו את המיקום</label>
                            <textarea
                                value={prompt}
                                onChange={e => setPrompt(e.target.value)}
                                placeholder="לדוגמה: 'מקם את המיטה ליד החלון'"
                                className="w-full p-2 border rounded-md"
                                rows={3}
                            />
                        </div>
                        <button onClick={handleGenerate} disabled={isLoading || !roomImage} className="w-full bg-[#D4896C] text-white py-3 rounded-lg font-semibold text-lg hover:bg-opacity-90 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed">
                            {isLoading ? 'יוצר הדמיה...' : 'צרו הדמיה ✨'}
                        </button>
                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    </div>

                    {/* Image Display */}
                    <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                         <div className="border rounded-lg p-2 bg-white">
                            <h3 className="text-center font-semibold mb-2">החדר שלכם</h3>
                            <div className="aspect-square bg-gray-100 rounded flex items-center justify-center">
                                {roomImage ? <img src={roomImage} alt="Your room" className="w-full h-full object-contain" /> : <p className="text-gray-400">העלו תמונה</p>}
                            </div>
                         </div>
                         <div className="border rounded-lg p-2 bg-white">
                            <h3 className="text-center font-semibold mb-2">הדמיית AI</h3>
                            <div className="aspect-square bg-gray-100 rounded flex items-center justify-center">
                                {isLoading && <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4896C]"></div>}
                                {generatedImage && !isLoading && <img src={generatedImage} alt="AI Generated Preview" className="w-full h-full object-contain" />}
                                {!generatedImage && !isLoading && <p className="text-gray-400">ההדמיה תופיע כאן</p>}
                            </div>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VirtualDesignerModal;