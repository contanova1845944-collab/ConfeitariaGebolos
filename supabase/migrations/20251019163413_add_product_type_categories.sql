/*
  # Add Product Type Categories

  1. Changes
    - Add `type` column to products table to categorize cakes
    - Update existing products with appropriate categories
    
  2. Categories
    - Chocolate
    - Frutas
    - Tradicional
    - Gourmet
    - Especial
*/

-- Add type column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'type'
  ) THEN
    ALTER TABLE products ADD COLUMN type text NOT NULL DEFAULT 'Gourmet';
  END IF;
END $$;

-- Update existing products with categories
UPDATE products SET type = 'Chocolate' WHERE name LIKE '%Chocolate%' OR name LIKE '%Floresta Negra%' OR name LIKE '%Prestígio%';
UPDATE products SET type = 'Frutas' WHERE name LIKE '%Morango%' OR name LIKE '%Limão%';
UPDATE products SET type = 'Tradicional' WHERE name LIKE '%Cenoura%' OR name LIKE '%Coco%';
UPDATE products SET type = 'Gourmet' WHERE name LIKE '%Red Velvet%' OR name LIKE '%Nozes%';
UPDATE products SET type = 'Especial' WHERE name LIKE '%Gourmet%' AND type = 'Gourmet';