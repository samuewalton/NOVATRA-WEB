
import React, { createContext, useState, useContext, useMemo, useCallback, ReactNode } from 'react';
import { reviews as allReviews } from '../data/reviews.ts';
import type { Review } from '../types.ts';

interface ReviewContextType {
    getReviewsForProduct: (productId: string) => Review[];
    addReview: (review: Omit<Review, 'id' | 'date'>) => void;
    getProductAverageRating: (productId: string) => { average: number, count: number };
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

export const ReviewProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [reviews, setReviews] = useState<Review[]>(allReviews);

    const getReviewsForProduct = useCallback((productId: string): Review[] => {
        return reviews.filter(r => r.productId === productId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [reviews]);

    const addReview = useCallback((review: Omit<Review, 'id' | 'date'>) => {
        const newReview: Review = {
            ...review,
            id: `rev${Date.now()}`,
            date: new Date().toISOString(),
        };
        setReviews(prev => [newReview, ...prev]);
        // In a real app, you'd send this to a server.
    }, []);

    const getProductAverageRating = useCallback((productId: string): { average: number, count: number } => {
        const productReviews = reviews.filter(r => r.productId === productId);
        if (productReviews.length === 0) {
            return { average: 0, count: 0 };
        }
        const totalRating = productReviews.reduce((sum, review) => sum + review.rating, 0);
        return {
            average: totalRating / productReviews.length,
            count: productReviews.length
        };
    }, [reviews]);

    const value = useMemo(() => ({
        getReviewsForProduct,
        addReview,
        getProductAverageRating,
    }), [getReviewsForProduct, addReview, getProductAverageRating]);

    return (
        <ReviewContext.Provider value={value}>
            {children}
        </ReviewContext.Provider>
    );
};

export const useReviews = (): ReviewContextType => {
    const context = useContext(ReviewContext);
    if (context === undefined) {
        throw new Error('useReviews must be used within a ReviewProvider');
    }
    return context;
};