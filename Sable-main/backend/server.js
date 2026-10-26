import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { generate, modelList } from './ai.js'
import {
  handleRegister,
  handleLogin,
  handleDemoLogin,
  handleMe,
  authMiddleware
} from './auth.js'

const app = express()
app.use(cors())
app.use(express.json())

const handleModels = (req, res) => {
  res.json(modelList)
}

const handleGenerate = async (req, res) => {
  const { model, history, prompt } = req.body
  try {
    const result = await generate(model, history || [], prompt)
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Model & Generation routes
app.get('/models', handleModels)
app.get('/api/models', handleModels)

app.post('/generate', handleGenerate)
app.post('/api/generate', handleGenerate)

// Authentication routes
app.post('/auth/register', handleRegister)
app.post('/api/auth/register', handleRegister)

app.post('/auth/login', handleLogin)
app.post('/api/auth/login', handleLogin)

app.post('/auth/demo', handleDemoLogin)
app.post('/api/auth/demo', handleDemoLogin)

app.get('/auth/me', authMiddleware, handleMe)
app.get('/api/auth/me', authMiddleware, handleMe)

const port = process.env.PORT || 3001
app.listen(port, () => {
  console.log(`Backend running on port ${port}`)
})

