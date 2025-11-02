/*
  # Fix Product Sales Trigger

  1. Changes
    - Remove foreign key constraint from product_sales to allow deleted products
    - Update trigger to handle non-existent products gracefully
    
  2. Reason
    - Some orders may reference products that have been deleted
    - Analytics should still track sales even for deleted products
*/

-- Drop the constraint
ALTER TABLE product_sales DROP CONSTRAINT IF EXISTS product_sales_product_id_fkey;

-- Recreate the function to handle missing products
CREATE OR REPLACE FUNCTION update_product_sales()
RETURNS TRIGGER AS $$
DECLARE
  item JSONB;
  prod_id uuid;
  prod_name text;
  prod_quantity integer;
  prod_price numeric;
BEGIN
  -- Only process accepted orders
  IF NEW.status = 'accepted' AND (OLD IS NULL OR OLD.status != 'accepted') THEN
    -- Loop through each item in the order
    FOR item IN SELECT * FROM jsonb_array_elements(NEW.items::jsonb)
    LOOP
      prod_id := (item->>'product_id')::uuid;
      prod_name := item->>'name';
      prod_quantity := (item->>'quantity')::integer;
      prod_price := (item->>'price')::numeric;
      
      -- Insert or update product sales statistics (without foreign key)
      INSERT INTO product_sales (product_id, product_name, quantity_sold, total_revenue, last_sale_at)
      VALUES (prod_id, prod_name, prod_quantity, prod_quantity * prod_price, now())
      ON CONFLICT (product_id) 
      DO UPDATE SET
        quantity_sold = product_sales.quantity_sold + prod_quantity,
        total_revenue = product_sales.total_revenue + (prod_quantity * prod_price),
        last_sale_at = now(),
        updated_at = now();
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;