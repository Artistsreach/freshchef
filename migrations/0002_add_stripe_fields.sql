-- Add Stripe-related fields to apps table
ALTER TABLE apps 
ADD COLUMN IF NOT EXISTS stripe_product_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_price_id TEXT,
ADD COLUMN IF NOT EXISTS is_monetized BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS subscription_details TEXT;
