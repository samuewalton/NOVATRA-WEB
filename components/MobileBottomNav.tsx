

import React from 'react';
import { useRouter } from '../context/RouterContext.tsx';
import { useCart } from '../context/CartContext.tsx';
import { useWishlist } from '../context/WishlistContext.tsx';
import HomeIcon from './icons/HomeIcon.tsx';
import GridIcon from './icons/GridIcon.tsx';
import SearchIcon from './icons/SearchIcon.tsx';
import CartIcon from './icons/CartIcon.tsx';
import HeartIcon from './icons/HeartIcon.tsx';

const MobileBottomNav: React.FC = () => {
    const { navigateTo, route } = useRouter();
    const { cartCount } = useCart();
    const { wishlistCount } = useWishlist();
    
    const navItems = [
        { name: 'Home', icon: HomeIcon, path: 'home' },
        { name: 'Catalog', icon: GridIcon, path: 'catalog' },
        { name: 'Search', icon: SearchIcon, path: 'home' }, // Navigates to home for search bar access
        { name: 'Wishlist', icon: HeartIcon, path: 'wishlist', badge: wishlistCount },
        { name: 'Cart', icon: CartIcon, path: 'checkout', badge: cartCount },
    ];

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md shadow-[0_-2px_5px_rgba(0,0,0,0.05)] z-30">
            <div className="flex justify-around items-center h-16">
                {navItems.map(item => (
                    <button
                        key={item.name}
                        onClick={() => navigateTo(item.path as any)}
                        className={`flex flex-col items-center justify-center w-full h-full relative transition-colors ${route === item.path ? 'text-[#2C5F5D]' : 'text-gray-500 hover:text-gray-800'}`}
                    >
                        <item.icon className="w-6 h-6" />
                        <span className="text-xs mt-1">{item.name}</span>
                        {item.badge !== undefined && item.badge > 0 && (
                             <span className="absolute top-1 right-1/2 translate-x-3 bg-[#D4896C] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                                {item.badge}
                            </span>
                        )}
                    </button>
                ))}
            </div>
        </nav>
    );
};

export default MobileBottomNav;