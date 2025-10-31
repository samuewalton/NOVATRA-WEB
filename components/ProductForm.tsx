import React, { useState, useEffect } from 'react';
import { useRouter } from '../context/RouterContext.tsx';
import { useProducts } from '../context/ProductContext.tsx';
import { useNotification } from '../context/NotificationContext.tsx';
import type { Product, LocalizedString, Price } from '../types.ts';
import { Language } from '../types.ts';

const emptyProduct: Omit<Product, 'id' | 'averageRating' | 'reviewCount'> & { id?: string } = {
    id: undefined,
    sku: '',
    name: { he: '', en: '', ru: '' },
    subtitle: { he: '', en: '', ru: '' },
    description: { he: '', en: '', ru: '' },
    category: { he: '', en: '', ru: '' },
    collection: { he: '', en: '', ru: '' },
    brand: { he: 'Veres', en: 'Veres', ru: 'Veres' },
    dimensions: { he: '', en: '', ru: '' },
    images: [''],
    colors: [],
    price: { ils: 0, usd: 0, eur: 0 },
    accessories: [],
    similarProductIds: [],
    inStock: true,
};

interface ProductFormProps {
    productId?: string;
}

const Tab: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button
        type="button"
        onClick={onClick}
        className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
            active ? 'bg-white text-[#2C5F5D] border-gray-200 border-b-0' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
        }`}
    >
        {children}
    </button>
);


const LocalizedInput: React.FC<{ label: string; field: keyof Omit<Product, 'price' | 'colors' | 'accessories' | 'images' | 'inStock' | 'id'>; value: LocalizedString; onChange: (field: any, lang: Language, text: string) => void; isTextarea?: boolean; }> = ({ label, field, value, onChange, isTextarea }) => {
    const [activeLang, setActiveLang] = useState(Language.HE);
    
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
            <div className="flex border-b border-gray-200 -mb-px">
                {Object.values(Language).map(lang => (
                    <Tab key={lang} active={activeLang === lang} onClick={() => setActiveLang(lang)}>
                        {lang.toUpperCase()}
                    </Tab>
                ))}
            </div>
            <div className="border border-gray-200 rounded-b-md p-4 bg-white">
                {isTextarea ? (
                    <textarea placeholder={`${label} (${activeLang.toUpperCase()})`} value={value[activeLang]} onChange={(e) => onChange(field, activeLang, e.target.value)} rows={4} className="w-full p-2 border rounded-md" />
                ) : (
                    <input type="text" placeholder={`${label} (${activeLang.toUpperCase()})`} value={value[activeLang]} onChange={(e) => onChange(field, activeLang, e.target.value)} className="w-full p-2 border rounded-md" />
                )}
            </div>
        </div>
    );
};

const ProductForm: React.FC<ProductFormProps> = ({ productId }) => {
    const { navigateTo } = useRouter();
    const { getProductById, addProduct, updateProduct } = useProducts();
    const { addNotification } = useNotification();
    const [product, setProduct] = useState<Omit<Product, 'id' | 'averageRating' | 'reviewCount'> & { id?: string }>(emptyProduct);
    const isEditing = productId !== 'new';
    
    useEffect(() => {
        if (isEditing && productId) {
            const existingProduct = getProductById(productId);
            if (existingProduct) {
                setProduct(existingProduct);
            }
        } else {
            setProduct(emptyProduct);
        }
    }, [isEditing, productId, getProductById]);

    const handleLocalizedChange = (field: keyof Omit<Product, 'price' | 'colors' | 'accessories' | 'images' | 'inStock' | 'id'>, lang: Language, text: string) => {
        setProduct(prev => ({ ...prev, [field]: { ...prev[field], [lang]: text } }));
    };

    const handlePriceChange = (currency: keyof Price, value: string) => {
        setProduct(prev => ({ ...prev, price: { ...prev.price, [currency]: Number(value) || 0 } }));
    };

    const handleImageChange = (index: number, value: string) => {
        const newImages = [...product.images];
        newImages[index] = value;
        setProduct(prev => ({ ...prev, images: newImages }));
    };

    const addImageField = () => {
        setProduct(prev => ({ ...prev, images: [...prev.images, ''] }));
    };

    const removeImageField = (index: number) => {
        if (product.images.length > 1) {
            const newImages = product.images.filter((_, i) => i !== index);
            setProduct(prev => ({ ...prev, images: newImages }));
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Basic validation
        if (!product.sku || !product.name.he || !product.name.en || product.price.ils <= 0 || !product.images[0]) {
            addNotification({ message: 'נא למלא את כל שדות החובה (מק"ט, שם, מחיר, תמונה ראשית).', type: 'error' });
            return;
        }

        if (isEditing) {
            updateProduct(product as Product);
            addNotification({ message: 'המוצר עודכן בהצלחה!', type: 'success' });
        } else {
            addProduct(product);
            addNotification({ message: 'המוצר נוסף בהצלחה!', type: 'success' });
        }
        navigateTo('admin');
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                         <h1 className="text-2xl font-bold text-[#2C5F5D]">{isEditing ? 'עריכת מוצר' : 'הוספת מוצר חדש'}</h1>
                         <button type="button" onClick={() => navigateTo('admin')} className="text-sm text-gray-600 hover:underline bg-gray-100 px-4 py-2 rounded-md">חזור לרשימה</button>
                    </div>
                </div>
            </header>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">מק"ט (SKU)</label>
                            <input type="text" value={product.sku} onChange={(e) => setProduct(p => ({...p, sku: e.target.value}))} required className="w-full p-2 border rounded-md mt-1" />
                             <p className="text-xs text-gray-500 mt-1">גייד: מזהה ייחודי למוצר, לדוגמה: VRS-MNC-CB-120.</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">זמינות במלאי</label>
                            <select value={String(product.inStock)} onChange={(e) => setProduct(p => ({...p, inStock: e.target.value === 'true'}))} className="w-full p-2 border rounded-md mt-1">
                                <option value="true">במלאי</option>
                                <option value="false">אזל מהמלאי</option>
                            </select>
                        </div>
                    </div>
                    
                    <LocalizedInput label="שם המוצר" field="name" value={product.name} onChange={handleLocalizedChange} />
                    <LocalizedInput label="כותרת משנה" field="subtitle" value={product.subtitle} onChange={handleLocalizedChange} />
                    <LocalizedInput label="תיאור" field="description" value={product.description} onChange={handleLocalizedChange} isTextarea />
                    <LocalizedInput label="קטגוריה" field="category" value={product.category} onChange={handleLocalizedChange} />
                    <LocalizedInput label="קולקציה" field="collection" value={product.collection} onChange={handleLocalizedChange} />

                    <div>
                        <label className="block text-sm font-medium text-gray-700">תמונות</label>
                         <p className="text-xs text-gray-500 mt-1 mb-2">המלצה: הדביקו קישורים לתמונות איכותיות. הקישור הראשון ישמש כתמונה ראשית.</p>
                        {product.images.map((url, index) => (
                             <div key={index} className="flex items-center gap-2 mb-2">
                                <input type="url" placeholder="https://example.com/image.jpg" value={url} onChange={(e) => handleImageChange(index, e.target.value)} required={index === 0} className="w-full p-2 border rounded-md" />
                                <button type="button" onClick={() => removeImageField(index)} disabled={product.images.length <= 1} className="p-2 bg-red-500 text-white rounded-md disabled:bg-gray-300">-</button>
                            </div>
                        ))}
                        <button type="button" onClick={addImageField} className="text-sm text-indigo-600 hover:underline">+ הוסף תמונה</button>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">מחירים</label>
                        <div className="grid grid-cols-3 gap-4 mt-1">
                             <input type="number" placeholder="ILS" value={product.price.ils} onChange={e => handlePriceChange('ils', e.target.value)} required className="p-2 border rounded-md" />
                             <input type="number" placeholder="USD" value={product.price.usd} onChange={e => handlePriceChange('usd', e.target.value)} className="p-2 border rounded-md" />
                             <input type="number" placeholder="EUR" value={product.price.eur} onChange={e => handlePriceChange('eur', e.target.value)} className="p-2 border rounded-md" />
                        </div>
                    </div>

                    <div className="border-t pt-6 flex justify-end gap-4">
                        <button type="button" onClick={() => navigateTo('admin')} className="bg-gray-200 text-gray-700 py-2 px-6 rounded-md font-semibold hover:bg-gray-300">ביטול</button>
                        <button type="submit" className="bg-[#2C5F5D] text-white py-2 px-6 rounded-md font-semibold hover:bg-[#D4896C] transition-colors">
                            {isEditing ? 'שמור שינויים' : 'הוסף מוצר'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductForm;