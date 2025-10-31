import React from 'react';
import { useLocalization } from '../context/LocalizationContext.tsx';

const Hero: React.FC = () => {
    const { t } = useLocalization();

    const handleScrollToProducts = () => {
        document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div 
            className="relative bg-cover bg-center h-[80vh] min-h-[600px] flex items-center justify-center text-center text-white" 
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519642918688-7e43b19245d8?q=80&w=2070&auto=format&fit=crop')" }}
        >
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            <div className="relative z-10 max-w-3xl px-4">
                <h1 className="text-4xl md:text-6xl font-bold mb-4 font-heebo">{t('hero_title')}</h1>
                <p className="text-lg md:text-xl mb-8">{t('hero_subtitle')}</p>
                <button
                    onClick={handleScrollToProducts}
                    className="bg-[#2C5F5D] px-8 py-3 rounded-full font-bold hover:bg-[#D4896C] transition-colors duration-300 transform hover:scale-105 shadow-lg"
                >
                    {t('hero_button')}
                </button>
            </div>
        </div>
    );
};

export default Hero;