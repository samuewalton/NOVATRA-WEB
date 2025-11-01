import React, { createContext, useContext, useMemo, ReactNode, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase.ts';
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
    isLoading: boolean;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { getProductAverageRating } = useReviews();
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load products from Supabase
    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error("Failed to load products from Supabase:", error);
                // Fallback to localStorage if Supabase fails
                const storedProducts = localStorage.getItem('products');
                if (storedProducts) {
                    setProducts(JSON.parse(storedProducts));
                } else {
                    setProducts(initialProducts);
                }
            } else {
                setProducts(data || []);
            }
        } catch (error) {
            console.error("Error loading products:", error);
            // Fallback to localStorage
            const storedProducts = localStorage.getItem('products');
            if (storedProducts) {
                setProducts(JSON.parse(storedProducts));
            } else {
                setProducts(initialProducts);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const addProduct = useCallback(async (productData: Omit<Product, 'id' | 'averageRating' | 'reviewCount'>) => {
        try {
            const { data, error } = await supabase
                .from('products')
                .insert([productData])
                .select()
                .single();

            if (error) {
                console.error("Failed to add product:", error);
                alert('שגיאה בהוספת מוצר: ' + error.message);
                return;
            }

            setProducts(prevProducts => [data, ...prevProducts]);
            alert('המוצר נוסף בהצלחה!');
        } catch (error) {
            console.error("Error adding product:", error);
            alert('שגיאה בהוספת מוצר');
        }
    }, []);

    const updateProduct = useCallback(async (updatedProduct: Product) => {
        try {
            const { id, ...productData } = updatedProduct;
            const { data, error } = await supabase
                .from('products')
                .update(productData)
                .eq('id', id)
                .select()
                .single();

            if (error) {
                console.error("Failed to update product:", error);
                alert('שגיאה בעדכון מוצר: ' + error.message);
                return;
            }

            setProducts(prevProducts =>
                prevProducts.map(p => p.id === id ? data : p)
            );
            alert('המוצר עודכן בהצלחה!');
        } catch (error) {
            console.error("Error updating product:", error);
            alert('שגיאה בעדכון מוצר');
        }
    }, []);

    const deleteProduct = useCallback(async (productId: string) => {
        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', productId);

            if (error) {
                console.error("Failed to delete product:", error);
                alert('שגיאה במחיקת מוצר: ' + error.message);
                return;
            }

            setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
            alert('המוצר נמחק בהצלחה!');
        } catch (error) {
            console.error("Error deleting product:", error);
            alert('שגיאה במחיקת מוצר');
        }
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
        isLoading,
    }), [productsWithRatings, categoriesWithCounts, getProductById, addProduct, updateProduct, deleteProduct, isLoading]);

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