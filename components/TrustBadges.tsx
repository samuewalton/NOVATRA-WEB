

import React from 'react';
import { useLocalization } from '../context/LocalizationContext.tsx';

const Badge: React.FC<{ icon: React.ReactNode; title: string; text: string }> = ({ icon, title, text }) => (
    <div className="flex flex-col items-center text-center p-6 bg-white/50 rounded-lg shadow-sm">
        <div className="text-4xl text-[#D4896C] mb-4">{icon}</div>
        <h3 className="font-bold text-lg text-[#2C5F5D]">{title}</h3>
        <p className="text-sm text-gray-600">{text}</p>
    </div>
);

const TrustBadges: React.FC = () => {
    const { t } = useLocalization();

    const badges = [
        { 
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>,
            title: t('safety_certified'),
            text: `${t('eu_standard')} & ${t('israeli_standard')}`
        },
        { 
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m-7.5-2.962A3.375 3.375 0 0 1 3 12.375v-1.5c0-1.73 1.472-3.228 3.228-3.465a3.375 3.375 0 0 1 3.5-3.465h.502a3.375 3.375 0 0 1 3.5 3.465c.01.01.016.021.022.031.01.014.02.028.028.043v1.5a3.375 3.375 0 0 1-3.375 3.375h-.502a3.375 3.375 0 0 1-3.5-3.465Z" /></svg>,
            title: t('social_proof'),
            text: t('social_proof_text')
        },
        { 
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.455.09-.934.09-1.425v-2.288a2.25 2.25 0 0 0-.659-1.591l-2.097-2.097c-.074-.074-.074-.196 0-.27l4.155-4.155a.75.75 0 0 1 1.06 0l2.097 2.097a2.25 2.25 0 0 0 1.591.659h2.288c.491 0 .97.04 1.425.09a4.48 4.48 0 0 0 2.025.978 5.969 5.969 0 0 1 .065.474c.18.832.337 1.698.337 2.555Z" /></svg>,
            title: t('whatsapp_support'),
            text: t('whatsapp_support_text')
        },
    ];

    return (
        <section className="py-16 bg-[#E8D5C4]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {badges.map((badge, index) => (
                        <Badge key={index} icon={badge.icon} title={badge.title} text={badge.text} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrustBadges;