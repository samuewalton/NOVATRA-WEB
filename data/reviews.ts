
import type { Review } from '../types.ts';

export const reviews: Review[] = [
    {
        id: 'rev1',
        productId: '1',
        author: 'יעל כהן',
        rating: 5,
        title: 'מיטה מדהימה!',
        comment: 'המיטה יפהפיה, איכותית מאוד וקלה להרכבה. התינוק שלנו ישן בה מצוין. מומלץ בחום!',
        date: '2024-05-20T10:00:00Z'
    },
    {
        id: 'rev2',
        productId: '1',
        author: 'David L.',
        rating: 4,
        title: 'Great crib, solid wood.',
        comment: 'Very happy with this purchase. The crib is sturdy and looks fantastic in the nursery. Assembly took a bit of time but the instructions were clear.',
        date: '2024-04-15T14:30:00Z'
    },
    {
        id: 'rev3',
        productId: '2',
        author: 'אנה פ.',
        rating: 5,
        title: 'ארון יפהפה ומרווח',
        comment: 'הארון בדיוק מה שחיפשנו. יש המון מקום אחסון והדלתות עם הסגירה השקטה זה גאוני. האיכות מעולה.',
        date: '2024-06-01T08:45:00Z'
    },
    {
        id: 'rev4',
        productId: '3',
        author: 'משה לוי',
        rating: 4,
        title: 'שידה פרקטית מאוד',
        comment: 'שידה נוחה מאוד לשימוש, הגובה של משטח ההחתלה מושלם. המגירות נעות חלק. החיסרון היחיד הוא שהיא הגיעה עם שריטה קטנה בצד.',
        date: '2024-05-10T18:00:00Z'
    },
     {
        id: 'rev5',
        productId: '1',
        author: 'Sarah B.',
        rating: 5,
        title: 'Absolutely beautiful',
        comment: 'The Monaco crib is a centerpiece in our nursery. The quality is exceptional and it feels very safe and secure. Worth every shekel!',
        date: '2024-06-11T12:00:00Z'
    },
];