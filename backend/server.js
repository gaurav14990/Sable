import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '.env') })

import express from 'express'
import cors from 'cors'
import { generate, modelList } from './ai.js'

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

// Support both routes with and without /api prefix (for local and Vercel serverless rewrites)
app.get('/models', handleModels)
app.get('/api/models', handleModels)

app.post('/generate', handleGenerate)
app.post('/api/generate', handleGenerate)

const port = process.env.PORT || 3001
app.listen(port, () => {
  console.log(`Backend running on port ${port}`)
})
