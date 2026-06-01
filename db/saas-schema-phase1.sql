-- M9 TERMINAL SAAS - DATABASE SCHEMA (Phase 1)
-- Single-tier model: $88/mo, $792/yr, or $3,837.50 lifetime
-- Date: June 1, 2026

-- Create organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  active BOOLEAN DEFAULT TRUE
);

-- Create users table (if not exists, else add columns)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  org_id INTEGER REFERENCES organizations(id),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255),
  full_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'member', -- 'owner', 'admin', 'member'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id SERIAL PRIMARY KEY,
  org_id INTEGER REFERENCES organizations(id) UNIQUE,
  tier VARCHAR(50) DEFAULT 'free', -- 'free', 'pro', 'lifetime'
  price_id VARCHAR(100), -- Stripe price ID (e.g., 'price_88_monthly')
  billing_cycle VARCHAR(20), -- 'monthly', 'yearly', 'lifetime'
  amount_cents INTEGER, -- 8800 = $88.00
  currency VARCHAR(3) DEFAULT 'USD',
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  stripe_invoice_id VARCHAR(255),
  
  -- Subscription lifecycle
  started_at TIMESTAMP DEFAULT NOW(),
  renews_at TIMESTAMP, -- NULL for lifetime
  trial_ends_at TIMESTAMP,
  cancelled_at TIMESTAMP,
  cancellation_reason TEXT,
  
  -- Payment status
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'cancelled', 'past_due', 'trial'
  payment_method VARCHAR(100), -- 'card', 'bank', 'paypal', etc.
  
  -- Usage tracking
  scans_used_this_month INTEGER DEFAULT 0,
  api_calls_used_this_month INTEGER DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create organization_settings table
CREATE TABLE IF NOT EXISTS organization_settings (
  id SERIAL PRIMARY KEY,
  org_id INTEGER REFERENCES organizations(id) UNIQUE,
  
  -- API keys (encrypted at rest)
  api_keys_encrypted JSONB, -- {"sportsData": "encrypted...", "oddsApi": "encrypted...", "claude": "encrypted..."}
  
  -- Preferences
  timezone VARCHAR(50) DEFAULT 'America/New_York',
  currency VARCHAR(3) DEFAULT 'USD',
  dark_mode BOOLEAN DEFAULT TRUE,
  
  -- Feature toggles
  notifications_enabled BOOLEAN DEFAULT TRUE,
  email_notifications BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create audit_log table for compliance
CREATE TABLE IF NOT EXISTS audit_log (
  id SERIAL PRIMARY KEY,
  org_id INTEGER REFERENCES organizations(id),
  user_id INTEGER REFERENCES users(id),
  action VARCHAR(100), -- 'login', 'scan', 'settings_updated', 'api_key_rotated', etc.
  resource_type VARCHAR(50), -- 'user', 'subscription', 'settings', 'bet', etc.
  resource_id VARCHAR(100),
  changes JSONB, -- What changed (old_value → new_value)
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create payment_events table for tracking
CREATE TABLE IF NOT EXISTS payment_events (
  id SERIAL PRIMARY KEY,
  org_id INTEGER REFERENCES organizations(id),
  event_type VARCHAR(100), -- 'subscription_created', 'payment_succeeded', 'payment_failed', 'subscription_cancelled'
  stripe_event_id VARCHAR(255),
  details JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create invitations table (for adding team members)
CREATE TABLE IF NOT EXISTS invitations (
  id SERIAL PRIMARY KEY,
  org_id INTEGER REFERENCES organizations(id),
  email VARCHAR(255),
  token VARCHAR(255) UNIQUE,
  role VARCHAR(50) DEFAULT 'member',
  accepted_at TIMESTAMP,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_organizations_slug ON organizations(slug);
CREATE INDEX idx_users_org_id ON users(org_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_subscriptions_org_id ON subscriptions(org_id);
CREATE INDEX idx_subscriptions_stripe_customer ON subscriptions(stripe_customer_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_audit_log_org_id ON audit_log(org_id);
CREATE INDEX idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at);
CREATE INDEX idx_payment_events_org_id ON payment_events(org_id);
CREATE INDEX idx_invitations_org_id ON invitations(org_id);
CREATE INDEX idx_invitations_token ON invitations(token);

-- Row-Level Security (PostgreSQL)
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_events ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see their own org's users
CREATE POLICY users_isolation ON users
  USING (org_id = (SELECT org_id FROM users WHERE id = current_setting('app.user_id')::int LIMIT 1));

-- Subscriptions isolation
CREATE POLICY subscriptions_isolation ON subscriptions
  USING (org_id = (SELECT org_id FROM users WHERE id = current_setting('app.user_id')::int LIMIT 1));

-- Settings isolation
CREATE POLICY settings_isolation ON organization_settings
  USING (org_id = (SELECT org_id FROM users WHERE id = current_setting('app.user_id')::int LIMIT 1));

-- Audit log isolation
CREATE POLICY audit_isolation ON audit_log
  USING (org_id = (SELECT org_id FROM users WHERE id = current_setting('app.user_id')::int LIMIT 1));

-- Payment events isolation
CREATE POLICY payment_events_isolation ON payment_events
  USING (org_id = (SELECT org_id FROM users WHERE id = current_setting('app.user_id')::int LIMIT 1));
