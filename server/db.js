import pg from 'pg'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'

dotenv.config()

const { Pool } = pg

export const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'appointhub',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  max: 20,
})

pool.on('error', (err) => {
  console.error('Database error:', err)
  process.exit(-1)
})

export async function initDatabase() {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP
      )
    `)
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        date TIMESTAMP NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP
      )
    `)
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        action VARCHAR(50) NOT NULL,
        entity VARCHAR(50) NOT NULL,
        entity_id INTEGER,
        old_snapshot JSONB,
        new_snapshot JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    
    await client.query('CREATE INDEX IF NOT EXISTS idx_appointments_user ON appointments(user_id)')
    await client.query('CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status)')
    
    await client.query('COMMIT')
    console.log('✅ Database tables ready')
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }
}

export async function seedDemoData() {
  const { rows } = await pool.query('SELECT COUNT(*) FROM users')
  if (rows[0].count > 0) return
  
  const adminHash = await bcrypt.hash('admin123', 10)
  const userHash = await bcrypt.hash('user123', 10)
  
  await pool.query(
    `INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4), ($5, $6, $7, $8)`,
    ['admin@example.com', adminHash, 'Alex Morgan', 'admin', 'user@example.com', userHash, 'Jamie Clarke', 'user']
  )
  
  console.log('✅ Demo accounts: admin@example.com/admin123, user@example.com/user123')
}
