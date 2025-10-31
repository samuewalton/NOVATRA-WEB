

import React, { useState } from 'react';
import { useReviews } from '../context/ReviewContext.tsx';
import StarRating from './StarRating.tsx';
import { useLocalization } from '../context/LocalizationContext.tsx';
import { useNotification } from '../context/NotificationContext.tsx';
import { summarizeReviews } from '../services/geminiService.ts';
import StarIcon from './icons/StarIcon.tsx';
import SparklesIcon from './icons/SparklesIcon.tsx';
import CloseIcon from './icons/CloseIcon.tsx';

interface ProductReviewsProps {
    productId: string;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId }) => {
    const { getReviewsForProduct, getProductAverageRating, addReview } = useReviews();
    const { t } = useLocalization();
    const { addNotification } = useNotification();
    const reviews = getReviewsForProduct(productId);
    const { average, count } = getProductAverageRating(productId);

    const [newRating, setNewRating] = useState(5);
    const [newAuthor, setNewAuthor] = useState('');
    const [newTitle, setNewTitle] = useState('');
    const [newComment, setNewComment] = useState('');
    const [errors, setErrors] = useState<{ author?: string; title?: string; comment?: string }>({});

    const [summary, setSummary] = useState<{ pros: string[], cons: string[] } | null>(null);
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [summaryError, setSummaryError] = useState<string | null>(null);

    const handleSummarize = async () => {
        setIsSummarizing(true);
        setSummaryError(null);
        setSummary(null);
        try {
            const result = await summarizeReviews(reviews);
            setSummary(result);
        } catch (error) {
            setSummaryError(t('summary_error'));
        } finally {
            setIsSummarizing(false);
        }
    };


    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('he-IL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };
    
    const validateForm = () => {
        const newErrors: typeof errors = {};
        if (!newAuthor.trim()) newErrors.author = t('validation_required');
        if (!newTitle.trim()) newErrors.title = t('validation_required');
        if (!newComment.trim()) newErrors.comment = t('validation_required');
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleReviewSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            addReview({
                productId,
                author: newAuthor,
                rating: newRating,
                title: newTitle,
                comment: newComment,
            });
            setNewRating(5);
            setNewAuthor('');
            setNewTitle('');
            setNewComment('');
            addNotification({ message: t('review_submitted_thanks'), type: 'success' });
        }
    };

    const InputStarRating: React.FC<{ rating: number, setRating: (r: number) => void }> = ({ rating, setRating }) => (
        <div className="flex">
            {[1, 2, 3, 4, 5].map(star => (
                <button key={star} type="button" onClick={() => setRating(star)} onMouseOver={() => setRating(star)}>
                    <StarIcon className={`w-6 h-6 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`} />
                </button>
            ))}
        </div>
    );
    
    const FormField: React.FC<{ name: 'author' | 'title' | 'comment', label: string, value: string, onChange: (val: string) => void, isTextarea?: boolean }> = ({ name, label, value, onChange, isTextarea }) => (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
            {isTextarea ? (
                <textarea
                    id={name}
                    name={name}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    rows={4}
                    className={`mt-1 block w-full px-3 py-2 border ${errors[name] ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-[#A8B5A0] focus:border-[#A8B5A0] sm:text-sm`}
                />
            ) : (
                <input
                    type="text"
                    id={name}
                    name={name}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    className={`mt-1 block w-full px-3 py-2 border ${errors[name] ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-[#A8B5A0] focus:border-[#A8B5A0] sm:text-sm`}
                />
            )}
            {errors[name] && <p className="mt-1 text-xs text-red-500">{errors[name]}</p>}
        </div>
    );


    return (
        <section className="py-12 mt-12 border-t">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2">
                        <h2 className="text-3xl font-bold text-[#2C5F5D] mb-6">{t('reviews_title')}</h2>
                        
                        {reviews.length >= 2 && (
                            <div className="mb-8">
                                <button
                                    onClick={handleSummarize}
                                    disabled={isSummarizing}
                                    className="w-full flex items-center justify-center gap-2 bg-[#A8B5A0] text-white py-3 px-6 rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    <SparklesIcon className="w-6 h-6" />
                                    {isSummarizing ? t('summarizing_loading') : t('summarize_reviews')}
                                </button>
                            </div>
                        )}

                        {isSummarizing && (
                            <div className="p-4 bg-gray-50 rounded-lg mb-8 animate-pulse">
                                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                            </div>
                        )}
                        {summaryError && (
                            <div className="p-4 bg-red-100 text-red-700 rounded-lg mb-8">
                                {summaryError}
                            </div>
                        )}
                        {summary && (
                            <div className="p-6 bg-[#F7F5F3] rounded-lg mb-8 border border-gray-200 relative animate-fade-in">
                                <button onClick={() => setSummary(null)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
                                    <CloseIcon className="w-5 h-5" />
                                </button>
                                <h3 className="text-xl font-semibold text-[#2C5F5D] mb-4">{t('ai_summary_title')}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                    <div>
                                        <h4 className="font-bold text-green-700 mb-2">{t('summary_pros')}</h4>
                                        <ul className="list-disc list-inside space-y-1 text-gray-800">
                                            {summary.pros.map((pro, i) => <li key={`pro-${i}`}>{pro}</li>)}
                                            {summary.pros.length === 0 && <li>לא צוינו יתרונות משמעותיים.</li>}
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-red-600 mb-2">{t('summary_cons')}</h4>
                                        <ul className="list-disc list-inside space-y-1 text-gray-800">
                                            {summary.cons.map((con, i) => <li key={`con-${i}`}>{con}</li>)}
                                            {summary.cons.length === 0 && <li>לא צוינו חסרונות משמעותיים.</li>}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        {count > 0 && (
                            <div className="flex items-center gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="text-4xl font-bold text-gray-800">{average.toFixed(1)}</p>
                                    <p className="text-sm text-gray-500">{t('based_on_reviews').replace('{count}', String(count))}</p>
                                </div>
                                <StarRating rating={average} />
                            </div>
                        )}
                        
                        <div className="space-y-8">
                            {reviews.length > 0 ? (
                                reviews.map(review => (
                                    <div key={review.id} className="border-b pb-6">
                                        <div className="flex items-center mb-2">
                                            <StarRating rating={review.rating} />
                                            <p className="ltr:ml-2 rtl:mr-2 font-bold text-gray-800">{review.title}</p>
                                        </div>
                                        <p className="text-gray-600 mb-2">{review.comment}</p>
                                        <p className="text-sm text-gray-400">
                                            {review.author}, {formatDate(review.date)}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">{t('be_the_first_review')}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <div className="bg-gray-50 p-6 rounded-lg shadow-sm sticky top-28">
                            <h3 className="text-xl font-semibold mb-4 text-[#2C5F5D]">{t('review_form_title')}</h3>
                            <form onSubmit={handleReviewSubmit} noValidate className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">הדירוג שלך</label>
                                    <InputStarRating rating={newRating} setRating={setNewRating} />
                                </div>
                                <FormField name="author" label={t('your_name')} value={newAuthor} onChange={setNewAuthor} />
                                <FormField name="title" label={t('review_title')} value={newTitle} onChange={setNewTitle} />
                                <FormField name="comment" label={t('your_review')} value={newComment} onChange={setNewComment} isTextarea />
                                
                                <button type="submit" className="w-full bg-[#D4896C] text-white py-2.5 px-4 rounded-md font-semibold hover:bg-opacity-90 transition-colors">
                                    {t('submit_review')}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProductReviews;