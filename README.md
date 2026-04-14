# 📚 ParentPal — AI Homework Helper for Indian Parents

> Photo in → Step-by-step bilingual answer out in 30 seconds  
> Built with Next.js · Claude Vision AI · PWA · English + Hindi

---

## 🚀 Quick Setup (5 Steps)

### Step 1 — Get your API key
Go to [console.anthropic.com](https://console.anthropic.com/settings/keys) and create a free API key.

### Step 2 — Set the environment variable

**Local development:**
```bash
cp .env.local.example .env.local
# Edit .env.local and paste your key:
# ANTHROPIC_API_KEY=sk-ant-api03-...
```

**Vercel (recommended hosting):**
1. Go to your Vercel project → Settings → Environment Variables
2. Add: `ANTHROPIC_API_KEY` = your key

**Replit:**
1. Go to your Repl → Secrets (🔒 icon)
2. Add key: `ANTHROPIC_API_KEY`, value: your key

### Step 3 — Install dependencies
```bash
npm install
```
This also automatically generates the app icons.

### Step 4 — Run locally
```bash
npm run dev
# Open http://localhost:3000
```

### Step 5 — Deploy
```bash
# Vercel (one-click):
npx vercel --prod

# Or push to GitHub and connect to Vercel for automatic deploys
```

---

## ✨ Features

| Feature | Status |
|---|---|
| 📸 Photo upload (camera + gallery) | ✅ |
| 🧠 AI Vision homework solving | ✅ |
| 📝 Step-by-step solution cards | ✅ |
| ✅ Prominent answer card | ✅ |
| 🧠 Child-friendly explanation | ✅ |
| 👨‍👩‍👧 Parent teaching script | ✅ |
| 🇬🇧 English ↔ 🇮🇳 Hindi toggle | ✅ |
| 📤 WhatsApp share (pre-formatted) | ✅ |
| 📋 Copy to clipboard | ✅ |
| 📱 PWA (installs from browser) | ✅ |
| 🔢 Auto subject detection | ✅ |
| 📋 Session history (last 5) | ✅ |
| 🎊 Confetti celebration | ✅ |
| ⚡ Image compression | ✅ |
| ❌ Friendly error screen | ✅ |
| 🌐 Offline shell | ✅ |

---

## 🏗 Project Structure

```
parentpal/
├── app/
│   ├── layout.js          ← Root layout, fonts, SW registration
│   ├── globals.css        ← Tailwind + custom animations
│   ├── page.js            ← Home screen
│   ├── upload/page.js     ← Upload + image preview
│   ├── result/page.js     ← Result screen (all cards, toggle, share)
│   └── api/analyze/
│       └── route.js       ← Claude Vision API proxy
├── public/
│   ├── manifest.json       ← PWA manifest
│   ├── sw.js             ← Service worker
│   └── icons/             ← Auto-generated PNG icons
├── scripts/
│   └── generate-icons.js  ← Pure-Node.js icon generator
├── .env.local.example     ← API key template
├── next.config.js
├── tailwind.config.js
└── package.json
```

---

## 🎨 Design System

| Token | Value |
|---|---|
| Brand Indigo | `#1E1B4B` |
| Brand Saffron | `#F59E0B` |
| Heading font | Baloo 2 (Google Fonts) |
| Body font | Nunito (Google Fonts) |
| Primary CTA | Saffron gradient button |
| Success | Emerald green |
| Steps | Amber gradient |
| Scripts | Saffron gradient |

---

## 🔑 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | ✅ Yes | Anthropic API key from console.anthropic.com |

---

## 📱 PWA Install

On Android Chrome: tap the **⋮ menu → Add to Home Screen**  
On iOS Safari: tap **Share → Add to Home Screen**  
On Desktop Chrome: click the install icon in the address bar

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| UI | React 18 + Tailwind CSS |
| AI | Anthropic Claude claude-sonnet-4-6 (Vision) |
| State | React useState + sessionStorage |
| PWA | manifest.json + service-worker.js |
| Hosting | Vercel / Replit (free tier) |
| Fonts | Baloo 2 + Nunito (Google Fonts) |
| Sharing | Web Share API + WhatsApp deep link |

---

## 🇮🇳 Hindi Quality

The AI prompt is tuned for conversational Devanagari Hindi:
- Everyday spoken Hindi — not textbook Sanskrit-heavy Hindi
- Familiar phrases: Beta, dekho, samjho, sochte hain
- Indian examples: chai, roti, cricket, rupees, mangoes, festivals
- Short sentences (max ~15 words)
- Always Devanagari script — never Romanised

---

*Built with ❤️ for Indian parents — parentpal.app*
