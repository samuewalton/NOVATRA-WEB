import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useProducts } from '../context/ProductContext.tsx';
import { useRouter } from '../context/RouterContext.tsx';
import type { Product, Color, CategoryInfo } from '../types.ts';
import { useLocalization } from '../context/LocalizationContext.tsx';
import Hero from '../components/Hero.tsx';
import ProductGrid from '../components/ProductGrid.tsx';
import TrustBadges from '../components/TrustBadges.tsx';
import FilterPanel from '../components/FilterPanel.tsx';
import CloseIcon from '../components/icons/CloseIcon.tsx';
import CategoryShowcase from '../components/CategoryShowcase.tsx';

const PRODUCTS_PER_PAGE = 8;

const SkeletonCard: React.FC = () => (
    <div className="animate-pulse space-y-4">
        <div className="bg-gray-200 aspect-square rounded-lg" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
        <div className="h-8 bg-gray-200 rounded w-full" />
    </div>
);


const ActiveFilters: React.FC<{
    params: Record<string, string>;
    onClear: (key: string, value?: string) => void;
    onClearAll: () => void;
    categories: CategoryInfo[];
}> = ({ params, onClear, onClearAll, categories }) => {
    const { language } = useLocalization();
    const { products } = useProducts();

    const activeFilters = useMemo(() => {
        const filters = [];
        
        if (params.category) {
            const category = categories.find(c => c.key === params.category);
            filters.push({ type: 'קטגוריה', value: params.category, label: category?.name[language] || params.category, key: 'category' });
        }
        if (params.search) {
            filters.push({ type: 'חיפוש', value: params.search, label: `"${params.search}"`, key: 'search' });
        }
        if (params.collections) {
            const collections = params.collections.split(',');
            collections.forEach(c => filters.push({ type: 'קולקציה', value: c, label: c, key: `collection-${c}` }));
        }
        if (params.colors) {
            const colors = params.colors.split(',');
            const allColors = new Map<string, Color>();
             products.forEach(p => p.colors.forEach(c => allColors.set(c.hex, c)));
            colors.forEach(hex => {
                const color = allColors.get(hex);
                filters.push({ type: 'צבע', value: hex, label: color?.name[language] || hex, key: `color-${hex}` });
            });
        }
        return filters;
    }, [params, language, products, categories]);

    if (activeFilters.length === 0) return null;

    const handleRemove = (filter: typeof activeFilters[0]) => {
        if (filter.key === 'search' || filter.key === 'category') {
            onClear(filter.key);
        } else if (filter.key.startsWith('collection-')) {
            onClear('collections', filter.value);
        } else if (filter.key.startsWith('color-')) {
            onClear('colors', filter.value);
        }
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold">סינונים פעילים:</span>
                {activeFilters.map(filter => (
                    <div key={filter.key} className="flex items-center bg-gray-200 text-gray-700 rounded-full px-3 py-1 text-sm">
                        <span>{filter.label}</span>
                        <button onClick={() => handleRemove(filter)} className="ltr:ml-2 rtl:mr-2 text-gray-500 hover:text-gray-800">
                            <CloseIcon className="w-4 h-4" />
                        </button>
                    </div>
                ))}
                <button onClick={onClearAll} className="text-sm text-red-500 hover:underline">נקה הכל</button>
            </div>
        </div>
    );
};


