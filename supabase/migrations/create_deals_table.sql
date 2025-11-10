-- Create deals table
CREATE TABLE IF NOT EXISTS public.deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  discount_percentage NUMERIC(5, 2) NOT NULL DEFAULT 0,
  discount_amount NUMERIC(10, 2),
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'expired', 'archived')),
  image_url TEXT,
  banner_image_url TEXT,
  product_ids UUID[],
  category_ids UUID[],
  min_purchase_amount NUMERIC(10, 2),
  max_discount_amount NUMERIC(10, 2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_deals_status ON public.deals(status);
CREATE INDEX IF NOT EXISTS idx_deals_dates ON public.deals(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_deals_product_ids ON public.deals USING GIN(product_ids);
CREATE INDEX IF NOT EXISTS idx_deals_category_ids ON public.deals USING GIN(category_ids);

-- Enable Row Level Security
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read active deals
CREATE POLICY "Anyone can view active deals"
  ON public.deals
  FOR SELECT
  USING (status = 'active' AND start_date <= NOW() AND end_date >= NOW());

-- Policy: Authenticated users can view all deals (for admin)
CREATE POLICY "Authenticated users can view all deals"
  ON public.deals
  FOR SELECT
  TO authenticated
  USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_deals_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_deals_updated_at
  BEFORE UPDATE ON public.deals
  FOR EACH ROW
  EXECUTE FUNCTION update_deals_updated_at();

-- Function to automatically expire deals
CREATE OR REPLACE FUNCTION expire_deals()
RETURNS void AS $$
BEGIN
  UPDATE public.deals
  SET status = 'expired'
  WHERE status = 'active'
    AND end_date < NOW();
END;
$$ LANGUAGE plpgsql;

-- Comment on table
COMMENT ON TABLE public.deals IS 'Stores special deals and promotions';
COMMENT ON COLUMN public.deals.discount_percentage IS 'Percentage discount (0-100)';
COMMENT ON COLUMN public.deals.discount_amount IS 'Fixed amount discount';
COMMENT ON COLUMN public.deals.product_ids IS 'Array of product IDs included in this deal';
COMMENT ON COLUMN public.deals.category_ids IS 'Array of category IDs included in this deal';
COMMENT ON COLUMN public.deals.min_purchase_amount IS 'Minimum purchase amount required to apply deal';
COMMENT ON COLUMN public.deals.max_discount_amount IS 'Maximum discount amount (caps the discount)';

