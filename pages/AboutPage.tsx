
import React from 'react';
import { useLocalization } from '../context/LocalizationContext.tsx';

const AboutPage: React.FC = () => {
    const { t } = useLocalization();

    return (
        <div className="bg-white">
            <div className="relative h-80 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=2057&auto=format&fit=crop')" }}>
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <h1 className="text-5xl font-bold text-white tracking-tight">{t('about_page_title')}</h1>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-[#2C5F5D] mb-4">{t('about_intro_title')}</h2>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            {t('about_intro_p1')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
                        <img src="https://images.unsplash.com/photo-1560114999-d9354b6a8a3a?q=80&w=1974&auto=format&fit=crop" alt="Veres furniture detail" className="rounded-lg shadow-xl" />
                        <div>
                            <h3 className="text-2xl font-bold text-[#D4896C] mb-3">{t('about_veres_title')}</h3>
                            <p className="text-gray-600 leading-relaxed">
                                {t('about_veres_p1')}
                            </p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="md:order-2">
                            <img src="https://images.unsplash.com/photo-1599684364239-6016d4d12c9b?q=80&w=1974&auto=format&fit=crop" alt="Happy family with baby" className="rounded-lg shadow-xl" />
                        </div>
                        <div className="md:order-1">
                            <h3 className="text-2xl font-bold text-[#D4896C] mb-3">{t('about_commitment_title')}</h3>
                            <p className="text-gray-600 leading-relaxed">
                                {t('about_commitment_p1')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;