import React, { useState, useRef, useEffect } from 'react';
import { useCart } from '../context/CartContext.tsx';
import { useLocalization } from '../context/LocalizationContext.tsx';
import { useRouter } from '../context/RouterContext.tsx';
import CloseIcon from './icons/CloseIcon.tsx';
import TrashIcon from './icons/TrashIcon.tsx';

interface CartSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose }) => {
    const { cart, removeFromCart, updateQuantity, subtotal, appliedCoupon, applyCoupon, removeCoupon, discountAmount, totalPrice, getCartItemDetails } = useCart();
    const { language, t } = useLocalization();
    const { navigateTo } = useRouter();
    const [couponCode, setCouponCode] = useState('');
    const sidebarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            const sidebarElement = sidebarRef.current;
            if (!sidebarElement) return;

            const focusableElements = sidebarElement.querySelectorAll<HTMLElement>(
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
            sidebarElement.addEventListener('keydown', handleTabKeyPress);

            return () => {
                sidebarElement.removeEventListener('keydown', handleTabKeyPress);
            };
        }
    }, [isOpen]);

    const handleCheckout = () => {
        navigateTo('checkout');
        onClose();
    };
    
    const handleApplyCoupon = (e: React.FormEvent) => {
        e.preventDefault();
        if (couponCode.trim()) {
            applyCoupon(couponCode);
            setCouponCode('');
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat(language === 'he' ? 'he-IL' : 'en-US', {
            style: 'currency',
            currency: 'ILS',
            minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <>
            <div
                className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            ></div>
            <div
                ref={sidebarRef}
                className={`fixed top-0 ${language === 'he' ? 'left-0' : 'right-0'} h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform ${isOpen ? 'translate-x-0' : (language === 'he' ? '-translate-x-full' : 'translate-x-full')}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="cart-sidebar-title"
            >
                <div className="flex flex-col h-full">
                    <div className="flex justify-between items-center p-4 border-b">
                        <h2 id="cart-sidebar-title" className="text-xl font-bold text-[#2C5F5D]">Your Cart</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-800" aria-label="Close shopping cart">
                            <CloseIcon className="w-6 h-6" />
                        </button>
                    </div>

                    {cart.length > 0 ? (
                        <>
                            <div className="flex-1 overflow-y-auto p-4">
                                {cart.map(item => {
                                    const { product, cartItemId, itemTotalPrice } = getCartItemDetails(item);
                                    if (!product) return null;
                                    
                                    return (
                                        <div key={cartItemId} className="flex gap-4 py-4 border-b">
                                            <img src={product.images[0]} alt={product.name[language]} className="w-24 h-24 object-cover rounded-md" loading="lazy" />
                                            <div className="flex-1 flex flex-col">
                                                <h3 className="font-semibold">{product.name[language]}</h3>
                                                <p className="text-sm text-gray-500">{item.color.name[language]}</p>
                                                <div className="mt-auto flex justify-between items-center">
                                                    <div className="flex items-center border rounded-md">
                                                        <button onClick={() => updateQuantity(cartItemId, item.quantity - 1)} className="px-2 py-1" aria-label={`Decrease quantity of ${product.name[language]}`}>-</button>
                                                        <span className="px-3">{item.quantity}</span>
                                                        <button onClick={() => updateQuantity(cartItemId, item.quantity + 1)} className="px-2 py-1" aria-label={`Increase quantity of ${product.name[language]}`}>+</button>
                                                    </div>
                                                    <p className="font-semibold">{formatPrice(itemTotalPrice)}</p>
                                                </div>
                                            </div>
                                            <button onClick={() => removeFromCart(cartItemId)} className="text-gray-400 hover:text-red-500 self-start" aria-label={`Remove ${product.name[language]} from cart`}>
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="p-4 border-t space-y-4">
                                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        placeholder={t('coupon_code')}
                                        className="flex-grow p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#A8B5A0]"
                                    />
                                    <button type="submit" className="bg-[#A8B5A0] text-white px-4 rounded-md font-semibold hover:bg-opacity-90 transition-colors">
                                        {t('apply_coupon')}
                                    </button>
                                </form>

                                <div className="space-y-2">
                                     <div className="flex justify-between">
                                        <span>{t('subtotal')}</span>
                                        <span>{formatPrice(subtotal)}</span>
                                    </div>
                                    {appliedCoupon && (
                                        <div className="flex justify-between items-center text-green-600">
                                            <span>{t('discount')} ({appliedCoupon.code})</span>
                                            <span>-{formatPrice(discountAmount)}</span>
                                            <button onClick={removeCoupon} className="text-xs text-red-500 hover:underline">
                                                ({t('remove_coupon')})
                                            </button>
                                        </div>
                                    )}
                                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                                        <span>{t('total')}</span>
                                        <span>{formatPrice(totalPrice)}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={handleCheckout}
                                    className="w-full bg-[#2C5F5D] text-white py-3 rounded-lg font-semibold text-lg hover:bg-[#D4896C] transition-colors"
                                >
                                    Proceed to Checkout
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                            <p className="text-lg text-gray-500 mb-4">Your cart is empty.</p>
                            <button onClick={onClose} className="text-[#2C5F5D] font-semibold">
                                Continue Shopping
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default CartSidebar;