const HomePage: React.FC = () => {
    const { products, categories } = useProducts();
    const { navigateTo, params } = useRouter();
    const { language } = useLocalization();
    const [sortOption, setSortOption] = useState('default');
    const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
    const [visibleCount, setVisibleCount] = useState(PRODUCTS_PER_PAGE);
    const [isLoading, setIsLoading] = useState(true);

    const handleProductSelect = (product: Product) => {
        navigateTo('product', { productId: product.id });
    };

    const allCollections = useMemo(() => {
        const collections = new Set(products.map(p => p.collection[language]));
        return Array.from(collections);
    }, [products, language]);

    const allColors = useMemo(() => {
        const colorMap = new Map<string, Color>();
        products.forEach(p => {
            p.colors.forEach(c => {
                if (!colorMap.has(c.hex)) {
                    colorMap.set(c.hex, c);
                }
            });
        });
        return Array.from(colorMap.values());
    }, [products]);

    const selectedCollections = useMemo(() => params.collections?.split(',') || [], [params.collections]);
    const selectedColors = useMemo(() => params.colors?.split(',') || [], [params.colors]);

    const handleFilterChange = useCallback((type: 'collections' | 'colors' | 'search' | 'category', value: string) => {
        let newParams = { ...params };
        setVisibleCount(PRODUCTS_PER_PAGE); // Reset pagination on filter change

        if (type === 'search' || type === 'category') {
            if (value) {
                newParams[type] = value;
            } else {
                delete newParams[type];
            }
        } else {
            const currentValues = params[type]?.split(',') || [];
            const newValues = currentValues.includes(value)
                ? currentValues.filter(v => v !== value)
                : [...currentValues, value];
            
            if (newValues.length > 0) {
                newParams[type] = newValues.join(',');
            } else {
                delete newParams[type];
            }
        }
        
        navigateTo('home', newParams);
    }, [params, navigateTo]);
    
    const handleClearFilter = useCallback((key: string, value?: string) => {
        const newParams = { ...params };
        setVisibleCount(PRODUCTS_PER_PAGE);
        if (key === 'search' || key === 'category') {
            delete newParams[key as 'search' | 'category'];
        } else if (key === 'collections' && value) {
            const current = newParams.collections?.split(',') || [];
            const updated = current.filter(v => v !== value);
            if (updated.length > 0) newParams.collections = updated.join(',');
            else delete newParams.collections;
        } else if (key === 'colors' && value) {
            const current = newParams.colors?.split(',') || [];
            const updated = current.filter(v => v !== value);
            if (updated.length > 0) newParams.colors = updated.join(',');
            else delete newParams.colors;
        }
        navigateTo('home', newParams);
    }, [params, navigateTo]);
    
    const handleClearAllFilters = useCallback(() => {
        setVisibleCount(PRODUCTS_PER_PAGE);
        navigateTo('home', {});
    }, [navigateTo]);

    const filteredProducts = useMemo(() => {
        let tempProducts = [...products];
        const searchTerm = params.search?.toLowerCase();
        const category = params.category;

        if (category) {
            tempProducts = tempProducts.filter(p => p.category.en === category);
        }

        if (searchTerm) {
            tempProducts = tempProducts.filter(p =>
                p.name[language].toLowerCase().includes(searchTerm) ||
                p.subtitle[language].toLowerCase().includes(searchTerm) ||
                p.description[language].toLowerCase().includes(searchTerm) ||
                p.sku.toLowerCase().includes(searchTerm)
            );
        }

        if (selectedCollections.length > 0) {
            tempProducts = tempProducts.filter(p => selectedCollections.includes(p.collection[language]));
        }

        if (selectedColors.length > 0) {
            tempProducts = tempProducts.filter(p => p.colors.some(c => selectedColors.includes(c.hex)));
        }

        return tempProducts;
    }, [products, language, params.search, params.category, selectedCollections, selectedColors]);

    const sortedProducts = useMemo(() => {
        const sorted = [...filteredProducts];
        switch (sortOption) {
            case 'price_asc':
                return sorted.sort((a, b) => a.price.ils - b.price.ils);
            case 'price_desc':
                return sorted.sort((a, b) => b.price.ils - a.price.ils);
            case 'name_asc':
                return sorted.sort((a, b) => a.name[language].localeCompare(b.name[language]));
            case 'name_desc':
                return sorted.sort((a, b) => b.name[language].localeCompare(a.name[language]));
            case 'rating_desc':
                return sorted.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
            case 'rating_asc':
                return sorted.sort((a, b) => (a.averageRating || 0) - (b.averageRating || 0));
            case 'model_asc':
                return sorted.sort((a, b) => a.collection[language].localeCompare(b.collection[language]));
            case 'model_desc':
                return sorted.sort((a, b) => b.collection[language].localeCompare(a.collection[language]));
            default:
                // Potentially add a default sort like creation date if available
                return sorted;
        }
    }, [filteredProducts, sortOption, language]);
    
    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500); // Simulate loading
        return () => clearTimeout(timer);
    }, [sortedProducts, params]);


    const productsToShow = useMemo(() => sortedProducts.slice(0, visibleCount), [sortedProducts, visibleCount]);
    const hasMoreProducts = visibleCount < sortedProducts.length;

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + PRODUCTS_PER_PAGE);
    };

    return (
        <>
            <Hero />
            <CategoryShowcase />
            <div className="flex">
                <aside className="hidden lg:block w-64 p-8">
                     <FilterPanel 
                        isOpen={true}
                        onClose={() => {}} // dummy, not used on desktop
                        collections={allCollections}
                        colors={allColors}
                        selectedCollections={selectedCollections}
                        selectedColors={selectedColors}
                        onCollectionToggle={(collection) => handleFilterChange('collections', collection)}
                        onColorToggle={(hex) => handleFilterChange('colors', hex)}
                        onClearFilters={handleClearAllFilters}
                        isDesktop
                    />
                </aside>
                <div className="flex-1">
                    <ActiveFilters params={params} onClear={handleClearFilter} onClearAll={handleClearAllFilters} categories={categories} />
                    {isLoading ? (
                         <section id="products" className="py-16 bg-[#F7F5F3]">
                             <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                    {[...Array(PRODUCTS_PER_PAGE)].map((_, i) => <SkeletonCard key={i} />)}
                                </div>
                            </div>
                         </section>
                    ) : (
                        <ProductGrid 
                            products={productsToShow} 
                            onProductSelect={handleProductSelect} 
                            sortOption={sortOption}
                            onSortChange={setSortOption}
                            onToggleFilters={() => setIsFilterPanelOpen(true)}
                            totalCount={sortedProducts.length}
                            onLoadMore={handleLoadMore}
                            hasMore={hasMoreProducts}
                        />
                    )}
                </div>
            </div>
            <TrustBadges />
             <FilterPanel 
                isOpen={isFilterPanelOpen}
                onClose={() => setIsFilterPanelOpen(false)}
                collections={allCollections}
                colors={allColors}
                selectedCollections={selectedCollections}
                selectedColors={selectedColors}
                onCollectionToggle={(collection) => handleFilterChange('collections', collection)}
                onColorToggle={(hex) => handleFilterChange('colors', hex)}
                onClearFilters={handleClearAllFilters}
            />
        </>
    );
};

export default HomePage;