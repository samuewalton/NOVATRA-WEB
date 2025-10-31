import React from 'react';
import type { Product } from '../types.ts';
import { useLocalization } from '../context/LocalizationContext.tsx';
import { useRouter } from '../context/RouterContext.tsx';

interface BreadcrumbsProps {
    product: Product;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ product }) => {
    const { language, t } = useLocalization();
    const { navigateTo } = useRouter();

    return (
        <nav className="text-sm text-gray-500" aria-label="Breadcrumb">
            <ol className="list-none p-0 inline-flex items-center space-x-2 rtl:space-x-reverse">
                <li>
                    <button onClick={() => navigateTo('home')} className="hover:text-[#2C5F5D]">
                        {t('breadcrumb_home')}
                    </button>
                </li>
                <li>
                    <span>/</span>
                </li>
                <li>
                    <button onClick={() => navigateTo('home', { category: product.category.en })} className="hover:text-[#2C5F5D]">
                        {product.category[language]}
                    </button>
                </li>
                <li>
                    <span>/</span>
                </li>
                <li aria-current="page" className="font-semibold text-gray-700">
                    {product.name[language]}
                </li>
            </ol>
        </nav>
    );
};

export default Breadcrumbs;