import React, { useState, useMemo, useRef, useEffect } from 'react';
import type { Product, Color, Accessory } from '../types.ts';
import { useLocalization } from '../context/LocalizationContext.tsx';
import { useCart } from '../context/CartContext.tsx';
import { useWishlist } from '../context/WishlistContext.tsx';
import { useProducts } from '../context/ProductContext.tsx';
import { useNotification } from '../context/NotificationContext.tsx';
import { generateSpeechFromText } from '../services/geminiService.ts';
import Breadcrumbs from '../components/Breadcrumbs.tsx';
import StarRating from '../components/StarRating.tsx';
import ProductReviews from '../components/ProductReviews.tsx';
import PurchaseModal from '../components/PurchaseModal.tsx';
import VirtualDesignerModal from '../components/VirtualDesignerModal.tsx';
import AccessoriesSection from '../components/AccessoriesSection.tsx';
import ProductCard from '../components/ProductCard.tsx';
import HeartIcon from '../components/icons/HeartIcon.tsx';
import SpeakerIcon from '../components/icons/SpeakerIcon.tsx';
import SparklesIcon from '../components/icons/SparklesIcon.tsx';
import CheckIcon from '../components/icons/CheckIcon.tsx';
import { useRouter } from '../context/RouterContext.tsx';

interface ProductPageProps {
    product: Product;
}

const ProductPage: React.FC<ProductPageProps> = ({ product }) => {
    const { language, t } = useLocalization();
    const { addToCart } = useCart();
    const { isProductInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
    const { addNotification } = useNotification();
    const { products } = useProducts();
    const { navigateTo } = useRouter();

    const [selectedColor, setSelectedColor] = useState<Color>(product.colors[0]);
    const [selectedAccessories, setSelectedAccessories] = useState<Accessory[]>([]);
    const [mainImage, setMainImage] = useState(product.images[0]);
    const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
    const [isVirtualDesignerOpen, setIsVirtualDesignerOpen] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isZoomed, setIsZoomed] = useState(false);
    
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Reset state when product changes
        setMainImage(product.images[0]);
        setSelectedColor(product.colors[0]);
        setSelectedAccessories([]);
    }, [product]);

    const isInWishlist = isProductInWishlist(product.id);

    const handleWishlistToggle = () => {
        if (isInWishlist) {
            removeFromWishlist(product.id);
            addNotification({ message: t('wishlist_removed_notification'), type: 'info' });
        } else {
            addToWishlist(product.id);
            addNotification({ message: t('wishlist_added_notification'), type: 'success' });
        }
    };

    const handleAccessoryToggle = (acc: Accessory) => {
        setSelectedAccessories(prev =>
            prev.find(a => a.id === acc.id)
                ? prev.filter(a => a.id !== acc.id)
                : [...prev, acc]
        );
    };
    
    const handleListenDescription = async () => {
        if (isSpeaking) {
            audioRef.current?.pause();
            setIsSpeaking(false);
            return;
        }
        setIsSpeaking(true);
        try {
            const audioBase64 = await generateSpeechFromText(product.description[language]);
            if (audioBase64) {
                const audioSrc = `data:audio/webm;base64,${audioBase64}`;
                if (!audioRef.current) {
                    audioRef.current = new Audio();
                }
                audioRef.current.src = audioSrc;
                audioRef.current.play();
                audioRef.current.onended = () => setIsSpeaking(false);
            } else {
                 setIsSpeaking(false);
            }
        } catch (error) {
            console.error("Error playing description:", error);
            setIsSpeaking(false);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat(language === 'he' ? 'he-IL' : 'en-US', {
            style: 'currency',
            currency: 'ILS',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const totalPrice = useMemo(() => {
        const accessoriesTotal = selectedAccessories.reduce((sum, acc) => sum + acc.price.ils, 0);
        return product.price.ils + accessoriesTotal;
    }, [product.price.ils, selectedAccessories]);
    
    const similarProducts = useMemo(() => {
        return products.filter(p => product.similarProductIds.includes(p.id));
    }, [products, product.similarProductIds]);
    
    const handleProductSelect = (p: Product) => {
        navigateTo('product', { productId: p.id });
    };

    return (
        <>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
                <Breadcrumbs product={product} />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-8">
                    {/* Image Gallery */}
                    <div>
                        <div className="mb-4 aspect-square bg-gray-100 rounded-lg overflow-hidden">
                            <img 
                                src={mainImage} 
                                alt={product.name[language]} 
                                className="w-full h-full object-contain cursor-zoom-in"
                                loading="lazy"
                                onClick={() => setIsZoomed(true)}
                             />
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                            {product.images.slice(0, 4).map((img, index) => (
                                <button key={index} onClick={() => setMainImage(img)} className={`aspect-square bg-gray-100 rounded-md overflow-hidden border-2 ${mainImage === img ? 'border-[#2C5F5D]' : 'border-transparent'}`}>
                                    <img src={img} alt={`${product.name[language]} view ${index + 1}`} className="w-full h-full object-cover" loading="lazy" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className="space-y-6">
                        <h1 className="text-4xl font-bold text-gray-800">{product.name[language]}</h1>
                        <p className="text-xl text-gray-500">{product.subtitle[language]}</p>
                        
                        {product.reviewCount && product.reviewCount > 0 && (
                            <div className="flex items-center gap-2">
                                <StarRating rating={product.averageRating || 0} />
                                <span className="text-sm text-gray-500">{t('based_on_reviews').replace('{count}', String(product.reviewCount))}</span>
                            </div>
                        )}
                        
                        <div className="text-4xl font-bold text-[#2C5F5D]">{formatPrice(totalPrice)}</div>

                        {product.stock && product.stock < 5 && product.stock > 0 && (
                            <div className="text-orange-600 font-medium text-sm my-2 p-2 bg-orange-100 rounded-md">
                                {t('stock_urgency').replace('{stock}', String(product.stock))}
                            </div>
                        )}
                        
                        <div className="flex items-center gap-2">
                             <p className="flex-grow text-gray-700">{product.description[language]}</p>
                             <button onClick={handleListenDescription} disabled={isSpeaking} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 disabled:opacity-50" aria-label="Listen to description">
                                <SpeakerIcon className={`w-6 h-6 ${isSpeaking ? 'text-blue-500' : 'text-gray-600'}`} />
                             </button>
                        </div>
                        
                        <div>
                            <h3 className="font-semibold mb-2">{t('select_color')}: <span className="font-normal">{selectedColor.name[language]}</span></h3>
                            <div className="flex gap-2">
                                {product.colors.map(color => (
                                    <button
                                        key={color.hex}
                                        onClick={() => setSelectedColor(color)}
                                        className={`w-8 h-8 rounded-full border-2 ${selectedColor.hex === color.hex ? 'border-[#2C5F5D] ring-2 ring-offset-1 ring-[#2C5F5D]' : 'border-gray-300'}`}
                                        style={{ backgroundColor: color.hex }}
                                        aria-label={`Select color ${color.name[language]}`}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="border-t pt-6 space-y-4">
                             <button
                                onClick={() => setIsPurchaseModalOpen(true)}
                                disabled={!product.inStock}
                                className="w-full bg-[#2C5F5D] text-white py-4 rounded-lg font-semibold text-lg hover:bg-[#D4896C] transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {product.inStock ? t('add_to_cart_cta') : t('out_of_stock')}
                            </button>
                            <div className="flex items-center gap-4">
                                <button onClick={handleWishlistToggle} className="flex-1 flex items-center justify-center gap-2 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                                    <HeartIcon className="w-6 h-6" filled={isInWishlist} />
                                    <span>{isInWishlist ? t('remove_from_wishlist') : t('add_to_wishlist')}</span>
                                </button>
                                <button onClick={() => setIsVirtualDesignerOpen(true)} className="flex-1 flex items-center justify-center gap-2 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                                    <SparklesIcon className="w-6 h-6 text-purple-500" />
                                    <span>{'עצבו בחדר שלי'}</span>
                                </button>
                            </div>
                        </div>
                        
                        {product.features && (
                            <div className="pt-6 border-t">
                                <h3 className="font-semibold mb-2 text-gray-800">תכונות עיקריות</h3>
                                <ul className="space-y-2 text-gray-600">
                                    {product.features.map((feature, index) => (
                                        <li key={index} className="flex items-start">
                                            <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-1 rtl:ml-2 ltr:mr-2"/>
                                            <span>{feature[language]}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        
                    </div>
                </div>
            </div>

            {product.accessories.length > 0 && (
                <AccessoriesSection
                    accessories={product.accessories}
                    selected={selectedAccessories}
                    onToggle={handleAccessoryToggle}
                />
            )}
            
            <ProductReviews productId={product.id} />
            
             {similarProducts.length > 0 && (
                <section className="py-16 bg-[#F7F5F3]">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold text-center text-[#2C5F5D] mb-8">מוצרים דומים שאולי תאהבו</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {similarProducts.map(p => (
                                <ProductCard key={p.id} product={p} onSelect={handleProductSelect} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {isPurchaseModalOpen && (
                <PurchaseModal 
                    product={product} 
                    isOpen={isPurchaseModalOpen}
                    onClose={() => setIsPurchaseModalOpen(false)}
                    initialAccessories={selectedAccessories}
                />
            )}
            
             {isVirtualDesignerOpen && (
                <VirtualDesignerModal
                    product={product}
                    isOpen={isVirtualDesignerOpen}
                    onClose={() => setIsVirtualDesignerOpen(false)}
                />
             )}
            
            {isZoomed && (
                <div 
                    className="fixed inset-0 bg-black/80 z-[200] flex items-center justify-center p-4 cursor-zoom-out" 
                    onClick={() => setIsZoomed(false)}
                >
                    <img 
                        src={mainImage} 
                        alt={`${product.name[language]} - zoomed view`}
                        className="max-w-full max-h-full object-contain"
                    />
                    <button onClick={() => setIsZoomed(false)} className="absolute top-4 right-4 text-white text-4xl" aria-label="Close zoomed image">
                        &times;
                    </button>
                </div>
            )}
        </>
    );
};

export default ProductPage;