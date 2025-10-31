import React, { useState } from 'react';
import type { Product } from '../types.ts';
import { useLocalization } from '../context/LocalizationContext.tsx';
import { useWishlist } from '../context/WishlistContext.tsx';
import { useNotification } from '../context/NotificationContext.tsx';
import HeartIcon from './icons/HeartIcon.tsx';
import PurchaseModal from './PurchaseModal.tsx';
import StarRating from './StarRating.tsx';

interface ProductCardProps {
    product: Product;
    onSelect: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
    const { language, t } = useLocalization();
    const { isProductInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
    const { addNotification } = useNotification();
    const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);

    const isInWishlist = isProductInWishlist(product.id);

    const handleWishlistToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isInWishlist) {
            removeFromWishlist(product.id);
            addNotification({ message: t('wishlist_removed_notification'), type: 'info' });
        } else {
            addToWishlist(product.id);
            addNotification({ message: t('wishlist_added_notification'), type: 'success' });
        }
    };
    
    const handleAddToCartClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsPurchaseModalOpen(true);
    };

    const formatPrice = (price: number, currency: 'ILS' | 'EUR') => {
        const options: Intl.NumberFormatOptions = {
            style: 'currency',
            currency,
            minimumFractionDigits: 0,
        };
        const locale = currency === 'ILS' ? 'he-IL' : 'de-DE'; // Using German locale for Euro formatting
        return new Intl.NumberFormat(locale, options).format(price);
    };
    
    return (
        <>
            <div 
                onClick={() => onSelect(product)} 
                className="group bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 flex flex-col"
            >
                <div className="relative">
                    <img 
                        src={product.images[0]} 
                        alt={product.name[language]} 
                        className="w-full h-64 object-cover"
                        loading="lazy"
                    />
                    {!product.inStock && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                            {t('out_of_stock')}
                        </div>
                    )}
                    <button 
                        onClick={handleWishlistToggle}
                        className="absolute top-2 right-2 p-2 bg-white/70 rounded-full text-gray-600 hover:text-red-500 transition-colors"
                        aria-label={isInWishlist ? t('remove_from_wishlist') : t('add_to_wishlist')}
                    >
                        <HeartIcon className="w-6 h-6" filled={isInWishlist} />
                    </button>
                </div>
                <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold text-gray-800 truncate" title={product.name[language]}>{product.name[language]}</h3>
                    <p className="text-xs text-gray-500 mb-1">מק"ט: {product.sku}</p>
                    <p className="text-xs text-gray-500 mb-2 truncate" title={product.colors.map(c => c.name[language]).join(' / ')}>
                        צבע: {product.colors.map(c => c.name[language]).join(' / ')}
                    </p>
                    
                    {product.reviewCount && product.reviewCount > 0 && (
                        <div className="flex items-center gap-2 mb-2">
                             <StarRating rating={product.averageRating || 0} />
                             <span className="text-xs text-gray-500">({product.reviewCount})</span>
                        </div>
                    )}
                    
                    <div className="mt-auto flex justify-between items-baseline">
                        <p className="text-xl font-semibold text-[#2C5F5D]">{formatPrice(product.price.ils, 'ILS')}</p>
                        <p className="text-sm font-medium text-gray-500">{formatPrice(product.price.eur, 'EUR')}</p>
                    </div>
                </div>
                <div className="p-4 pt-0">
                    <button 
                        onClick={handleAddToCartClick}
                        disabled={!product.inStock}
                        className="w-full bg-[#2C5F5D] text-white py-2 rounded-md font-semibold hover:bg-[#D4896C] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {t('add_to_cart')}
                    </button>
                </div>
            </div>
            {isPurchaseModalOpen && (
                <PurchaseModal 
                    product={product} 
                    isOpen={isPurchaseModalOpen}
                    onClose={() => setIsPurchaseModalOpen(false)}
                />
            )}
        </>
    );
};

export default ProductCard;