import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: 'menu' | 'showcase';
  type: string;
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  id: string;
  logo_url: string;
  instagram_url: string;
  contact_phone: string;
  pix_key: string;
  pix_qr_code_url: string;
  updated_at: string;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  address_street: string;
  address_neighborhood: string;
  address_number: string;
  address_complement: string;
  items: CartItem[];
  total_amount: number;
  status: 'pending' | 'accepted' | 'deleted';
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
}
