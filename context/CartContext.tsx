import React, { createContext, useState, useContext, useMemo, useCallback, ReactNode } from 'react';
import type { CartItem, Product, Color, Accessory, Coupon } from '../types.ts';
import { useProducts } from './ProductContext.tsx';
import { useNotification } from './NotificationContext.tsx';
import { coupons } from '../data/coupons.ts';
import { useLocalization } from './LocalizationContext.tsx';

interface CartContextType {
    cart: CartItem[];
    addToCart: (productId: string, quantity: number, color: Color, accessories: Accessory[]) => void;
    removeFromCart: (cartItemId: string) => void;
    updateQuantity: (cartItemId: string, quantity: number) => void;
    cartCount: number;
    isCartOpen: boolean;
    setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
    subtotal: number;
    appliedCoupon: Coupon | null;
    applyCoupon: (code: string) => void;
    removeCoupon: () => void;
    discountAmount: number;
    totalPrice: number;
    getCartItemDetails: (item: CartItem) => ({ product: Product | undefined, cartItemId: string, itemTotalPrice: number });
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const useLocalStorage = <T,>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] => {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    const setValue = (value: T | ((val: T) => T)) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(error);
        }
    };

    return [storedValue, setValue];
};

const generateCartItemId = (item: Omit<CartItem, 'quantity'>): string => {
    const accessoryIds = item.accessories.map(a => a.id).sort().join('-');
    return `${item.productId}-${item.color.hex}-${accessoryIds}`;
};


export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [cart, setCart] = useLocalStorage<CartItem[]>('cart', []);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [appliedCoupon, setAppliedCoupon] = useLocalStorage<Coupon | null>('coupon', null);
    const { getProductById } = useProducts();
    const { addNotification } = useNotification();
    const { t } = useLocalization();

    const addToCart = useCallback((productId: string, quantity: number, color: Color, accessories: Accessory[]) => {
        const newItem: Omit<CartItem, 'quantity'> = { productId, color, accessories };
        const cartItemId = generateCartItemId(newItem);

        setCart(prevCart => {
            const existingItemIndex = prevCart.findIndex(item => generateCartItemId(item) === cartItemId);

            if (existingItemIndex > -1) {
                const updatedCart = [...prevCart];
                updatedCart[existingItemIndex].quantity += quantity;
                return updatedCart;
            } else {
                return [...prevCart, { ...newItem, quantity }];
            }
        });
        setIsCartOpen(true);
    }, [setCart]);

    const removeFromCart = useCallback((cartItemId: string) => {
        setCart(prevCart => prevCart.filter(item => generateCartItemId(item) !== cartItemId));
    }, [setCart]);

    const updateQuantity = useCallback((cartItemId: string, quantity: number) => {
        setCart(prevCart =>
            prevCart.map(item =>
                generateCartItemId(item) === cartItemId ? { ...item, quantity: Math.max(1, quantity) } : item
            )
        );
    }, [setCart]);
    
    const getCartItemDetails = useCallback((item: CartItem) => {
        const product = getProductById(item.productId);
        const cartItemId = generateCartItemId(item);
        const accessoriesPrice = item.accessories.reduce((sum, acc) => sum + acc.price.ils, 0);
        const itemTotalPrice = product ? (product.price.ils + accessoriesPrice) * item.quantity : 0;
        return { product, cartItemId, itemTotalPrice };
    }, [getProductById]);


    const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

    const subtotal = useMemo(() => {
        return cart.reduce((total, item) => {
            const { itemTotalPrice } = getCartItemDetails(item);
            return total + itemTotalPrice;
        }, 0);
    }, [cart, getCartItemDetails]);
    
    const discountAmount = useMemo(() => {
        if (!appliedCoupon) return 0;
        return (subtotal * appliedCoupon.discount) / 100;
    }, [subtotal, appliedCoupon]);

    const totalPrice = useMemo(() => subtotal - discountAmount, [subtotal, discountAmount]);
    
    const applyCoupon = useCallback((code: string) => {
        const coupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase());
        if (coupon) {
            setAppliedCoupon(coupon);
            addNotification({ message: t('coupon_applied_success'), type: 'success' });
        } else {
            addNotification({ message: t('coupon_invalid'), type: 'error' });
        }
    }, [setAppliedCoupon, addNotification, t]);

    const removeCoupon = useCallback(() => {
        setAppliedCoupon(null);
        addNotification({ message: t('coupon_removed_success'), type: 'info' });
    }, [setAppliedCoupon, addNotification, t]);

    const value = useMemo(() => ({
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        cartCount,
        isCartOpen,
        setIsCartOpen,
        subtotal,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        discountAmount,
        totalPrice,
        getCartItemDetails
    }), [cart, addToCart, removeFromCart, updateQuantity, cartCount, isCartOpen, setIsCartOpen, subtotal, appliedCoupon, applyCoupon, removeCoupon, discountAmount, totalPrice, getCartItemDetails]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};