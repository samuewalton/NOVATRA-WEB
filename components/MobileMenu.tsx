import React, { useRef, useEffect } from 'react';
import { useLocalization } from '../context/LocalizationContext.tsx';
import { useProducts } from '../context/ProductContext.tsx';
import CloseIcon from './icons/CloseIcon.tsx';
import type { CategoryInfo } from '../types.ts';

interface NavLink {
    key: string;
    action: () => void;
}

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    onCategoryClick: (categoryEn: string) => void;
    navLinks: NavLink[];
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, onCategoryClick, navLinks }) => {
    const { t, language } = useLocalization();
    const { categories } = useProducts();
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            const menuElement = menuRef.current;
            if (!menuElement) return;

            const focusableElements = menuElement.querySelectorAll<HTMLElement>(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            const handleTabKeyPress = (e: KeyboardEvent) => {
                if (e.key !== 'Tab') return;

                if (e.shiftKey) { // Shift + Tab
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement?.focus();
                    }
                } else { // Tab
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement?.focus();
                    }
                }
            };
            
            firstElement?.focus();
            menuElement.addEventListener('keydown', handleTabKeyPress);

            return () => {
                menuElement.removeEventListener('keydown', handleTabKeyPress);
            };
        }
    }, [isOpen]);

    const handleCategoryClick = (categoryEn: string) => {
        onCategoryClick(categoryEn);
        // The onClose call is now handled inside onCategoryClick in the Header
    };

    const handleNavLinkClick = (action: () => void) => {
        action();
        onClose();
    }

    return (
        <>
            {/* Backdrop */}
            <div 
                className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
                onClick={onClose}
            ></div>

            {/* Menu Panel */}
            <div 
                ref={menuRef}
                className={`fixed top-0 ${language === 'he' ? 'right-0' : 'left-0'} h-full w-full max-w-sm bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : (language === 'he' ? 'translate-x-full' : '-translate-x-full')}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="mobile-menu-title"
            >
                <div className="relative h-full flex flex-col bg-cover bg-center" style={{ backgroundImage: "url('https://picsum.photos/id/30/800/1200')"}}>
                    <div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>
                    
                    <div className="relative flex justify-between items-center p-4 border-b border-white/20">
                        <h2 id="mobile-menu-title" className="text-xl font-bold text-gray-800">{t('categories_title')}</h2>
                        <button onClick={onClose} className="text-gray-800 hover:text-black" aria-label="Close menu">
                            <CloseIcon className="w-6 h-6" />
                        </button>
                    </div>

                    <nav className="relative flex-1 p-8 overflow-y-auto">
                        <ul className="space-y-4">
                            {categories.map((category) => (
                                <li key={category.key}>
                                    <button 
                                        onClick={() => handleCategoryClick(category.key)} 
                                        className="group w-full text-right rtl:text-left p-2 text-lg font-bold text-gray-800 bg-white/80 rounded-lg shadow-md hover:bg-white transition-all duration-200 flex items-center gap-4 overflow-hidden"
                                    >
                                        <img src={category.image} alt={category.name[language]} className="w-16 h-16 object-cover rounded-md flex-shrink-0 group-hover:scale-110 transition-transform duration-300" loading="lazy" />
                                        <span className="flex-1">{category.name[language]}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <hr className="my-8 border-white/30" />
                        <ul className="space-y-4">
                             {navLinks.map(link => (
                                <li key={link.key}>
                                    <button 
                                        onClick={() => handleNavLinkClick(link.action)} 
                                        className="w-full text-center p-4 text-lg font-bold text-[#2C5F5D] bg-white/80 rounded-lg shadow-md hover:bg-white transition-all duration-200"
                                    >
                                        {t(link.key)}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>
        </>
    );
};

export default MobileMenu;