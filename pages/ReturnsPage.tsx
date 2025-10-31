import React from 'react';
import { useLocalization } from '../context/LocalizationContext.tsx';

const ReturnsPage: React.FC = () => {
    const { t } = useLocalization();

    return (
        <div className="bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="max-w-4xl mx-auto prose lg:prose-lg text-gray-700">
                    <h1 className="text-[#2C5F5D]">{t('returns_policy_title')}</h1>
                    <p>{t('returns_policy_p1')}</p>
                    <h2 className="text-[#D4896C]">{t('returns_policy_conditions_title')}</h2>
                    <ul>
                        <li>{t('returns_policy_condition1')}</li>
                        <li>{t('returns_policy_condition2')}</li>
                        <li>{t('returns_policy_condition3')}</li>
                    </ul>
                    <h2 className="text-[#D4896C]">{t('returns_policy_process_title')}</h2>
                    <p>{t('returns_policy_process_p1')}</p>
                    <h2 className="text-[#D4896C]">{t('returns_policy_refunds_title')}</h2>
                    <p>{t('returns_policy_refunds_p1')}</p>
                </div>
            </div>
        </div>
    );
};

export default ReturnsPage;
