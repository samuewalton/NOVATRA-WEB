import React, { useState } from 'react';
import { useLocalization } from '../context/LocalizationContext.tsx';
import { useNotification } from '../context/NotificationContext.tsx';
import { useRouter } from '../context/RouterContext.tsx';
import type { Route } from '../context/RouterContext.tsx';


const Footer: React.FC = () => {
    const { t } = useLocalization();
    const { addNotification } = useNotification();
    const { navigateTo } = useRouter();
    const [email, setEmail] = useState('');

    const footerLinks: { key: string, route: Route }[] = [
        { key: 'footer_about', route: 'about' },
        { key: 'footer_contact', route: 'contact' },
        { key: 'footer_shipping', route: 'shipping' },
        { key: 'footer_returns', route: 'returns' }
    ];

    const socialIcons = [
        <svg key="fb" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>,
        <svg key="ig" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.012 3.584-.07 4.85c-.148 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.85s.012-3.584.07-4.85c.149-3.225 1.664-4.771 4.919-4.919C8.416 2.175 8.796 2.163 12 2.163zm0 1.441c-3.171 0-3.535.012-4.782.069-2.734.125-3.958 1.349-4.083 4.083-.057 1.247-.069 1.611-.069 4.782s.012 3.535.069 4.782c.125 2.734 1.349 3.958 4.083 4.083 1.247.057 1.611.069 4.782.069s3.535-.012 4.782-.069c2.734-.125 3.958-1.349 4.083-4.083.057-1.247.069-1.611-.069-4.782s-.012-3.535-.069-4.782c-.125-2.734-1.349-3.958-4.083-4.083-1.247-.057-1.611-.069-4.782-.069zM12 6.873c-2.849 0-5.127 2.278-5.127 5.127s2.278 5.127 5.127 5.127 5.127-2.278 5.127-5.127-2.278-5.127-5.127-5.127zm0 8.812c-2.039 0-3.685-1.646-3.685-3.685s1.646-3.685 3.685-3.685 3.685 1.646 3.685 3.685-1.646 3.685-3.685 3.685zm6.406-9.663c-.755 0-1.367.612-1.367 1.367s.612 1.367 1.367 1.367 1.367-.612 1.367-1.367-.612-1.367-1.367-1.367z"/></svg>
    ];
    
    const handleNewsletterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(email)) {
            console.log('Newsletter signup:', email);
            addNotification({ message: t('newsletter_success'), type: 'success' });
            setEmail('');
        } else {
            addNotification({ message: t('newsletter_invalid_email'), type: 'error' });
        }
    };

    return (
        <footer className="bg-[#2C5F5D] text-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
                    {/* Column 1-4: Links */}
                    {footerLinks.map(link => (
                        <button key={link.key} onClick={() => navigateTo(link.route)} className="hover:text-[#E8D5C4] transition-colors text-right rtl:text-right">{t(link.key)}</button>
                    ))}
                    {/* Column 5: Social */}
                    <div>
                        <h4 className="font-bold mb-2">{t('footer_follow')}</h4>
                        <div className="flex gap-4">
                            {socialIcons.map((icon, index) => <a key={index} href="#" className="hover:text-[#E8D5C4] transition-colors">{icon}</a>)}
                        </div>
                    </div>
                </div>

                {/* Newsletter Section */}
                <div className="border-t border-teal-500 pt-8 mb-8">
                    <div className="max-w-xl mx-auto text-center">
                        <h3 className="font-bold text-lg mb-2">{t('newsletter_title')}</h3>
                        <p className="text-teal-200 mb-4">{t('newsletter_subtitle')}</p>
                        <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2" noValidate>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={t('newsletter_placeholder')}
                                className="flex-grow p-3 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#E8D5C4]"
                                required
                            />
                            <button type="submit" className="bg-[#D4896C] px-6 py-3 rounded-md font-bold hover:bg-opacity-90 transition-colors">
                                {t('newsletter_button')}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-teal-500 pt-8 mb-8">
                    <div className="flex gap-4 justify-center items-center">
                        <span className="text-sm">אמצעי תשלום:</span>
                        <svg className="h-6" viewBox="0 0 78 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M57.85 2.11H52.1l-6.32 19.78h6.42l1.1-3.62h5.2l.66 3.62h6.04L57.85 2.11ZM53.4 15.28l2.2-6.86 2.2 6.86h-4.4Z" fill="#fff"></path><path d="M78 12c0-3.66-2.02-6.53-5.32-6.53-2.38 0-4.04 1.7-4.04 3.73 0 .7.18 1.18.52 1.6l-3.3 8.09h6.5l2.6-6.38c.8 0 1.28.32 1.7.9L78 12Zm-7.65-1.12c0-1.1.7-1.8 1.6-1.8.84 0 1.4.63 1.4 1.62 0 1.03-.6 1.63-1.47 1.63-.82 0-1.53-.6-1.53-1.45Z" fill="#fff"></path><path d="M37.15 5.58c-2.48 0-4.7 1.5-4.7 4.1 0 1.95 1.25 3.1 2.8 3.78 1.5.7 2.03 1.2 2.03 1.8 0 .85-.88 1.3-1.93 1.3-1.43 0-2.28-.4-2.88-.68l-.5-2.73h-5.65c.1 4.45 3.3 6.3 6.55 6.3 2.95 0 5.2-1.6 5.2-4.23 0-2.3-1.5-3.3-3.1-4-1.3-.6-2.1-.9-2.1-1.65 0-.58.5-1.15 1.6-1.15 1 0 1.6.3 2.1.5l.4 2.2h5.5c-.4-4.2-3.1-5.7-6.1-5.7Z" fill="#fff"></path><path d="M22.06 21.89h6.1V8.5H32.4v-3h-14v3h4.26v13.39Z" fill="#fff"></path><path d="m11.18 2.2-5.4 19.7h6.2l1-3.6h5.2l1.6 3.6h6.1L15.78 2.2h-4.6Zm-.9 13.2 2.2-6.8 2.2 6.8h-4.4Z" fill="#fff"></path></svg>
                        <svg className="h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.1519 12C10.1519 14.1217 11.8783 15.8481 14 15.8481C16.1217 15.8481 17.8481 14.1217 17.8481 12C17.8481 9.87829 16.1217 8.1519 14 8.1519C11.8783 8.1519 10.1519 9.87829 10.1519 12Z" fill="#fff"></path><path d="M14 0C6.26801 0 0 6.26801 0 14C0 21.732 6.26801 28 14 28C21.732 28 28 21.732 28 14C28 6.26801 21.732 0 14 0ZM14 19.6962C10.849 19.6962 8.30383 17.151 8.30383 14C8.30383 10.849 10.849 8.30383 14 8.30383C17.151 8.30383 19.6962 10.849 19.6962 14C19.6962 17.151 17.151 19.6962 14 19.6962Z" fill="#FF5F00"></path></svg>
                        <svg className="h-6" viewBox="0 0 78 24" xmlns="http://www.w3.org/2000/svg"><path fill="#003087" d="M48.91 21.84h6.03l-6.52-16.1h-6.22l-6.53 16.1h6.2l1.1-2.77h5.13l.71 2.77zM45.6 16.4l2.1-5.4 2.1 5.4h-4.2z"/><path fill="#003087" d="M69.75 8.5h-5.1c-.5 0-.82.3-.92.83l-2.6 10.82c-.2.8-.52 1.1-1.21 1.1h-2.1c-.5 0-.8-.3-.7-.94l3.5-14.3c.2-.82.5-1.12 1.2-1.12h4.5c2.4 0 3.9.7 4.5 3.1.4 1.4-.1 2.8-1.1 3.5z"/><path fill="#003087" d="M72.58 8.44c.4-1.22 1.5-1.8 2.9-1.8 1 0 1.6.4 1.9.9.3.5.2 1-.1 1.8l-2.2 6.5c-.3 1-.8 1.4-1.6 1.4h-1.8c-.8 0-1.2-.4-1.1-1.3l2-7.5z"/><path fill="#009cde" d="M30.4 11.23c0-1.8-1-2.9-2.9-2.9h-4.6c-.9 0-1.4.5-1.5 1.3l-3.3 12.24h6.2l.6-2.5h2.9l.5 2.5h5.9l-2.7-12.14zm-4.6 4.7h-2.1l1-4.7h2.1l-1 4.7z"/><path fill="#009cde" d="M2.57 21.84h6.2l3.8-12.82c.2-.8.5-1.1 1.2-1.1h2.1c.5 0 .8.3.7.94l-3.5 14.3c-.2.8-.5 1.1-1.2 1.1h-4.5c-2.4 0-3.9-.7-4.5-3.1-.4-1.4.1-2.8 1.1-3.5l-1.6 4.1z"/><path fill="#009cde" d="M12.3 8.34c.4-1.2 1.5-1.8 2.9-1.8 1 0 1.6.4 1.9.9.3.5.2 1-.1 1.8l-2.2 6.5c-.3 1-.8 1.4-1.6 1.4H11.4c-.8 0-1.2-.4-1.1-1.3l2-7.5z"/></svg>
                        <svg className="h-6" viewBox="0 0 1024 1024" fill="#6441a5" xmlns="http://www.w3.org/2000/svg"><path d="M512 0c-282.77 0-512 229.23-512 512s229.23 512 512 512c282.77 0 512-229.23 512-512S794.77 0 512 0z m243.2 590.4l-113.6 109.6c-9.6 9.6-22.4 14.4-38.4 14.4-12.8 0-25.6-4.8-35.2-12.8L448 600.8c-12.8-11.2-28.8-16.8-44.8-16.8-16.8 0-32.8 6.4-44.8 16.8l-120 100.8c-9.6 8-22.4 12.8-35.2 12.8-16 0-28.8-4.8-38.4-14.4l-112-108c-12.8-12.8-19.2-28.8-19.2-46.4 0-19.2 6.4-36.8 19.2-51.2l112-108c9.6-9.6 22.4-14.4 38.4-14.4 12.8 0 25.6 4.8 35.2 12.8l120 100.8c12.8 11.2 28.8 16.8 44.8 16.8 16.8 0 32.8-6.4 44.8-16.8l120-100.8c9.6-8 22.4-12.8 35.2-12.8 16 0 28.8 4.8 38.4 14.4l112 108c12.8 12.8 19.2 28.8 19.2 46.4 0.8 19.2-5.6 36.8-18.4 51.2z"/></svg>
                    </div>
                </div>
                
                {/* Instagram Feed Placeholder */}
                <div className="border-t border-teal-500 pt-8">
                    <h3 className="text-center font-bold text-lg mb-4">#NOVATRAfamily</h3>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                        <div className="aspect-square bg-teal-600 rounded-md overflow-hidden"><img src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=200&auto=format&fit=crop" className="w-full h-full object-cover" alt="customer photo 1" loading="lazy" /></div>
                        <div className="aspect-square bg-teal-600 rounded-md overflow-hidden"><img src="https://images.unsplash.com/photo-1519642918688-7e43b19245d8?q=80&w=200&auto=format&fit=crop" className="w-full h-full object-cover" alt="customer photo 2" loading="lazy" /></div>
                        <div className="aspect-square bg-teal-600 rounded-md overflow-hidden"><img src="https://images.unsplash.com/photo-1604329249405-395aaa427544?q=80&w=200&auto=format&fit=crop" className="w-full h-full object-cover" alt="customer photo 3" loading="lazy" /></div>
                        <div className="aspect-square bg-teal-600 rounded-md overflow-hidden"><img src="https://images.unsplash.com/photo-1599684364239-6016d4d12c9b?q=80&w=200&auto=format&fit=crop" className="w-full h-full object-cover" alt="customer photo 4" loading="lazy" /></div>
                        <div className="aspect-square bg-teal-600 rounded-md overflow-hidden"><img src="https://images.unsplash.com/photo-1622906199990-27c49e295326?q=80&w=200&auto=format&fit=crop" className="w-full h-full object-cover" alt="customer photo 5" loading="lazy" /></div>
                        <div className="aspect-square bg-teal-600 rounded-md overflow-hidden"><img src="https://images.unsplash.com/photo-1593813353434-29729a43a759?q=80&w=200&auto=format&fit=crop" className="w-full h-full object-cover" alt="customer photo 6" loading="lazy" /></div>
                    </div>
                </div>
            </div>
            <div className="bg-teal-800 py-4 text-center text-sm text-teal-300">
                {t('footer_rights')}
            </div>
        </footer>
    );
};

export default Footer;