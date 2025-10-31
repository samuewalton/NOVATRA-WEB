import type { Coupon } from '../types.ts';

export const coupons: Coupon[] = [
    {
        code: 'WELCOME10',
        discount: 10,
        description: '10% off your first order',
    },
    {
        code: 'SUMMER24',
        discount: 15,
        description: '15% off for summer sale',
    },
];