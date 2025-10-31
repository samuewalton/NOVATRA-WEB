

import React from 'react';
import { useWishlist } from '../context/WishlistContext.tsx';
import { useProducts } from '../context/ProductContext.tsx';
import { useLocalization } from '../context/LocalizationContext.tsx';
import { useRouter } from '../context/RouterContext.tsx';
import ProductCard from '../components/ProductCard.tsx';
import type { Product } from '../types.ts';

const WishlistPage: React.FC = () => {
    const { wishlist } = useWishlist();
    const { products } = useProducts();
    const { t } = useLocalization();
    const { navigateTo } = useRouter();

    const wishlistedProducts = React.useMemo(() => {
        return products.filter(p => wishlist.includes(p.id));
    }, [wishlist, products]);

    const handleProductSelect = (product: Product) => {
        navigateTo('product', { productId: product.id });
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold text-center text-[#2C5F5D] mb-8">{t('wishlist_title')}</h1>
            
            {wishlistedProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {wishlistedProducts.map(product => (
                        <ProductCard key={product.id} product={product} onSelect={handleProductSelect} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <p className="text-xl text-gray-500 mb-6">{t('wishlist_empty')}</p>
                    <button
                        onClick={() => navigateTo('home')}
                        className="bg-[#2C5F5D] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#D4896C] transition-colors"
                    >
                        {t('wishlist_explore')}
                    </button>
                </div>
            )}
        </div>
    );
};

export default WishlistPage;