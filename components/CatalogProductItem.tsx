import React from 'react';
import type { Product } from '../types.ts';
import { useLocalization } from '../context/LocalizationContext.tsx';
import { useRouter } from '../context/RouterContext.tsx';

interface CatalogProductItemProps {
    product: Product;
}

const CatalogProductItem: React.FC<CatalogProductItemProps> = ({ product }) => {
    const { language } = useLocalization();
    const { navigateTo } = useRouter();

    const handleProductClick = () => {
        navigateTo('product', { productId: product.id });
    };

    const StockStatusBadge: React.FC<{ inStock: boolean }> = ({ inStock }) => {
        if (inStock) {
            return <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">במלאי</span>;
        }
        return <span className="px-2 py-1 text-xs font-medium text-red-800 bg-red-100 rounded-full">אזל מהמלאי</span>;
    };

    return (
        <div 
            onClick={handleProductClick}
            className="flex items-center gap-4 py-4 hover:bg-gray-50 cursor-pointer transition-colors rounded-md -mx-2 px-2"
        >
            <img src={product.images[0]} alt={product.name[language]} className="w-16 h-16 object-cover rounded-md flex-shrink-0" loading="lazy" />
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div>
                    <p className="font-bold text-gray-800">{product.name[language]}</p>
                    <p className="text-sm text-gray-500">{product.subtitle[language]}</p>
                </div>
                <p className="text-sm text-gray-600 md:text-center">
                    <span className="font-semibold">מק"ט:</span> {product.sku}
                </p>
                <div className="md:text-right">
                    <StockStatusBadge inStock={product.inStock} />
                </div>
            </div>
        </div>
    );
};

export default CatalogProductItem;