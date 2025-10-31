

import React, { useEffect } from 'react';
import { useProducts } from '../context/ProductContext.tsx';
import { useRouter } from '../context/RouterContext.tsx';
import ProductPage from './ProductPage.tsx';

interface ProductPageWrapperProps {
    productId?: string;
}

const ProductPageWrapper: React.FC<ProductPageWrapperProps> = ({ productId }) => {
    const { getProductById } = useProducts();
    const { navigateTo } = useRouter();
    
    useEffect(() => {
        // Scroll to the top of the page whenever a new product is loaded.
        window.scrollTo(0, 0);
    }, [productId]);

    useEffect(() => {
        if (!productId) {
            // Handle case where productId is missing by redirecting to home
            navigateTo('home');
        }
    }, [productId, navigateTo]);

    if (!productId) {
        // Render nothing while the redirect is happening
        return null;
    }

    const product = getProductById(productId);

    if (!product) {
        // Handle product not found
        return (
            <div className="pt-24 text-center py-20">
                <h1 className="text-2xl">Product not found.</h1>
                <button onClick={() => navigateTo('home')} className="mt-4 text-[#2C5F5D]">
                    Back to Home
                </button>
            </div>
        );
    }
    
    return <ProductPage product={product} />;
};

export default ProductPageWrapper;