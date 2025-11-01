-- Fix column names to match TypeScript camelCase

ALTER TABLE products RENAME COLUMN in_stock TO "inStock";
ALTER TABLE products RENAME COLUMN similar_product_ids TO "similarProductIds";

-- Update index names too
DROP INDEX IF EXISTS idx_products_in_stock;
CREATE INDEX idx_products_inStock ON products("inStock");
