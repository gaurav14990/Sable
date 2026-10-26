import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '.env') })

const SYSTEM = `You are an elite Staff UI/UX Designer and Frontend Engineer (Linear, Apple, Vercel, Stripe). You possess maxed-out UI/UX design skills. You NEVER output generic AI-slop, NEVER use tacky neon gradients, and NEVER output broken images.

OUTPUT FORMAT:
Return ONLY a single complete, self-contained HTML file with all CSS inside <style> and all JavaScript inside <script>.
Start directly with <!DOCTYPE html>. No markdown code blocks, no explanations, no text outside the HTML.

DESIGN PHILOSOPHY & RULES (STRICT):
1. AESTHETICS — ULTRA-CLEAN MODERN MINIMALISM:
   - Background: Deep obsidian/zinc (#09090b or #0b0f17).
   - Glassmorphism & Cards: Dark card surfaces (#11131a, #181924, or rgba(255,255,255,0.03)) with razor-thin borders (1px solid rgba(255,255,255,0.08) or rgba(255,255,255,0.12) on hover).
   - NO TACKY GRADIENTS: No rainbow or harsh neon gradients. Use sleek monochromatic styling with subtle, tasteful accents (cool indigo #6366f1, cyan #38bdf8, emerald #10b981, or pure crisp white #ffffff with subtle shadows).

2. TYPOGRAPHY (CRITICAL):
   - Always load modern fonts via Google Fonts in <head>:
     <link rel="preconnect" href="https://fonts.googleapis.com">
     <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
     <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
   - Base font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif.
   - Headings: tight letter-spacing (-0.03em to -0.04em), lineHeight: 1.15, crisp weight (700 or 800).
   - Body: #94a3b8 or #a1a1aa, lineHeight: 1.6, letter-spacing: -0.01em.
   - Micro-labels/Badges: font-size 11-13px, font-weight 600, uppercase letter-spacing 0.08em.

3. NEVER OUTPUT BROKEN IMAGES (ZERO TOLERANCE):
   - NEVER use placeholder text in <img> src.
   - NEVER output <img src=""> or <img alt="something"> without a working URL.
   - If using images, ONLY use valid, verified Unsplash direct URLs with real query params:
     * Gym / Fitness: https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80
     * Coffee / Cafe: https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80
     * Tech / SaaS: https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80
     * Architecture / Modern: https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80
     * Food / Restaurant: https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80
   - When in doubt, prefer beautiful inline SVG icons, Bento metric stat cards, and interactive UI widgets instead of images.

4. PAGE ARCHITECTURE (MUST INCLUDE):
   - Floating Navbar: Sticky/fixed top navigation with logo, nav links (with hover state), and pill CTA button. Backdrop-blur: 16px.
   - Hero Section:
     * Pill badge (e.g., <div class="badge"><span>✦</span> Next-Gen Platform</div>).
     * High-impact headline with tight tracking.
     * Compelling subheadline.
     * Dual CTA buttons (Primary solid white/accent button + Secondary glass/ghost button).
   - Social Proof / Metrics Bar: 3-4 impressive live metrics (e.g., "99.9% Uptime", "50k+ Active Users", "4.9/5 Rating").
   - Interactive Bento Grid or Features Section:
     * Clean cards with subtle border highlight on hover.
     * At least ONE interactive component with WORKING JavaScript: e.g., interactive tab switcher, interactive pricing toggle (Monthly vs Annual), interactive calculator, or live filter.
   - Minimalist Footer: columns with links, copyright, and subtle live status dot (green dot + "All systems operational").

5. CSS RESET & FLUID RESPONSIVENESS:
   - Always include:
     *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
     html { scroll-behavior: smooth; background: #09090b; color: #f4f4f5; }
     body { min-height: 100vh; overflow-x: hidden; font-family: 'Plus Jakarta Sans', sans-serif; }
   - Buttons: cursor: pointer, border-radius: 9999px or 12px, smooth transitions: all 0.2s cubic-bezier(0.16, 1, 0.3, 1).

6. STRICT NO-COMMENT RULE (MANDATORY):
   - NEVER write comments in the code.
   - NO HTML comments (<!-- ... -->).
   - NO CSS comments (/* ... */).
   - NO JavaScript comments (// or /* ... */).
   - Output 100% pure, clean code with zero comments.

7. IN-PAGE ANCHOR LINKS (MANDATORY):
   - All navigation links in the navbar, header, and buttons MUST use in-page hash anchors (e.g., href="#features", href="#pricing", href="#contact").
   - NEVER use relative routes like href="/" or href="/features" or empty hrefs.`

