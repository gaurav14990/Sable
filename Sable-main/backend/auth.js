import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DATA_DIR = path.join(__dirname, 'data')
const USERS_FILE = path.join(DATA_DIR, 'users.json')
const JWT_SECRET = process.env.JWT_SECRET || 'sable-secret-jwt-key-2026'

// Ensure data directory and users.json exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2), 'utf-8')
}

function readUsers() {
  try {
    const raw = fs.readFileSync(USERS_FILE, 'utf-8')
    return JSON.parse(raw || '[]')
  } catch (err) {
    console.error('Error reading users file:', err)
    return []
  }
}

function writeUsers(users) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8')
  } catch (err) {
    console.error('Error writing users file:', err)
  }
}

function sanitizeUser(user) {
  const { password, ...safeUser } = user
  return safeUser
}

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

export const handleRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body || {}

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' })
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'Email is required' })
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' })
    }

    const cleanEmail = email.trim().toLowerCase()
    const users = readUsers()

    if (users.some(u => u.email === cleanEmail)) {
      return res.status(409).json({ error: 'An account with this email already exists' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(cleanEmail)}`,
      createdAt: new Date().toISOString()
    }

    users.push(newUser)
    writeUsers(users)

    const token = generateToken(newUser)
    return res.status(201).json({
      message: 'Account created successfully',
      user: sanitizeUser(newUser),
      token
    })
  } catch (err) {
    console.error('Registration error:', err)
    return res.status(500).json({ error: 'Internal server error during registration' })
  }
}

export const handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body || {}

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const cleanEmail = email.trim().toLowerCase()
    const users = readUsers()
    const user = users.find(u => u.email === cleanEmail)

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const token = generateToken(user)
    return res.json({
      message: 'Logged in successfully',
      user: sanitizeUser(user),
      token
    })
  } catch (err) {
    console.error('Login error:', err)
    return res.status(500).json({ error: 'Internal server error during login' })
  }
}

export const handleDemoLogin = (req, res) => {
  try {
    const { provider = 'github' } = req.body || {}
    const demoNames = {
      github: { name: 'Alex Rivera', email: 'alex.rivera@github.demo' },
      google: { name: 'Elena Vance', email: 'elena.vance@google.demo' },
      quick: { name: 'Creative Designer', email: 'designer@sable.ai' }
    }

    const chosen = demoNames[provider] || demoNames.quick
    const users = readUsers()
    let user = users.find(u => u.email === chosen.email)

    if (!user) {
      user = {
        id: `usr_demo_${provider}_${Date.now()}`,
        name: chosen.name,
        email: chosen.email,
        password: 'demo_password_not_used',
        avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(chosen.email)}`,
        createdAt: new Date().toISOString()
      }
      users.push(user)
      writeUsers(users)
    }

    const token = generateToken(user)
    return res.json({
      message: `Logged in via ${provider.toUpperCase()}`,
      user: sanitizeUser(user),
      token
    })
  } catch (err) {
    console.error('Demo login error:', err)
    return res.status(500).json({ error: 'Failed to authenticate demo user' })
  }
}

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization token required' })
  }

  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    const users = readUsers()
    const user = users.find(u => u.id === decoded.id)
    if (!user) {
      return res.status(401).json({ error: 'User no longer exists' })
    }
    req.user = sanitizeUser(user)
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

export const handleMe = (req, res) => {
  return res.json({ user: req.user })
}
