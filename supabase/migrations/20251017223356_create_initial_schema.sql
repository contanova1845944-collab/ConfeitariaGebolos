/*
  # Gê Bolos Gourmet Database Schema

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `price` (numeric)
      - `image_url` (text)
      - `category` (text) - 'menu' or 'showcase'
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `site_settings`
      - `id` (uuid, primary key)
      - `logo_url` (text)
      - `instagram_url` (text)
      - `contact_phone` (text)
      - `pix_key` (text)
      - `pix_qr_code_url` (text)
      - `updated_at` (timestamptz)
    
    - `orders`
      - `id` (uuid, primary key)
      - `customer_name` (text)
      - `customer_phone` (text)
      - `address_street` (text)
      - `address_neighborhood` (text)
      - `address_number` (text)
      - `address_complement` (text)
      - `items` (jsonb)
      - `total_amount` (numeric)
      - `status` (text) - 'pending', 'accepted', 'deleted'
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `admin_users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `password` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access to products and site_settings
    - Add policies for authenticated admin access to orders and admin operations
*/

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  image_url text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'menu',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (true);

-- Create site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  logo_url text NOT NULL DEFAULT '',
  instagram_url text NOT NULL DEFAULT 'https://www.instagram.com/gebolosgoumet?igsh=ejBwNnp4ejhpMnd5',
  contact_phone text NOT NULL DEFAULT '+55 85 8412-8195',
  pix_key text NOT NULL DEFAULT 'gvrocha1977@gmail.com',
  pix_qr_code_url text NOT NULL DEFAULT '',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view site settings"
  ON site_settings FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can update site settings"
  ON site_settings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert site settings"
  ON site_settings FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  address_street text NOT NULL,
  address_neighborhood text NOT NULL,
  address_number text NOT NULL,
  address_complement text DEFAULT '',
  items jsonb NOT NULL DEFAULT '[]',
  total_amount numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view orders"
  ON orders FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete orders"
  ON orders FOR DELETE
  TO authenticated
  USING (true);

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view admin users"
  ON admin_users FOR SELECT
  TO authenticated
  USING (true);

-- Insert default admin user
INSERT INTO admin_users (email, password)
VALUES ('grvidal03@gmail.com', '08052003')
ON CONFLICT (email) DO NOTHING;

-- Insert default site settings
INSERT INTO site_settings (logo_url, instagram_url, contact_phone, pix_key, pix_qr_code_url)
VALUES (
  '/WhatsApp Image 2025-09-23 at 19.50.39.jpeg',
  'https://www.instagram.com/gebolosgoumet?igsh=ejBwNnp4ejhpMnd5',
  '+55 85 8412-8195',
  'gvrocha1977@gmail.com',
  '/WhatsApp Image 2025-09-23 at 19.50.39 (2).jpeg'
)
ON CONFLICT DO NOTHING;

-- Insert sample showcase products
INSERT INTO products (name, description, price, image_url, category)
VALUES 
  ('Bolo de Chocolate Gourmet', 'Delicioso bolo de chocolate com cobertura cremosa e ganache belga. Perfeito para celebrações especiais.', 89.90, 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg', 'showcase'),
  ('Bolo Red Velvet', 'Clássico bolo red velvet com cream cheese. Sabor suave e textura aveludada que derrete na boca.', 95.00, 'https://images.pexels.com/photos/1721934/pexels-photo-1721934.jpeg', 'showcase'),
  ('Bolo de Morango', 'Bolo recheado com morangos frescos e chantilly. Leve, refrescante e irresistível.', 85.00, 'https://images.pexels.com/photos/1055272/pexels-photo-1055272.jpeg', 'showcase')
ON CONFLICT DO NOTHING;

-- Insert sample menu products
INSERT INTO products (name, description, price, image_url, category)
VALUES 
  ('Bolo de Cenoura', 'Tradicional bolo de cenoura com cobertura de chocolate. Um clássico brasileiro que nunca sai de moda.', 45.00, 'https://images.pexels.com/photos/2144112/pexels-photo-2144112.jpeg', 'menu'),
  ('Bolo de Limão', 'Bolo leve de limão siciliano com calda cítrica. Perfeito para acompanhar um café.', 48.00, 'https://images.pexels.com/photos/1853004/pexels-photo-1853004.jpeg', 'menu'),
  ('Bolo de Coco', 'Bolo úmido de coco com cobertura de coco ralado. Sabor tropical e irresistível.', 42.00, 'https://images.pexels.com/photos/1120970/pexels-photo-1120970.jpeg', 'menu'),
  ('Bolo Floresta Negra', 'Bolo de chocolate com cerejas e chantilly. Sofisticado e delicioso.', 98.00, 'https://images.pexels.com/photos/5644986/pexels-photo-5644986.jpeg', 'menu'),
  ('Bolo de Nozes', 'Bolo rico em nozes com cobertura de brigadeiro. Textura crocante e sabor marcante.', 52.00, 'https://images.pexels.com/photos/2144112/pexels-photo-2144112.jpeg', 'menu'),
  ('Bolo Prestígio', 'Bolo de chocolate com recheio de coco. A combinação perfeita de sabores.', 78.00, 'https://images.pexels.com/photos/1721934/pexels-photo-1721934.jpeg', 'menu')
ON CONFLICT DO NOTHING;