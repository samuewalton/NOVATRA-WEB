import type { Product, Accessory, Color, LocalizedString } from '../types.ts';
import { Language } from '../types.ts';

const monaco_accessories: Accessory[] = [
    {
        id: 'acc1',
        name: { he: 'גלגלים למיטה', en: 'Crib Wheels', ru: 'Колесики для кроватки' },
        price: { ils: 50, usd: 15, eur: 13 },
        image: '/images/products/accessory-wheels-1.jpg'
    },
    {
        id: 'acc2',
        name: { he: 'מערכת נדנדה', en: 'Rocking System', ru: 'Маятниковая система' },
        price: { ils: 198, usd: 55, eur: 50 },
        image: '/images/products/accessory-rocking-system-1.jpg'
    }
];

const colors: Color[] = [
    { name: { he: 'לבן', en: 'White', ru: 'Белый' }, hex: '#FFFFFF' },
    { name: { he: 'אפור', en: 'Grey', ru: 'Серый' }, hex: '#D1D5DB' },
    { name: { he: 'אלון', en: 'Oak', ru: 'Дуб' }, hex: '#C6A786' },
    { name: { he: 'אפור פחם', en: 'Charcoal Grey', ru: 'Угольно-серый' }, hex: '#52525B' },
];

export const products: Product[] = [
    {
        id: '1',
        sku: 'VRS-MNC-CB-120',
        name: { he: 'מיטת תינוק מונקו', en: 'Monaco Baby Crib', ru: 'Детская кроватка Монако' },
        subtitle: { he: 'מתכווננת 3 מצבים עם דופן נפתחת', en: '3-position adjustable with drop side', ru: '3-уровневая регулировка с опускающейся стороной' },
        description: { 
            he: 'מיטת התינוק מקולקציית מונקו משלבת עיצוב מודרני עם פונקציונליות גבוהה. עשויה עץ ליבנה ו-MDF איכותי, וצבועה בצבעים על בסיס מים, בטוחים לחלוטין לתינוקות. המיטה מציעה 3 מצבי גובה למזרן, דופן קדמית ניתנת להסרה והתאמה לגובה מיטת ההורים, ואפשרות להפוך אותה לספת ילדים נוחה. המיטה מגיעה עם רגלי עץ יציבות וניתן להוסיף לה גלגלים או מנגנון נדנוד.', 
            en: 'The Monaco collection baby crib combines modern design with high functionality. Made of high-quality birch wood and MDF, and painted with water-based, completely baby-safe paints. The crib offers 3 mattress height positions, a removable front side that adjusts to the height of the parents\' bed, and the option to transform it into a comfortable children\'s sofa. The bed comes with stable wooden legs, and wheels or a rocking mechanism can be added.', 
            ru: 'Детская кроватка из коллекции Монако сочетает в себе современный дизайн и высокую функциональность. Изготовлена из качественной древесины березы и МДФ, окрашена полностью безопасными для детей красками на водной основе. Кроватка предлагает 3 положения высоты матраса, съемную переднюю стенку, регулируемую под высоту родительской кровати, и возможность трансформации в удобный детский диванчик. Кроватка поставляется с устойчивыми деревянными ножками, также можно добавить колесики или маятниковый механизм.'
        },
        category: { he: 'מיטות תינוקות', en: 'Baby Cribs', ru: 'Детские кроватки' },
        collection: { he: 'מונקו', en: 'Monaco', ru: 'Монако' },
        brand: { he: 'Veres', en: 'Veres', ru: 'Veres' },
        dimensions: { he: '125x65x88 ס"מ', en: '125x65x88 cm', ru: '125x65x88 см' },
        images: [
            '/images/products/crib-monaco-white-1.jpg',
            '/images/products/crib-monaco-white-2.jpg',
            '/images/products/crib-monaco-white-3.jpg',
        ],
        colors: [colors[0], colors[3]],
        price: { ils: 1490, usd: 410, eur: 380 },
        accessories: monaco_accessories,
        similarProductIds: ['2', '3'],
        inStock: true,
        stock: 12,
        features: [
            { he: 'שלושה מצבי גובה לבסיס המזרן.', en: 'Three height levels for the mattress base.', ru: 'Три уровня высоты для основания матраса.' },
            { he: 'דופן קדמית נפתחת עם מנגנון אמין.', en: 'Removable front side with a reliable mechanism.', ru: 'Съемная передняя стенка с надежным механизмом.' },
            { he: 'אפשרות להפוך את המיטה לספת ילדים.', en: 'Can be transformed into a children\'s sofa.', ru: 'Возможность трансформации в детский диванчик.' },
            { he: 'בסיס המזרן עשוי מסגרת אורתופדית לתמיכה ואוורור.', en: 'Orthopedic slat base for support and ventilation.', ru: 'Ортопедическое реечное дно для поддержки и вентиляции.' },
            { he: 'אפשרות להתקנת גלגלים או מנגנון נדנוד (נמכר בנפרד).', en: 'Option to install wheels or a rocking mechanism (sold separately).', ru: 'Возможность установки колесиков или маятникового механизма (продается отдельно).' },
            { he: 'כולל רצועות בטיחות לחיבור למיטת ההורים.', en: 'Includes safety straps for attaching to the parents\' bed.', ru: 'Включает ремни безопасности для крепления к родительской кровати.' },
            { he: 'פינות מעוגלות לבטיחות מרבית.', en: 'Rounded corners for maximum safety.', ru: 'Закругленные углы для максимальной безопасности.' },
        ],
        safetyInfo: {
            he: 'המוצר עומד בדרישות בינלאומיות ובתקנים הממלכתיים של אוקראינה (DSTU ISO 9001) ובדרישות הבטיחות (DSTU EN 716-1). כל הצבעים והלכות בהם נעשה שימוש הם על בסיס מים, מתוצרת היצרן האירופי המוביל Sherwin Williams, והם בטוחים לחלוטין לתינוקות וילדים.',
            en: 'The product complies with international requirements and the state standards of Ukraine (DSTU ISO 9001) and safety requirements (DSTU EN 716-1). All paints and varnishes used are water-based, produced by the leading European manufacturer Sherwin Williams, and are completely safe for babies and children.',
            ru: 'Продукт соответствует международным требованиям и государственным стандартам Украины (ДСТУ ISO 9001) и требованиям безопасности (ДСТУ EN 716-1). Все используемые краски и лаки на водной основе, производства ведущего европейского производителя Sherwin Williams, и абсолютно безопасны для младенцев и детей.'
        },
        warrantyInfo: {
            he: '18 חודשי אחריות יצרן.',
            en: '18 months manufacturer warranty.',
            ru: '18 месяцев гарантии от производителя.'
        },
        certificates: [
            { he: 'תקן אירופאי EN 716-1', en: 'European Standard EN 716-1', ru: 'Европейский стандарт EN 716-1' },
            { he: 'תקן ניהול איכות ISO 9001', en: 'Quality Management Standard ISO 9001', ru: 'Стандарт управления качеством ISO 9001' }
        ]
    },
    {
        id: '2',
        sku: 'VRS-MNC-WR-900',
        name: { he: 'ארון 2 דלתות מונקו', en: 'Monaco 2-Door Wardrobe', ru: 'Шкаф 2-дверный Монако' },
        subtitle: { he: 'אחסון מרווח ומעוצב', en: 'Spacious and stylish storage', ru: 'Вместительное и стильное хранение' },
        description: { 
            he: 'ארון בגדים 2 דלתות מקולקציית מונקו עם שפע מקום אחסון. כולל מוט תלייה ושני מדפים. מנגנוני סגירה שקטה בדלתות.', 
            en: 'A 2-door wardrobe from the Monaco collection with ample storage space. Includes a hanging rod and two shelves. Soft-close mechanisms on the doors.', 
            ru: '2-дверный шкаф для одежды из коллекции Монако с большим пространством для хранения. Включает штангу для одежды и две полки. Двери с механизмами плавного закрывания.'
        },
        category: { he: 'ארונות', en: 'Wardrobes', ru: 'Шкафы' },
        collection: { he: 'מונקו', en: 'Monaco', ru: 'Монако' },
        brand: { he: 'Veres', en: 'Veres', ru: 'Veres' },
        dimensions: { he: '90x180x50 ס"מ', en: '90x180x50 cm', ru: '90x180x50 см' },
        images: [
            '/images/products/wardrobe-monaco-white-1.jpg',
            '/images/products/wardrobe-monaco-white-2.jpg',
            '/images/products/wardrobe-monaco-white-3.jpg',
        ],
        colors: [colors[0], colors[1], colors[2]],
        price: { ils: 2200, usd: 600, eur: 550 },
        accessories: [],
        similarProductIds: ['1', '3'],
        inStock: true,
        stock: 8,
    },
    {
        id: '3',
        sku: 'VRS-MNC-DR-3D',
        name: { he: 'שידת החתלה מונקו', en: 'Monaco Changing Dresser', ru: 'Комод для пеленания Монако' },
        subtitle: { he: '3 מגירות עם משטח החתלה', en: '3 drawers with changing top', ru: '3 ящика с пеленальной поверхностью' },
        description: { 
            he: 'שידת החתלה פונקציונלית עם 3 מגירות מרווחות. משטח ההחתלה ניתן להסרה, כך שהשידה יכולה לשמש כרהיט רגיל בהמשך.', 
            en: 'Functional changing dresser with 3 spacious drawers. The changing top is removable, so the dresser can be used as regular furniture later on.', 
            ru: 'Функциональный пеленальный комод с 3 вместительными ящиками. Пеленальная поверхность снимается, поэтому комод можно использовать как обычную мебель в дальнейшем.'
        },
        category: { he: 'שידות', en: 'Dressers', ru: 'Комоды' },
        collection: { he: 'מונקו', en: 'Monaco', ru: 'Монако' },
        brand: { he: 'Veres', en: 'Veres', ru: 'Veres' },
        dimensions: { he: '90x90x50 ס"מ', en: '90x90x50 cm', ru: '90x90x50 см' },
        images: [
            '/images/products/dresser-monaco-white-1.jpg',
            '/images/products/dresser-monaco-white-2.jpg',
            '/images/products/dresser-monaco-oak-1.jpg',
        ],
        colors: [colors[0], colors[2]],
        price: { ils: 1850, usd: 510, eur: 470 },
        accessories: [],
        similarProductIds: ['1', '2'],
        inStock: false,
        stock: 0,
    },
    {
        id: '4',
        sku: 'VRS-CLSC-CB-120',
        name: { he: 'מיטת תינוק קלאסית', en: 'Classic Baby Crib', ru: 'Классическая детская кроватка' },
        subtitle: { he: 'עיצוב נצחי', en: 'Timeless design', ru: 'Вневременной дизайн' },
        description: { 
            he: 'מיטת תינוק קלאסית מעץ בוק מלא. עיצוב אלגנטי ונקי שמתאים לכל חדר ילדים. בטיחותית ועמידה לאורך שנים.', 
            en: 'Classic baby crib made of solid beech wood. An elegant and clean design that fits any nursery. Safe and durable for years.', 
            ru: 'Классическая детская кроватка из массива бука. Элегантный и чистый дизайн, который подходит для любой детской комнаты. Безопасная и долговечная.'
        },
        category: { he: 'מיטות תינוקות', en: 'Baby Cribs', ru: 'Детские кроватки' },
        collection: { he: 'קלאסיק', en: 'Classic', ru: 'Классик' },
        brand: { he: 'Veres', en: 'Veres', ru: 'Veres' },
        dimensions: { he: '120x60 ס"מ', en: '120x60 cm', ru: '120x60 см' },
        images: [
            '/images/products/crib-classic-white-1.jpg',
            '/images/products/crib-classic-white-2.jpg',
            '/images/products/crib-classic-white-3.jpg',
        ],
        colors: [colors[0]],
        price: { ils: 1250, usd: 345, eur: 320 },
        accessories: monaco_accessories,
        similarProductIds: ['1'],
        inStock: true,
        stock: 3,
    }
];