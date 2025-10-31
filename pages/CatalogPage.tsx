import React, { useMemo, useState, useEffect } from 'react';
import { useProducts } from '../context/ProductContext.tsx';
import { useLocalization } from '../context/LocalizationContext.tsx';
import { Product, LocalizedString } from '../types.ts';
import CatalogProductItem from '../components/CatalogProductItem.tsx';

interface GroupedProducts {
    [categoryName: string]: {
        category: LocalizedString;
        products: Product[];
    }
}

const SkeletonListItem: React.FC = () => (
    <div className="flex items-center gap-4 py-4 animate-pulse">
        <div className="w-16 h-16 bg-gray-200 rounded-md flex-shrink-0" />
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="md:text-right">
                <div className="h-5 bg-gray-200 rounded-full w-16" />
            </div>
        </div>
    </div>
);

const CatalogPage: React.FC = () => {
    const { products } = useProducts();
    const { language } = useLocalization();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    const groupedProducts = useMemo(() => {
        const groups: GroupedProducts = {};
        products.forEach(product => {
            const categoryKey = product.category[language] || product.category.en;
            if (!groups[categoryKey]) {
                groups[categoryKey] = {
                    category: product.category,
                    products: []
                };
            }
            groups[categoryKey].products.push(product);
        });
        return groups;
    }, [products, language]);

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
                <h1 className="text-4xl font-bold text-center text-[#2C5F5D] mb-12">סקירת קטלוג</h1>
                
                <div className="space-y-12">
                    {isLoading ? (
                        [...Array(3)].map((_, i) => (
                             <div key={i} className="bg-white p-6 rounded-lg shadow-md">
                                <div className="h-8 bg-gray-200 rounded w-1/3 mb-6" />
                                <div className="divide-y divide-gray-200">
                                    {[...Array(4)].map((_, j) => <SkeletonListItem key={j} />)}
                                </div>
                            </div>
                        ))
                    ) : (
                        (Object.values(groupedProducts) as Array<{ category: LocalizedString, products: Product[] }>).sort((a,b) => a.category[language].localeCompare(b.category[language])).map(({ category, products: categoryProducts }) => (
                            <div key={category.en} className="bg-white p-6 rounded-lg shadow-md">
                                <h2 className="text-2xl font-semibold text-[#D4896C] mb-6 border-b pb-4">
                                    {category[language]}
                                </h2>
                                <div className="divide-y divide-gray-200">
                                    {categoryProducts.sort((a,b) => a.name[language].localeCompare(b.name[language])).map(product => (
                                        <CatalogProductItem key={product.id} product={product} />
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default CatalogPage;