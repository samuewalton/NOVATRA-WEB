import React, { useState, useMemo, useEffect, useRef } from 'react';
import type { Product, Color, Accessory } from '../types.ts';
import { useLocalization } from '../context/LocalizationContext.tsx';
import { useCart } from '../context/CartContext.tsx';
import { useNotification } from '../context/NotificationContext.tsx';
import CloseIcon from './icons/CloseIcon.tsx';
import CheckIcon from './icons/CheckIcon.tsx';

interface PurchaseModalProps {
    product: Product;
    isOpen: boolean;
    onClose: () => void;
    initialAccessories?: Accessory[];
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({ product, isOpen, onClose, initialAccessories = [] }) => {
    const { language, t } = useLocalization();
    const { addToCart } = useCart();
    const { addNotification } = useNotification();
    const [selectedColor, setSelectedColor] = useState<Color>(product.colors[0]);
    const [selectedAccessories, setSelectedAccessories] = useState<Accessory[]>(initialAccessories);
    const [quantity, setQuantity] = useState(1);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);

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

            // Sync state when modal opens
            setSelectedAccessories(initialAccessories);
            setQuantity(1);

            return () => {
                document.body.style.overflow = 'auto';
                window.removeEventListener('keydown', handleKeyDown);
                modalElement.removeEventListener('keydown', handleTabKeyPress);
            };
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [isOpen, onClose, initialAccessories]);

    const handleAccessoryToggle = (acc: Accessory) => {
        setSelectedAccessories(prev =>
            prev.find(a => a.id === acc.id)
                ? prev.filter(a => a.id !== acc.id)
                : [...prev, acc]
        );
    };

    const handleAddToCart = () => {
        addToCart(product.id, quantity, selectedColor, selectedAccessories);
        addNotification({ message: t('cart_added_notification'), type: 'success' });
        onClose();
    };

    const formatPrice = (price: number, currency: 'ILS' | 'EUR' = 'ILS') => {
        const options: Intl.NumberFormatOptions = {
            style: 'currency',
            currency,
            minimumFractionDigits: 0,
        };
        const locale = language === 'he' ? 'he-IL' : (currency === 'EUR' ? 'de-DE' : 'en-US');
        return new Intl.NumberFormat(locale, options).format(price);
    };

    const accessoriesTotal = useMemo(() => {
        return selectedAccessories.reduce((sum, acc) => sum + acc.price.ils, 0);
    }, [selectedAccessories]);

    const totalPrice = useMemo(() => {
        return (product.price.ils + accessoriesTotal) * quantity;
    }, [product.price.ils, accessoriesTotal, quantity]);

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-50 flex"
            role="dialog"
            aria-modal="true"
            aria-labelledby="purchase-modal-title"
        >
            {/* Backdrop */}
            <div 
                className={`fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
                aria-hidden="true"
            ></div>

            {/* Modal Panel */}
            <div ref={modalRef} className={`relative ${language === 'he' ? 'mr-auto' : 'ml-auto'} h-full w-full max-w-md bg-white shadow-xl flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : (language === 'he' ? '-translate-x-full' : 'translate-x-full')}`}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-4 flex justify-between items-center border-b">
                        <h2 id="purchase-modal-title" className="text-xl font-bold text-[#2C5F5D] font-outfit">NOVATRA</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-800" aria-label="Close purchase options">
                            <CloseIcon className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <h3 className="text-xl font-bold">{product.name[language]}</h3>
                        
                        <div className="text-sm text-gray-500 space-y-1 border-b pb-4">
                            <p><span className="font-semibold">מק"ט:</span> {product.sku}</p>
                            <p><span className="font-semibold">קטגוריה:</span> {product.category[language]}</p>
                            <p><span className="font-semibold">קולקציה:</span> {product.collection[language]}</p>
                            <p><span className="font-semibold">מידות:</span> {product.dimensions[language]}</p>
                        </div>

                        {/* Color Selection */}
                        <div>
                            <h4 className="font-semibold mb-2">{t('select_color')}: <span className="font-normal">{selectedColor.name[language]}</span></h4>
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

                        {/* Stock Status */}
                        <div>
                            <p className={`flex items-center gap-2 font-semibold ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                                <CheckIcon className="w-5 h-5" />
                                {product.inStock ? t('in_stock') : t('out_of_stock')}
                            </p>
                        </div>

                        {/* Quantity & Price */}
                        <div className="flex justify-between items-center">
                            <div>
                                <h4 className="font-semibold mb-2">כמות:</h4>
                                <div className="flex items-center border rounded-md w-fit">
                                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-4 py-2 text-lg font-bold">-</button>
                                    <span className="px-4 text-lg font-semibold">{quantity}</span>
                                    <button onClick={() => setQuantity(q => q + 1)} className="px-4 py-2 text-lg font-bold">+</button>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-gray-800">{formatPrice(product.price.ils)}</p>
                                <p className="text-md text-gray-500">{formatPrice(product.price.eur, 'EUR')}</p>
                            </div>
                        </div>


                        {/* Accessories Selection */}
                        {product.accessories.length > 0 && (
                            <div className="border-t pt-4">
                                <h4 className="font-semibold mb-2">{t('add_accessories')}</h4>
                                <div className="space-y-2">
                                    {product.accessories.map(acc => (
                                        <label key={acc.id} className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={!!selectedAccessories.find(a => a.id === acc.id)}
                                                    onChange={() => handleAccessoryToggle(acc)}
                                                    className="h-4 w-4 text-[#2C5F5D] focus:ring-[#A8B5A0] border-gray-300 rounded"
                                                />
                                                <span className="text-gray-700 ltr:ml-3 rtl:mr-3">{acc.name[language]}</span>
                                            </div>
                                            <span>+{formatPrice(acc.price.ils)}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-4 bg-gray-50 border-t space-y-3">
                         <div className="flex justify-between font-bold text-2xl">
                            <span>{t('total')}</span>
                            <span>{formatPrice(totalPrice)}</span>
                        </div>
                        <button
                            onClick={handleAddToCart}
                            disabled={!product.inStock}
                            className="w-full bg-[#2C5F5D] text-white py-3 rounded-lg font-semibold text-lg hover:bg-[#D4896C] transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {t('add_to_cart_cta')} 🛒
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PurchaseModal;