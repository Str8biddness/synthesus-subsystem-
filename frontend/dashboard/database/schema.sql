CREATE TABLE IF NOT EXISTS patterns (
  id SERIAL PRIMARY KEY,
  pattern TEXT NOT NULL,
  response TEXT NOT NULL,
  success_rate FLOAT DEFAULT 0.5,
  usage_count INT DEFAULT 0,
  domain VARCHAR(100),
  metadata JSONB,
  last_used TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS memory (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(100),
  content TEXT,
  timestamp TIMESTAMP DEFAULT NOW(),
  type VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS entities (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) UNIQUE,
  aliases TEXT[],
  category VARCHAR(100),
  facts JSONB
);

CREATE TABLE IF NOT EXISTS sessions (
  id VARCHAR(100) PRIMARY KEY,
  user_id VARCHAR(100),
  state JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

