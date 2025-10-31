import React, { createContext, useContext, useMemo, ReactNode, useState, useEffect, useCallback } from 'react';
import { products as initialProducts } from '../data/products.ts';
import { definedCategories } from '../data/categories.ts';
import type { Product, CategoryInfo } from '../types.ts';
import { useReviews } from './ReviewContext.tsx';

interface ProductContextType {
    products: Product[];
    categories: CategoryInfo[];
    getProductById: (id: string) => Product | undefined;
    addProduct: (product: Omit<Product, 'id' | 'averageRating' | 'reviewCount'>) => void;
    updateProduct: (product: Product) => void;
    deleteProduct: (productId: string) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { getProductAverageRating } = useReviews();
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        try {
            const storedProducts = localStorage.getItem('products');
            if (storedProducts) {
                setProducts(JSON.parse(storedProducts));
            } else {
                localStorage.setItem('products', JSON.stringify(initialProducts));
                setProducts(initialProducts);
            }
        } catch (error) {
            console.error("Failed to load products from localStorage", error);
            setProducts(initialProducts);
        }
    }, []);

    const persistProducts = (updatedProducts: Product[]) => {
        try {
            localStorage.setItem('products', JSON.stringify(updatedProducts));
            setProducts(updatedProducts);
        } catch (error) {
            console.error("Failed to save products to localStorage", error);
        }
    };

    const addProduct = useCallback((productData: Omit<Product, 'id' | 'averageRating' | 'reviewCount'>) => {
        setProducts(prevProducts => {
            const newProduct: Product = {
                ...productData,
                id: `prod_${Date.now()}`,
            };
            const updatedProducts = [...prevProducts, newProduct];
            persistProducts(updatedProducts);
            return updatedProducts;
        });
    }, []);

    const updateProduct = useCallback((updatedProduct: Product) => {
        setProducts(prevProducts => {
            const updatedProducts = prevProducts.map(p => p.id === updatedProduct.id ? updatedProduct : p);
            persistProducts(updatedProducts);
            return updatedProducts;
        });
    }, []);
    
    const deleteProduct = useCallback((productId: string) => {
        setProducts(prevProducts => {
            const updatedProducts = prevProducts.filter(p => p.id !== productId);
            persistProducts(updatedProducts);
            return updatedProducts;
        });
    }, []);

    const productsWithRatings = useMemo(() => {
        return products.map(product => {
            const { average, count } = getProductAverageRating(product.id);
            return {
                ...product,
                averageRating: average,
                reviewCount: count,
            };
        });
    }, [products, getProductAverageRating]);

    const categoriesWithCounts = useMemo(() => {
        return definedCategories.map(category => {
            const count = products.filter(p => p.category.en === category.key).length;
            return {
                ...category,
                productCount: count,
            };
        }).filter(c => c.productCount > 0);
    }, [products]);


    const getProductById = useCallback((id: string): Product | undefined => {
        // Use the memoized version with ratings for display
        return productsWithRatings.find(p => p.id === id);
    }, [productsWithRatings]);

    const value = useMemo(() => ({
        products: productsWithRatings,
        categories: categoriesWithCounts,
        getProductById,
        addProduct,
        updateProduct,
        deleteProduct,
    }), [productsWithRatings, categoriesWithCounts, getProductById, addProduct, updateProduct, deleteProduct]);

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    );
};

export const useProducts = (): ProductContextType => {
    const context = useContext(ProductContext);
    if (context === undefined) {
        throw new Error('useProducts must be used within a ProductProvider');
    }
    return context;
};