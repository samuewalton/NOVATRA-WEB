import React from 'react';
import { useProducts } from '../context/ProductContext.tsx';
import { useLocalization } from '../context/LocalizationContext.tsx';
import { useRouter } from '../context/RouterContext.tsx';

const CategoryShowcase: React.FC = () => {
    const { categories } = useProducts();
    const { language } = useLocalization();
    const { navigateTo } = useRouter();

    const handleCategoryClick = (categoryKey: string) => {
        navigateTo('home', { category: categoryKey });
        setTimeout(() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }), 100);
    };

    if (categories.length === 0) return null;

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center text-[#2C5F5D] mb-12">קטגוריות מובילות</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {categories.map(category => (
                        <div 
                            key={category.key} 
                            onClick={() => handleCategoryClick(category.key)}
                            className="group relative rounded-lg overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                        >
                            <img src={category.image} alt={category.name[language]} className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                <h3 className="text-2xl font-bold">{category.name[language]}</h3>
                                <p className="text-sm opacity-90">{category.productCount} מוצרים</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategoryShowcase;