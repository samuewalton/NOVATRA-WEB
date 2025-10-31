import React, { useState, useRef, useEffect } from 'react';
import { useLocalization } from '../context/LocalizationContext.tsx';
import { useCart } from '../context/CartContext.tsx';
import { useRouter } from '../context/RouterContext.tsx';
import { useProducts } from '../context/ProductContext.tsx';
import { useWishlist } from '../context/WishlistContext.tsx';
import { Language } from '../types.ts';
import MenuIcon from './icons/MenuIcon.tsx';
import CartIcon from './icons/CartIcon.tsx';
import CloseIcon from './icons/CloseIcon.tsx';
import SearchIcon from './icons/SearchIcon.tsx';
import CartSidebar from './CartSidebar.tsx';
import ChevronDownIcon from './icons/ChevronDownIcon.tsx';
import MobileMenu from './MobileMenu.tsx';
import HeartIcon from './icons/HeartIcon.tsx';

const Header: React.FC = () => {
    const { language, setLanguage, t } = useLocalization();
    const { cartCount, isCartOpen, setIsCartOpen } = useCart();
    const { wishlistCount } = useWishlist();
    const { navigateTo } = useRouter();
    const { categories } = useProducts();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const categoryMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isSearchOpen) {
            searchInputRef.current?.focus();
        }
    }, [isSearchOpen]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (categoryMenuRef.current && !categoryMenuRef.current.contains(event.target as Node)) {
                setIsCategoryMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const navLinks = [
        { key: 'nav_about', action: () => navigateTo('about') },
        { key: 'nav_contact', action: () => navigateTo('contact') },
    ];

    const handleLanguageChange = (lang: Language) => {
        setLanguage(lang);
    };
    
    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigateTo('home', { search: searchQuery });
        } else {
            navigateTo('home');
        }
        setIsSearchOpen(false);
    };
    
    const handleCategoryClick = (categoryEn: string) => {
        navigateTo('home', { category: categoryEn });
        setIsCategoryMenuOpen(false);
        setIsMobileMenuOpen(false);
    }

    return (
        <>
            <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md shadow-sm z-40">
                <div className="bg-[#2C5F5D] text-white text-center py-2 text-sm font-semibold">
                    {t('free_shipping_banner')}
                </div>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Mobile Menu Toggle */}
                        <div className="lg:hidden">
                            <button onClick={() => setIsMobileMenuOpen(true)} className="text-gray-600" aria-label="Open navigation menu">
                                <MenuIcon className="w-6 h-6" />
                            </button>
                        </div>
                        
                        {/* Logo */}
                        <div className="absolute left-1/2 -translate-x-1/2">
                            <button onClick={() => navigateTo('home')} className="text-center">
                                <span className="text-3xl font-bold text-[#2C5F5D] font-outfit">NOVATRA</span>
                                <span className="block text-xs text-gray-500 font-assistant -mt-1">נובטרה - ריהוט דור הבא</span>
                            </button>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex lg:gap-8 items-center">
                           <div className="relative" ref={categoryMenuRef}>
                                 <button 
                                    onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)} 
                                    className="text-gray-600 hover:text-[#2C5F5D] transition-colors py-2 flex items-center gap-1"
                                 >
                                    {t('nav_products')}
                                    <ChevronDownIcon className={`w-4 h-4 transition-transform ${isCategoryMenuOpen ? 'rotate-180' : ''}`} />
                                 </button>
                                 {isCategoryMenuOpen && (
                                     <div className="absolute top-full ltr:left-0 rtl:right-0 w-48 bg-white shadow-lg rounded-md mt-2 p-2 space-y-1">
                                         {categories.map((category) => (
                                            <button key={category.key} onClick={() => handleCategoryClick(category.key)} className="w-full text-right block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                                                {category.name[language]}
                                            </button>
                                         ))}
                                     </div>
                                 )}
                            </div>
                            {navLinks.map(link => (
                                <button key={link.key} onClick={link.action} className="text-gray-600 hover:text-[#2C5F5D] transition-colors py-2">
                                    {t(link.key)}
                                </button>
                            ))}
                        </nav>

                        {/* Right side icons */}
                        <div className="flex items-center gap-4">
                            {/* Search */}
                             <div className="relative flex items-center">
                                <form
                                    onSubmit={handleSearchSubmit}
                                    className={`absolute ltr:right-8 rtl:left-8 top-1/2 -translate-y-1/2 transition-all duration-300 ease-in-out ${isSearchOpen ? 'w-48 opacity-100' : 'w-0 opacity-0 pointer-events-none'}`}
                                >
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onBlur={() => setIsSearchOpen(false)}
                                        placeholder="Search products..."
                                        className="w-full px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#A8B5A0]"
                                    />
                                </form>
                                <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="text-gray-600 hover:text-[#2C5F5D]" aria-label="Toggle search bar">
                                    <SearchIcon className="w-6 h-6" />
                                </button>
                            </div>
                            
                            {/* Language Selector */}
                            <div className="hidden sm:flex gap-1 text-sm">
                                <button onClick={() => handleLanguageChange(Language.HE)} className={`px-2 py-1 rounded ${language === Language.HE ? 'bg-[#A8B5A0] text-white' : 'hover:bg-gray-100'}`}>HE</button>
                                <button onClick={() => handleLanguageChange(Language.EN)} className={`px-2 py-1 rounded ${language === Language.EN ? 'bg-[#A8B5A0] text-white' : 'hover:bg-gray-100'}`}>EN</button>
                                <button onClick={() => handleLanguageChange(Language.RU)} className={`px-2 py-1 rounded ${language === Language.RU ? 'bg-[#A8B5A0] text-white' : 'hover:bg-gray-100'}`}>RU</button>
                            </div>

                            {/* Wishlist Icon */}
                            <button onClick={() => navigateTo('wishlist')} className="relative text-gray-600 hover:text-[#2C5F5D]" aria-label="View wishlist">
                                <HeartIcon className="w-7 h-7" />
                                {wishlistCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-[#D4896C] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                        {wishlistCount}
                                    </span>
                                )}
                            </button>

                            {/* Cart Icon */}
                            <button onClick={() => setIsCartOpen(!isCartOpen)} className="relative text-gray-600 hover:text-[#2C5F5D]" aria-label="Open shopping cart">
                                <CartIcon className="w-7 h-7" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-[#D4896C] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </header>
            <MobileMenu 
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                onCategoryClick={handleCategoryClick}
                navLinks={navLinks}
            />
            <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </>
    );
};

export default Header;