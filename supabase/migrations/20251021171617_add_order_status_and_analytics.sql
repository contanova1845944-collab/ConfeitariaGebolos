/*
  # Enhanced Order Management and Analytics

  1. Changes
    - Update orders table to support new status values
    - Add product_sales tracking table for analytics
    - Add triggers to automatically track product sales
    
  2. New Status Values
    - pending: Initial order status
    - accepted: Order has been accepted by admin
    - deleted: Order has been marked as deleted
    
  3. Analytics
    - Track product sales count and revenue
    - Enable real-time analytics updates
*/

-- Update order status constraint to include new values
DO $$
BEGIN
  -- Drop existing constraint if it exists
  ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
  
  -- Add new constraint with all status values
  ALTER TABLE orders ADD CONSTRAINT orders_status_check 
    CHECK (status IN ('pending', 'accepted', 'deleted'));
END $$;

-- Create product_sales table for analytics
CREATE TABLE IF NOT EXISTS product_sales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  product_name text NOT NULL,
  quantity_sold integer NOT NULL DEFAULT 0,
  total_revenue numeric(10,2) NOT NULL DEFAULT 0,
  last_sale_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(product_id)
);

-- Enable RLS on product_sales
ALTER TABLE product_sales ENABLE ROW LEVEL SECURITY;

-- Allow admins to read product sales data
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'product_sales' AND policyname = 'Admins can read product sales'
  ) THEN
    CREATE POLICY "Admins can read product sales"
      ON product_sales FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

-- Create function to update product sales analytics
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
      
      -- Insert or update product sales statistics
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

-- Create trigger to update product sales on order status change
DROP TRIGGER IF EXISTS update_product_sales_trigger ON orders;
CREATE TRIGGER update_product_sales_trigger
  AFTER INSERT OR UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_product_sales();

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_product_sales_quantity ON product_sales(quantity_sold DESC);
CREATE INDEX IF NOT EXISTS idx_product_sales_revenue ON product_sales(total_revenue DESC);