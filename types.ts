export enum Language {
    HE = 'he',
    EN = 'en',
    RU = 'ru',
}

export type LocalizedString = {
    [key in Language | string]: string;
};

export type Price = {
    ils: number;
    usd: number;
    eur: number;
};

export interface Color {
    name: LocalizedString;
    hex: string;
}

export interface Accessory {
    id: string;
    name: LocalizedString;
    price: Price;
    image: string;
}

export interface Product {
    id: string;
    sku: string;
    name: LocalizedString;
    subtitle: LocalizedString;
    description: LocalizedString;
    category: LocalizedString;
    collection: LocalizedString;
    brand: LocalizedString;
    dimensions: LocalizedString;
    images: string[];
    colors: Color[];
    price: Price;
    accessories: Accessory[];
    similarProductIds: string[];
    inStock: boolean;
    stock?: number;
    averageRating?: number;
    reviewCount?: number;
    features?: LocalizedString[];
    safetyInfo?: LocalizedString;
    warrantyInfo?: LocalizedString;
    certificates?: LocalizedString[];
}

export interface CartItem {
    productId: string;
    quantity: number;
    color: Color;
    accessories: Accessory[];
}

export interface Coupon {
    code: string;
    discount: number; // percentage
    description: string;
}


export interface Notification {
    id: number;
    message: string;
    type: 'success' | 'error' | 'info';
}

export interface Review {
    id: string;
    productId: string;
    author: string;
    rating: number;
    title: string;
    comment: string;
    date: string;
}

export type ChatMessage = {
    id: string;
    role: 'user' | 'model' | 'system';
    text: string;
    isLoading?: boolean;
}

export interface CategoryInfo {
    key: string;
    name: LocalizedString;
    productCount: number;
    image: string;
}

export interface Transcription {
    speaker: 'user' | 'model';
    text: string;
}