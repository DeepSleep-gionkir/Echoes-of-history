-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table (Kingdoms)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT NOT NULL,
  authority_tier TEXT DEFAULT 'ignored', -- 'ignored', 'normal', 'revered'
  resources JSONB DEFAULT '{"gold": 100, "food": 100, "mat": 50, "man": 50, "know": 0, "auth": 0}',
  reputation_tags JSONB DEFAULT '[]', -- ["warmonger", "pacifist"]
  last_active TIMESTAMP DEFAULT NOW()
);

-- 2. Inventory Table (Items)
CREATE TABLE IF NOT EXISTS inventory (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  item_name TEXT NOT NULL,
  amount INT DEFAULT 0,
  tags JSONB -- ["luxury", "strategic"]
);

-- 3. Internal Entities Table (Factions)
CREATE TABLE IF NOT EXISTS internal_entities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  name TEXT, -- "Nobility", "Merchants"
  type TEXT, -- "faction", "corp", "military"
  tags JSONB, -- ["conservative", "warlike"]
  loyalty INT DEFAULT 50,
  power INT DEFAULT 50
);

-- RLS Policies (Optional for now, but good practice)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE internal_entities ENABLE ROW LEVEL SECURITY;

-- Allow public access for prototype (Secure this later!)
CREATE POLICY "Public Access" ON users FOR ALL USING (true);
CREATE POLICY "Public Access" ON inventory FOR ALL USING (true);
CREATE POLICY "Public Access" ON internal_entities FOR ALL USING (true);
