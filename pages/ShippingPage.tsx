import React from 'react';
import { useLocalization } from '../context/LocalizationContext.tsx';

const ShippingPage: React.FC = () => {
    const { t } = useLocalization();

    return (
        <div className="bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="max-w-4xl mx-auto prose lg:prose-lg text-gray-700">
                    <h1 className="text-[#2C5F5D]">{t('shipping_policy_title')}</h1>
                    <p>{t('shipping_policy_p1')}</p>
                    <h2 className="text-[#D4896C]">{t('shipping_policy_zones_title')}</h2>
                    <p>{t('shipping_policy_zones_p1')}</p>
                    <ul>
                        <li>{t('shipping_policy_zone1')}</li>
                        <li>{t('shipping_policy_zone2')}</li>
                        <li>{t('shipping_policy_zone3')}</li>
                    </ul>
                    <h2 className="text-[#D4896C]">{t('shipping_policy_times_title')}</h2>
                    <p>{t('shipping_policy_times_p1')}</p>
                    <h2 className="text-[#D4896C]">{t('shipping_policy_contact_title')}</h2>
                    <p>{t('shipping_policy_contact_p1')}</p>
                </div>
            </div>
        </div>
    );
};

export default ShippingPage;
