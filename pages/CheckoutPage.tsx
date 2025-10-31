import React, { useState } from 'react';
import { useCart } from '../context/CartContext.tsx';
import { useLocalization } from '../context/LocalizationContext.tsx';
import { useRouter } from '../context/RouterContext.tsx';
import { useNotification } from '../context/NotificationContext.tsx';

const CheckoutPage: React.FC = () => {
    const { cart, subtotal, appliedCoupon, discountAmount, totalPrice, getCartItemDetails } = useCart();
    const { language, t } = useLocalization();
    const { navigateTo } = useRouter();
    const { addNotification } = useNotification();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        zip: '',
    });

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat(language === 'he' ? 'he-IL' : 'en-US', {
            style: 'currency',
            currency: 'ILS',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Basic validation
        if (Object.values(formData).some(val => !(val as string).trim())) {
            addNotification({ message: 'Please fill all fields', type: 'error' });
            return;
        }
        console.log("Order placed:", { ...formData, cart, totalPrice });
        addNotification({ message: 'Order placed successfully!', type: 'success' });
        // In a real app, you would clear the cart here.
        // clearCart();
        navigateTo('home');
    };

    if (cart.length === 0) {
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
                <button onClick={() => navigateTo('home')} className="bg-[#2C5F5D] text-white px-6 py-2 rounded-md">
                    Continue Shopping
                </button>
            </div>
        )
    }

    return (
        <div className="bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-4xl font-bold text-center text-[#2C5F5D] mb-8">{t('checkout_title')}</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Order Summary */}
                    <div className="bg-white p-6 rounded-lg shadow-md order-last lg:order-first">
                        <h2 className="text-2xl font-semibold mb-4 border-b pb-4">{t('order_summary')}</h2>
                        <div className="space-y-4">
                            {cart.map(item => {
                                const { product, cartItemId, itemTotalPrice } = getCartItemDetails(item);
                                if (!product) return null;
                                return (
                                    <div key={cartItemId} className="flex items-center gap-4">
                                        <img src={product.images[0]} alt={product.name[language]} className="w-16 h-16 object-cover rounded-md" loading="lazy" />
                                        <div className="flex-1">
                                            <p className="font-semibold">{product.name[language]}</p>
                                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-semibold">{formatPrice(itemTotalPrice)}</p>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="border-t mt-6 pt-4 space-y-2">
                             <div className="flex justify-between">
                                <span>{t('subtotal')}</span>
                                <span>{formatPrice(subtotal)}</span>
                            </div>
                            {appliedCoupon && (
                                <div className="flex justify-between text-green-600">
                                    <span>{t('discount')} ({appliedCoupon.code})</span>
                                    <span>-{formatPrice(discountAmount)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-lg font-semibold border-t pt-2 mt-2">
                                <span>{t('total')}</span>
                                <span>{formatPrice(totalPrice)}</span>
                            </div>
                        </div>
                    </div>
                    {/* Checkout Form */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold mb-4 border-b pb-4">Shipping Details</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Full Name" className="w-full p-2 border rounded" />
                            <input name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" type="email" className="w-full p-2 border rounded" />
                            <input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone" type="tel" className="w-full p-2 border rounded" />
                            <input name="address" value={formData.address} onChange={handleInputChange} placeholder="Address" className="w-full p-2 border rounded" />
                            <div className="flex gap-4">
                                <input name="city" value={formData.city} onChange={handleInputChange} placeholder="City" className="w-1/2 p-2 border rounded" />
                                <input name="zip" value={formData.zip} onChange={handleInputChange} placeholder="ZIP Code" className="w-1/2 p-2 border rounded" />
                            </div>
                            <button type="submit" className="w-full bg-[#2C5F5D] text-white py-3 rounded-lg font-semibold text-lg hover:bg-[#D4896C] transition-colors">
                                Place Order
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;