function cleanHtml(raw) {
  if (!raw) return ''
  let cleaned = raw.trim()
  if (cleaned.startsWith('```html')) {
    cleaned = cleaned.replace(/^```html\s*/i, '').replace(/\s*```$/, '')
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '')
  }
  cleaned = cleaned
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[ \t])\/\/[^\r\n]*/gm, '$1')
  return cleaned.trim()
}

async function openaiCall(url, key, model, messages) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ model, messages, max_tokens: 8192 })
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    console.error(`[${model}] ${res.status}:`, err?.error?.message || err?.message || '')
    throw new Error(`${res.status}`)
  }
  const data = await res.json()
  return data.choices[0].message.content
}

async function geminiCall(messages) {
  const text = messages.map(m => `${m.role}: ${m.content}`).join('\n')
  const models = ['gemini-2.5-flash', 'gemini-3.6-flash']

  for (const model of models) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text }] }] })
        }
      )
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        console.error(`[gemini] ${model} ${res.status}:`, JSON.stringify(err))
        continue
      }
      const data = await res.json()
      const output = data?.candidates?.[0]?.content?.parts?.[0]?.text
      if (output) return output
    } catch (e) {
      console.error(`[gemini] ${model} error:`, e.message)
    }
  }

  throw new Error('Gemini generation failed')
}

// Backward compatibility alias map
const legacyAliasMap = {
  'nvidia-llama': 'openrouter-llama',
  'mistral-small': 'mistral-codestral',
  'mistral-large': 'mistral-7b'
}

const providers = [
  {
    id: 'groq-gpt120b',
    label: 'GPT-OSS 120B (Groq)',
    fn: (m) => openaiCall('https://api.groq.com/openai/v1/chat/completions', process.env.GROQ_KEY, 'openai/gpt-oss-120b', m)
  },
  {
    id: 'groq-gpt20b',
    label: 'GPT-OSS 20B (Groq)',
    fn: (m) => openaiCall('https://api.groq.com/openai/v1/chat/completions', process.env.GROQ_KEY, 'openai/gpt-oss-20b', m)
  },
  {
    id: 'groq-qwen',
    label: 'Qwen 3 27B (Groq)',
    fn: (m) => openaiCall('https://api.groq.com/openai/v1/chat/completions', process.env.GROQ_KEY, 'qwen/qwen3.8-27b', m)
  },
  {
    id: 'mistral-codestral',
    label: 'Codestral (Mistral)',
    fn: (m) => openaiCall('https://api.mistral.ai/v1/chat/completions', process.env.MISTRAL_KEY, 'codestral-latest', m)
  },
  {
    id: 'mistral-7b',
    label: 'Mistral 7B (Mistral)',
    fn: (m) => openaiCall('https://api.mistral.ai/v1/chat/completions', process.env.MISTRAL_KEY, 'open-mistral-7b', m)
  },
  {
    id: 'gemini-flash',
    label: 'Gemini Flash (Google)',
    fn: (m) => geminiCall(m)
  },
  {
    id: 'openrouter-deepseek',
    label: 'DeepSeek V3 (OpenRouter)',
    fn: (m) => openaiCall('https://openrouter.ai/api/v1/chat/completions', process.env.OPENROUTER_KEY, 'deepseek/deepseek-chat-v3-0324', m)
  },
  {
    id: 'openrouter-llama',
    label: 'Llama 3.3 70B (OpenRouter)',
    fn: (m) => openaiCall('https://openrouter.ai/api/v1/chat/completions', process.env.OPENROUTER_KEY, 'meta-llama/llama-3.3-70b-instruct', m)
  }
]

export async function generate(selectedId, history, prompt) {
  const targetId = legacyAliasMap[selectedId] || selectedId
  const messages = [
    { role: 'system', content: SYSTEM },
    ...history,
    { role: 'user', content: prompt }
  ]

  const startIndex = providers.findIndex(p => p.id === targetId)
  const order = [
    ...providers.slice(startIndex === -1 ? 0 : startIndex),
    ...providers.slice(0, startIndex === -1 ? 0 : startIndex)
  ]

  for (const provider of order) {
    console.log(`Trying: ${provider.label}`)
    try {
      const rawHtml = await provider.fn(messages)
      const html = cleanHtml(rawHtml)
      console.log(`Success: ${provider.label}`)
      return { html, usedProvider: provider.label }
    } catch (e) {
      console.log(`Failed: ${provider.label} — ${e.message}`)
      continue
    }
  }

  throw new Error('All providers failed')
}

export const modelList = providers.map(p => ({ id: p.id, label: p.label }))
