-- M9 Terminal Database Schema
-- PostgreSQL 14+

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  
  -- Profile
  display_name VARCHAR(255),
  
  -- Subscription
  subscription_tier VARCHAR(50) DEFAULT 'free', -- free, pro, enterprise
  trial_started_at TIMESTAMP,
  trial_ends_at TIMESTAMP,
  
  -- Bankroll
  bankroll DECIMAL(15, 2) DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'USD',
  
  -- API Keys (encrypted JSON)
  api_keys_encrypted TEXT,
  
  -- Tracking
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_subscription_tier ON users(subscription_tier);

-- Signals Table
CREATE TABLE IF NOT EXISTS signals (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  
  -- Signal Details
  sport VARCHAR(50) NOT NULL, -- nba, nfl, mlb, etc.
  game_id VARCHAR(255),
  signal_type VARCHAR(100), -- contrarian, steam, RLM, sharp, reverse_line_movement
  
  -- Analysis
  probability DECIMAL(5, 4), -- 0-1
  confidence_score DECIMAL(5, 4), -- 0-1
  expected_value DECIMAL(10, 2),
  
  -- Market Details
  market_details JSONB, -- {team, line, over_under, etc.}
  
  -- Status
  status VARCHAR(50) DEFAULT 'active', -- active, expired, analyzed
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP
);

CREATE INDEX idx_signals_user_id ON signals(user_id);
CREATE INDEX idx_signals_sport ON signals(sport);
CREATE INDEX idx_signals_created_at ON signals(created_at);

-- Bets Table
CREATE TABLE IF NOT EXISTS bets (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  
  -- Bet Details
  sport VARCHAR(50) NOT NULL,
  game_id VARCHAR(255),
  bet_type VARCHAR(100), -- moneyline, spread, over_under, prop
  
  -- Odds & Stake
  odds_placed DECIMAL(10, 2) NOT NULL,
  odds_closed DECIMAL(10, 2),
  stake DECIMAL(15, 2) NOT NULL,
  
  -- Sportsbook
  sportsbook VARCHAR(100),
  
  -- Result
  result VARCHAR(50) DEFAULT 'pending', -- pending, win, loss, void, push
  payout DECIMAL(15, 2),
  
  -- CLV (Closing Line Value)
  clv DECIMAL(10, 4),
  clv_percent DECIMAL(10, 4),
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  settled_at TIMESTAMP
);

CREATE INDEX idx_bets_user_id ON bets(user_id);
CREATE INDEX idx_bets_result ON bets(result);
CREATE INDEX idx_bets_created_at ON bets(created_at);

-- Markets Table
CREATE TABLE IF NOT EXISTS markets (
  id SERIAL PRIMARY KEY,
  
  -- Game Identification
  sport VARCHAR(50) NOT NULL,
  game_id VARCHAR(255) UNIQUE NOT NULL,
  
  -- Line Information
  line_type VARCHAR(100), -- moneyline, spread, over_under
  current_line DECIMAL(10, 2),
  current_odds DECIMAL(10, 2),
  
  -- Movement Tracking
  movement_history JSONB, -- [{timestamp, line, odds}, ...]
  
  -- Liquidity
  liquidity_score DECIMAL(5, 2),
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP
);

CREATE INDEX idx_markets_game_id ON markets(game_id);
CREATE INDEX idx_markets_sport ON markets(sport);
CREATE INDEX idx_markets_is_active ON markets(is_active);

-- User API Keys Table (Encrypted)
CREATE TABLE IF NOT EXISTS user_api_keys (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  
  -- Service Information
  service VARCHAR(100) NOT NULL, -- odds_api, sportsdata, claude, etc.
  
  -- Encrypted Key
  key_encrypted TEXT NOT NULL,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  -- Tracking
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_used_at TIMESTAMP,
  UNIQUE(user_id, service)
);

CREATE INDEX idx_user_api_keys_user_id ON user_api_keys(user_id);
CREATE INDEX idx_user_api_keys_service ON user_api_keys(service);

-- Performance Analytics Table
CREATE TABLE IF NOT EXISTS analytics (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  
  -- Period
  period VARCHAR(50), -- daily, weekly, monthly
  date_start DATE,
  date_end DATE,
  
  -- Metrics
  total_bets INTEGER DEFAULT 0,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  pushes INTEGER DEFAULT 0,
  
  -- Financial
  total_wagered DECIMAL(15, 2) DEFAULT 0,
  total_profit DECIMAL(15, 2) DEFAULT 0,
  roi DECIMAL(10, 4), -- Return on Investment
  
  -- CLV Metrics
  clv_average DECIMAL(10, 4),
  clv_total DECIMAL(15, 2),
  
  -- Bankroll
  bankroll_start DECIMAL(15, 2),
  bankroll_end DECIMAL(15, 2),
  
  -- Timestamps
  calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP
);

CREATE INDEX idx_analytics_user_id ON analytics(user_id);
CREATE INDEX idx_analytics_period ON analytics(period);
CREATE INDEX idx_analytics_date_start ON analytics(date_start);

-- Alerts Table
CREATE TABLE IF NOT EXISTS alerts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  
  -- Alert Details
  alert_type VARCHAR(100), -- signal, line_movement, bankroll, threshold
  title VARCHAR(255),
  message TEXT,
  
  -- Target
  sport VARCHAR(50),
  game_id VARCHAR(255),
  
  -- Status
  is_read BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  read_at TIMESTAMP,
  expires_at TIMESTAMP
);

CREATE INDEX idx_alerts_user_id ON alerts(user_id);
CREATE INDEX idx_alerts_is_read ON alerts(is_read);
CREATE INDEX idx_alerts_created_at ON alerts(created_at);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bets_updated_at BEFORE UPDATE ON bets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_markets_updated_at BEFORE UPDATE ON markets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indexes for performance
CREATE INDEX idx_bets_user_sport ON bets(user_id, sport);
CREATE INDEX idx_signals_user_sport ON signals(user_id, sport);
CREATE INDEX idx_markets_sport_created ON markets(sport, created_at);
