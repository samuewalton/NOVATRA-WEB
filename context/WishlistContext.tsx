
import React, { createContext, useState, useContext, useMemo, useCallback, ReactNode } from 'react';

interface WishlistContextType {
    wishlist: string[]; // Array of product IDs
    addToWishlist: (productId: string) => void;
    removeFromWishlist: (productId: string) => void;
    isProductInWishlist: (productId: string) => boolean;
    wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

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

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [wishlist, setWishlist] = useLocalStorage<string[]>('wishlist', []);

    const addToWishlist = useCallback((productId: string) => {
        setWishlist(prev => {
            if (prev.includes(productId)) return prev;
            return [...prev, productId];
        });
    }, [setWishlist]);

    const removeFromWishlist = useCallback((productId: string) => {
        setWishlist(prev => prev.filter(id => id !== productId));
    }, [setWishlist]);

    const isProductInWishlist = useCallback((productId: string) => {
        return wishlist.includes(productId);
    }, [wishlist]);

    const wishlistCount = useMemo(() => wishlist.length, [wishlist]);

    const value = useMemo(() => ({
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isProductInWishlist,
        wishlistCount
    }), [wishlist, addToWishlist, removeFromWishlist, isProductInWishlist, wishlistCount]);

    return (
        <WishlistContext.Provider value={value}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = (): WishlistContextType => {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};