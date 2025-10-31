import type { LocalizedString } from '../types.ts';

interface CategoryData {
    key: string;
    name: LocalizedString;
    image: string;
}

export const definedCategories: CategoryData[] = [
    {
        key: 'Baby Cribs',
        name: { he: 'מיטות תינוקות', en: 'Baby Cribs', ru: 'Детские кроватки' },
        image: 'https://images.unsplash.com/photo-1608422233333-1f63a4a7a8d8?q=80&w=800&auto=format&fit=crop'
    },
    {
        key: 'Wardrobes',
        name: { he: 'ארונות', en: 'Wardrobes', ru: 'Шкафы' },
        image: 'https://images.unsplash.com/photo-1593813353434-29729a43a759?q=80&w=800&auto=format&fit=crop'
    },
    {
        key: 'Kids Beds',
        name: { he: 'מיטות ילדים', en: 'Kids Beds', ru: 'Детские кровати' },
        image: 'https://images.unsplash.com/photo-1562903332-9a00a35ea09a?q=80&w=800&auto=format&fit=crop'
    },
    {
        key: 'Dressers',
        name: { he: 'שידות', en: 'Dressers', ru: 'Комоды' },
        image: 'https://images.unsplash.com/photo-1604329249405-395aaa427544?q=80&w=800&auto=format&fit=crop'
    },
    {
        key: 'Accessories',
        name: { he: 'אביזרים', en: 'Accessories', ru: 'Аксессуары' },
        image: 'https://images.unsplash.com/photo-1596523528749-7b3b3f9cbe5c?q=80&w=800&auto=format&fit=crop'
    }
];