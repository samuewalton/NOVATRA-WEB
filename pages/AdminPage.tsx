import React from 'react';
import { useProducts } from '../context/ProductContext.tsx';
import { useRouter } from '../context/RouterContext.tsx';
import { useLocalization } from '../context/LocalizationContext.tsx';
import PlusIcon from '../components/icons/PlusIcon.tsx';
import EditIcon from '../components/icons/EditIcon.tsx';
import TrashIcon from '../components/icons/TrashIcon.tsx';

const AdminPage: React.FC = () => {
    const { products, deleteProduct } = useProducts();
    const { navigateTo } = useRouter();
    const { language } = useLocalization();

    const handleDelete = (productId: string, productName: string) => {
        if (window.confirm(`האם אתה בטוח שברצונך למחוק את המוצר "${productName}"? לא ניתן לשחזר פעולה זו.`)) {
            deleteProduct(productId);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-[#2C5F5D]">ניהול מוצרים</h1>
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigateTo('home')} className="text-sm text-gray-600 hover:underline">חזור לאתר</button>
                        <button
                            onClick={() => navigateTo('admin-edit', { productId: 'new' })}
                            className="flex items-center gap-2 bg-[#2C5F5D] text-white py-2 px-4 rounded-md font-semibold hover:bg-[#D4896C] transition-colors"
                        >
                            <PlusIcon className="w-5 h-5" />
                            הוסף מוצר חדש
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">תמונה</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">שם מוצר</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">מק"ט</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">פעולות</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {products.map(product => (
                                <tr key={product.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <img src={product.images[0]} alt={product.name[language]} className="w-12 h-12 object-cover rounded-md" />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{product.name[language]}</div>
                                        <div className="text-sm text-gray-500">{product.category[language]}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {product.sku}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => navigateTo('admin-edit', { productId: product.id })}
                                                className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1"
                                            >
                                                <EditIcon className="w-4 h-4" />
                                                ערוך
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id, product.name[language])}
                                                className="text-red-600 hover:text-red-900 flex items-center gap-1"
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                                מחק
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;