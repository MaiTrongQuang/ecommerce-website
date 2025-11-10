-- Seed categories
INSERT INTO categories (name, slug, description) VALUES
  ('Electronics', 'electronics', 'Electronic devices and accessories'),
  ('Clothing', 'clothing', 'Fashion and apparel'),
  ('Home & Garden', 'home-garden', 'Home improvement and garden supplies'),
  ('Sports & Outdoors', 'sports-outdoors', 'Sports equipment and outdoor gear'),
  ('Books', 'books', 'Books and reading materials')
ON CONFLICT (slug) DO NOTHING;

-- Seed sample products
INSERT INTO products (name, slug, description, price, compare_at_price, sku, quantity, category_id, images, status)
SELECT 
  'Wireless Headphones',
  'wireless-headphones',
  'High-quality wireless headphones with noise cancellation',
  99.99,
  129.99,
  'WH-001',
  50,
  c.id,
  ARRAY['/placeholder.svg?height=400&width=400'],
  'active'
FROM categories c WHERE c.slug = 'electronics'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, price, sku, quantity, category_id, images, status)
SELECT 
  'Cotton T-Shirt',
  'cotton-t-shirt',
  'Comfortable 100% cotton t-shirt',
  24.99,
  'TS-001',
  100,
  c.id,
  ARRAY['/placeholder.svg?height=400&width=400'],
  'active'
FROM categories c WHERE c.slug = 'clothing'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, price, compare_at_price, sku, quantity, category_id, images, status)
SELECT 
  'Garden Tool Set',
  'garden-tool-set',
  'Complete 10-piece garden tool set',
  49.99,
  69.99,
  'GT-001',
  30,
  c.id,
  ARRAY['/placeholder.svg?height=400&width=400'],
  'active'
FROM categories c WHERE c.slug = 'home-garden'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, price, sku, quantity, category_id, images, status)
SELECT 
  'Yoga Mat',
  'yoga-mat',
  'Non-slip yoga mat with carrying strap',
  29.99,
  'YM-001',
  75,
  c.id,
  ARRAY['/placeholder.svg?height=400&width=400'],
  'active'
FROM categories c WHERE c.slug = 'sports-outdoors'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, price, sku, quantity, category_id, images, status)
SELECT 
  'Programming Guide',
  'programming-guide',
  'Comprehensive guide to modern programming',
  39.99,
  'BK-001',
  40,
  c.id,
  ARRAY['/placeholder.svg?height=400&width=400'],
  'active'
FROM categories c WHERE c.slug = 'books'
ON CONFLICT (slug) DO NOTHING;
