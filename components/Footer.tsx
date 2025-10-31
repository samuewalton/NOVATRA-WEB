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
                    <div className="flex gap-6 justify-center items-center flex-wrap">
                        <span className="text-sm">אמצעי תשלום:</span>
                        <img src="/images/payment/visa.svg" alt="Visa" className="h-8" loading="lazy" />
                        <img src="/images/payment/mastercard.svg" alt="Mastercard" className="h-8" loading="lazy" />
                        <img src="/images/payment/paypal.svg" alt="PayPal" className="h-8" loading="lazy" />
                        <img src="/images/payment/bit.svg" alt="Bit" className="h-8" loading="lazy" />
                    </div>
                </div>

                {/* Instagram Feed Placeholder */}
                <div className="border-t border-teal-500 pt-8">
                    <h3 className="text-center font-bold text-lg mb-4">#NOVATRAfamily</h3>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                        <div className="aspect-square bg-teal-600 rounded-md overflow-hidden"><img src="/images/family/family-1.jpg" className="w-full h-full object-cover" alt="NOVATRA family 1" loading="lazy" /></div>
                        <div className="aspect-square bg-teal-600 rounded-md overflow-hidden"><img src="/images/family/family-2.jpg" className="w-full h-full object-cover" alt="NOVATRA family 2" loading="lazy" /></div>
                        <div className="aspect-square bg-teal-600 rounded-md overflow-hidden"><img src="/images/family/family-3.jpg" className="w-full h-full object-cover" alt="NOVATRA family 3" loading="lazy" /></div>
                        <div className="aspect-square bg-teal-600 rounded-md overflow-hidden"><img src="/images/family/family-4.jpg" className="w-full h-full object-cover" alt="NOVATRA family 4" loading="lazy" /></div>
                        <div className="aspect-square bg-teal-600 rounded-md overflow-hidden"><img src="/images/family/family-5.jpg" className="w-full h-full object-cover" alt="NOVATRA family 5" loading="lazy" /></div>
                        <div className="aspect-square bg-teal-600 rounded-md overflow-hidden"><img src="/images/family/family-6.jpg" className="w-full h-full object-cover" alt="NOVATRA family 6" loading="lazy" /></div>
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