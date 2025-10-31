
import React, { useState } from 'react';
import { useLocalization } from '../context/LocalizationContext.tsx';
import { useNotification } from '../context/NotificationContext.tsx';

const ContactPage: React.FC = () => {
    const { t } = useLocalization();
    const { addNotification } = useNotification();
    const [formState, setFormState] = useState({ name: '', email: '', message: '' });
    const [errors, setErrors] = useState({ name: false, email: false, message: false });

    const validate = () => {
        const newErrors = {
            name: !formState.name.trim(),
            email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email),
            message: !formState.message.trim(),
        };
        setErrors(newErrors);
        return !Object.values(newErrors).some(Boolean);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            console.log("Form submitted:", formState);
            addNotification({ message: t('contact_success_message'), type: 'success' });
            setFormState({ name: '', email: '', message: '' });
        }
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="bg-[#F7F5F3]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-[#2C5F5D]">{t('contact_page_title')}</h1>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">{t('contact_intro')}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Contact Info */}
                    <div className="space-y-6 bg-white p-8 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold text-[#D4896C] mb-4">{t('contact_info_title')}</h2>
                        <div className="flex items-start gap-4">
                            <span className="text-2xl mt-1">📍</span>
                            <div>
                                <h3 className="font-semibold text-gray-800">כתובת</h3>
                                <p className="text-gray-600">רחוב הריהוט 123, תל אביב</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <span className="text-2xl mt-1">📞</span>
                            <div>
                                <h3 className="font-semibold text-gray-800">טלפון</h3>
                                <p className="text-gray-600">
                                    <a href="tel:+972501234567" className="hover:text-[#2C5F5D] transition-colors">050-123-4567</a>
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <span className="text-2xl mt-1">✉️</span>
                            <div>
                                <h3 className="font-semibold text-gray-800">{t('contact_email')}</h3>
                                <p className="text-gray-600">
                                    <a href="mailto:info@novatra.co.il" className="hover:text-[#2C5F5D] transition-colors">info@novatra.co.il</a>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold text-[#D4896C] mb-6">{t('contact_form_title')}</h2>
                        <form onSubmit={handleSubmit} noValidate className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">{t('your_name')}</label>
                                <input type="text" name="name" id="name" value={formState.name} onChange={handleChange} className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-[#A8B5A0] ${errors.name ? 'border-red-500' : 'border-gray-300'}`} />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">{t('contact_email')}</label>
                                <input type="email" name="email" id="email" value={formState.email} onChange={handleChange} className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-[#A8B5A0] ${errors.email ? 'border-red-500' : 'border-gray-300'}`} />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700">{t('contact_message')}</label>
                                <textarea name="message" id="message" rows={5} value={formState.message} onChange={handleChange} className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-[#A8B5A0] ${errors.message ? 'border-red-500' : 'border-gray-300'}`}></textarea>
                            </div>
                            <div>
                                <button type="submit" className="w-full bg-[#2C5F5D] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#D4896C] transition-colors duration-300">
                                    {t('contact_send_button')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;