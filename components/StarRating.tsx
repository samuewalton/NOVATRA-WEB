
import React from 'react';
import StarIcon from './icons/StarIcon.tsx';

interface StarRatingProps {
    rating: number;
    totalStars?: number;
    className?: string;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, totalStars = 5, className }) => {
    const fullStars = Math.floor(rating);
    // Note: Half-star logic is not implemented, but the structure allows for it.
    const emptyStars = totalStars - fullStars;

    return (
        <div className={`flex items-center ${className}`}>
            {[...Array(fullStars)].map((_, i) => (
                <StarIcon key={`full-${i}`} className="w-5 h-5 text-yellow-400" filled />
            ))}
            {[...Array(emptyStars)].map((_, i) => (
                <StarIcon key={`empty-${i}`} className="w-5 h-5 text-gray-300" />
            ))}
        </div>
    );
};

export default StarRating;
