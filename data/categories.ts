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
        image: '/images/categories/baby-cribs.jpg'
    },
    {
        key: 'Wardrobes',
        name: { he: 'ארונות', en: 'Wardrobes', ru: 'Шкафы' },
        image: '/images/categories/wardrobes.jpg'
    },
    {
        key: 'Kids Beds',
        name: { he: 'מיטות ילדים', en: 'Kids Beds', ru: 'Детские кровати' },
        image: '/images/categories/kids-beds.jpg'
    },
    {
        key: 'Dressers',
        name: { he: 'שידות', en: 'Dressers', ru: 'Комоды' },
        image: '/images/categories/dressers.jpg'
    },
    {
        key: 'Accessories',
        name: { he: 'אביזרים', en: 'Accessories', ru: 'Аксессуары' },
        image: '/images/categories/accessories.jpg'
    }
];