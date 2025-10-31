import { createClient } from '@supabase/supabase-js';

// Environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

// Client for frontend (respects RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions for Database
export type Product = {
  id: string;
  sku: string;
  name: {
    he: string;
    en: string;
    ru: string;
  };
  subtitle?: {
    he: string;
    en: string;
    ru: string;
  };
  description: {
    he: string;
    en: string;
    ru: string;
  };
  category: {
    he: string;
    en: string;
    ru: string;
  };
  collection: {
    he: string;
    en: string;
    ru: string;
  };
  brand: {
    he: string;
    en: string;
    ru: string;
  };
  dimensions: {
    he: string;
    en: string;
    ru: string;
  };
  images: string[];
  colors: any[];
  price: {
    ils: number;
    usd: number;
    eur: number;
  };
  accessories: any[];
  similar_product_ids: string[];
  in_stock: boolean;
  stock?: number;
  features?: any[];
  safety_info?: {
    he: string;
    en: string;
    ru: string;
  };
  warranty_info?: {
    he: string;
    en: string;
    ru: string;
  };
  certificates?: any[];
  created_at?: string;
  updated_at?: string;
};

export type User = {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  role: 'customer' | 'admin';
  created_at: string;
  updated_at: string;
};

export type Order = {
  id: string;
  user_id?: string;
  guest_email?: string;
  items: any[];
  subtotal: number;
  discount_amount: number;
  total_price: number;
  coupon_code?: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: any;
  created_at: string;
  updated_at: string;
};

export type Review = {
  id: string;
  product_id: string;
  user_id?: string;
  guest_name?: string;
  rating: number;
  comment?: string;
  created_at: string;
  updated_at: string;
};
