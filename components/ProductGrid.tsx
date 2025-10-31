import React from 'react';
import type { Product } from '../types.ts';
import { useLocalization } from '../context/LocalizationContext.tsx';
import ProductCard from './ProductCard.tsx';
import FilterIcon from './icons/FilterIcon.tsx';

interface ProductGridProps {
    products: Product[];
    onProductSelect: (product: Product) => void;
    sortOption: string;
    onSortChange: (value: string) => void;
    onToggleFilters: () => void;
    totalCount: number;
    onLoadMore: () => void;
    hasMore: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, onProductSelect, sortOption, onSortChange, onToggleFilters, totalCount, onLoadMore, hasMore }) => {
    const { t } = useLocalization();

    const sortOptions = [
        { value: 'default', label: t('sort_default') },
        { value: 'price_asc', label: t('sort_price_asc') },
        { value: 'price_desc', label: t('sort_price_desc') },
        { value: 'name_asc', label: t('sort_name_asc') },
        { value: 'name_desc', label: t('sort_name_desc') },
        { value: 'rating_desc', label: t('sort_rating_desc') },
        { value: 'rating_asc', label: t('sort_rating_asc') },
        { value: 'model_asc', label: t('sort_model_asc') },
        { value: 'model_desc', label: t('sort_model_desc') },
    ];

    return (
        <section id="products" className="py-16 bg-[#F7F5F3]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-4">
                     <div className="flex items-center gap-4">
                        <button onClick={onToggleFilters} className="p-2 rounded-md hover:bg-gray-200 lg:hidden" aria-label="Open filters">
                             <FilterIcon className="w-6 h-6 text-[#2C5F5D]" />
                        </button>
                        <h2 className="text-3xl font-bold text-[#2C5F5D]">
                            {t('all_products')}
                        </h2>
                    </div>
                    <select
                        value={sortOption}
                        onChange={(e) => onSortChange(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#A8B5A0]"
                    >
                        {sortOptions.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-12 text-sm text-gray-600">
                    <p>מציג {products.length} מתוך {totalCount} מוצרים</p>
                </div>
                {products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} onSelect={onProductSelect} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <p className="text-xl text-gray-500">לא נמצאו מוצרים התואמים את בחירתך.</p>
                    </div>
                )}
                {hasMore && (
                    <div className="mt-12 text-center">
                        <button 
                            onClick={onLoadMore}
                            className="bg-[#2C5F5D] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#D4896C] transition-colors"
                        >
                            טען עוד מוצרים
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ProductGrid;