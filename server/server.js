import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import { pool, initDatabase, seedDemoData } from './db.js'
import { authenticateToken, requireAdmin, generateToken } from './middleware.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }))
app.use(express.json())

// ═══════════════════════════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════════════════════════

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields required' })
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password min 6 chars' })
    }
    
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email])
    if (existing.rows.length) {
      return res.status(400).json({ error: 'Email exists' })
    }
    
    const hash = await bcrypt.hash(password, 10)
    const result = await pool.query(
      'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name, role, created_at',
      [email, hash, name]
    )
    
    res.status(201).json({ user: result.rows[0] })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body
    
    const result = await pool.query('SELECT * FROM users WHERE email = $1 AND deleted_at IS NULL', [email])
    if (!result.rows.length) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    
    const user = result.rows[0]
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    
    const token = generateToken(user)
    const { password: _, ...userData } = user
    
    res.json({ token, user: userData })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, name, role, created_at FROM users WHERE id = $1',
      [req.user.id]
    )
    res.json({ user: result.rows[0] })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// ═══════════════════════════════════════════════════════════════
// APPOINTMENTS
// ═══════════════════════════════════════════════════════════════

app.get('/api/appointments', authenticateToken, async (req, res) => {
  try {
    const query = req.user.role === 'admin'
      ? `SELECT a.*, u.name as user_name, u.email as user_email FROM appointments a 
         LEFT JOIN users u ON a.user_id = u.id WHERE a.deleted_at IS NULL ORDER BY a.created_at DESC`
      : `SELECT a.*, u.name as user_name FROM appointments a 
         LEFT JOIN users u ON a.user_id = u.id WHERE a.user_id = $1 AND a.deleted_at IS NULL ORDER BY a.created_at DESC`
    
    const params = req.user.role === 'admin' ? [] : [req.user.id]
    const result = await pool.query(query, params)
    
    res.json({ appointments: result.rows })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

app.get('/api/appointments/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.*, u.name as user_name, u.email as user_email FROM appointments a
       LEFT JOIN users u ON a.user_id = u.id WHERE a.id = $1 AND a.deleted_at IS NULL`,
      [req.params.id]
    )
    
    if (!result.rows.length) {
      return res.status(404).json({ error: 'Not found' })
    }
    
    const apt = result.rows[0]
    if (req.user.role !== 'admin' && apt.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' })
    }
    
    res.json({ appointment: apt })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

app.post('/api/appointments', authenticateToken, async (req, res) => {
  try {
    const { title, description, date } = req.body
    
    if (!title || !date) {
      return res.status(400).json({ error: 'Title and date required' })
    }
    
    const result = await pool.query(
      'INSERT INTO appointments (user_id, title, description, date) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.id, title, description || '', date]
    )
    
    await pool.query(
      'INSERT INTO audit_logs (user_id, action, entity, entity_id, new_snapshot) VALUES ($1, $2, $3, $4, $5)',
      [req.user.id, 'CREATE', 'appointment', result.rows[0].id, JSON.stringify({ title, date })]
    )
    
    res.status(201).json({ appointment: result.rows[0] })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

app.put('/api/appointments/:id', authenticateToken, async (req, res) => {
  try {
    const { title, description, date, status } = req.body
    
    const current = await pool.query('SELECT * FROM appointments WHERE id = $1 AND deleted_at IS NULL', [req.params.id])
    if (!current.rows.length) return res.status(404).json({ error: 'Not found' })
    
    const apt = current.rows[0]
    
    if (req.user.role !== 'admin' && apt.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' })
    }
    if (status && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admin can change status' })
    }
    if (req.user.role !== 'admin' && apt.status !== 'pending') {
      return res.status(403).json({ error: 'Can only edit pending' })
    }
    
    const updates = []
    const values = []
    let idx = 1
    
    if (title) { updates.push(`title = $${idx++}`); values.push(title) }
    if (description !== undefined) { updates.push(`description = $${idx++}`); values.push(description) }
    if (date) { updates.push(`date = $${idx++}`); values.push(date) }
    if (status) { updates.push(`status = $${idx++}`); values.push(status) }
    
    updates.push(`updated_at = CURRENT_TIMESTAMP`)
    values.push(req.params.id)
    
    const result = await pool.query(
      `UPDATE appointments SET ${updates.join(', ')} WHERE id = $${idx} RETURNING *`,
      values
    )
    
    await pool.query(
      'INSERT INTO audit_logs (user_id, action, entity, entity_id, old_snapshot, new_snapshot) VALUES ($1, $2, $3, $4, $5, $6)',
      [req.user.id, 'UPDATE', 'appointment', apt.id, JSON.stringify({ status: apt.status }), JSON.stringify({ status: result.rows[0].status })]
    )
    
    res.json({ appointment: result.rows[0] })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

app.delete('/api/appointments/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM appointments WHERE id = $1', [req.params.id])
    if (!result.rows.length) return res.status(404).json({ error: 'Not found' })
    
    const apt = result.rows[0]
    if (req.user.role !== 'admin' && apt.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' })
    }
    
    await pool.query('UPDATE appointments SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1', [req.params.id])
    
    await pool.query(
      'INSERT INTO audit_logs (user_id, action, entity, entity_id, old_snapshot) VALUES ($1, $2, $3, $4, $5)',
      [req.user.id, 'DELETE', 'appointment', apt.id, JSON.stringify({ title: apt.title })]
    )
    
    res.json({ message: 'Deleted' })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// ═══════════════════════════════════════════════════════════════
// ADMIN
// ═══════════════════════════════════════════════════════════════

app.get('/api/admin/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        COUNT(*) FILTER (WHERE deleted_at IS NULL) as total,
        COUNT(*) FILTER (WHERE status = 'pending' AND deleted_at IS NULL) as pending,
        COUNT(*) FILTER (WHERE status = 'approved' AND deleted_at IS NULL) as approved,
        COUNT(*) FILTER (WHERE status = 'rejected' AND deleted_at IS NULL) as rejected,
        COUNT(*) FILTER (WHERE status = 'completed' AND deleted_at IS NULL) as completed
      FROM appointments
    `)
    
    const users = await pool.query('SELECT COUNT(*) as count FROM users WHERE deleted_at IS NULL')
    
    res.json({ stats: { ...result.rows[0], users: parseInt(users.rows[0].count) } })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

app.get('/api/admin/audit', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { action } = req.query
    const query = action && action !== 'all'
      ? 'SELECT al.*, u.name as user_name FROM audit_logs al LEFT JOIN users u ON al.user_id = u.id WHERE al.action = $1 ORDER BY al.created_at DESC LIMIT 100'
      : 'SELECT al.*, u.name as user_name FROM audit_logs al LEFT JOIN users u ON al.user_id = u.id ORDER BY al.created_at DESC LIMIT 100'
    
    const params = action && action !== 'all' ? [action] : []
    const result = await pool.query(query, params)
    
    res.json({ logs: result.rows })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// ═══════════════════════════════════════════════════════════════
// START
// ═══════════════════════════════════════════════════════════════

async function start() {
  try {
    await initDatabase()
    await seedDemoData()
    
    app.listen(PORT, () => {
      console.log(`🚀 Server: http://localhost:${PORT}`)
      console.log(`📊 Database: PostgreSQL`)
      console.log(`🔐 Auth: JWT`)
    })
  } catch (err) {
    console.error('Failed to start:', err)
    process.exit(1)
  }
}

start()
