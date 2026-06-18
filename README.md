# Research Intelligence Platform

AI-powered research reports for journalists, podcasters, founders, students, and content creators. Research people, companies, topics, and events — get structured intelligence, not chatbot answers.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy environment variables
cp .env.example .env.local
# Then fill in your API keys (see below)

# 3. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Folder Structure

```
dream/
├── src/
│   ├── app/                      # Next.js App Router pages & API
│   │   ├── api/
│   │   │   ├── research/         # POST: generate report, GET [id]: fetch report
│   │   │   └── history/          # GET: search history
│   │   ├── research/
│   │   │   ├── [id]/page.tsx     # Results dashboard (saved reports)
│   │   │   └── latest/page.tsx   # Fallback when Supabase not configured
│   │   ├── layout.tsx            # Root layout (header, footer, theme)
│   │   ├── page.tsx              # Home / search page
│   │   └── globals.css           # Global styles + dark mode
│   ├── components/
│   │   ├── layout/               # Header, Footer
│   │   ├── search/               # SearchForm
│   │   ├── research/             # Report sections (Timeline, KeyFacts, etc.)
│   │   ├── history/              # SearchHistory sidebar
│   │   ├── ui/                   # Reusable UI (Card, Badge, ThemeToggle)
│   │   └── providers/            # ThemeProvider
│   ├── lib/
│   │   ├── gemini/               # Gemini API integration
│   │   ├── supabase/             # Supabase database helpers
│   │   └── utils/                # Utility functions (cn)
│   └── types/
│       └── research.ts           # TypeScript types for reports
├── supabase/
│   └── schema.sql                # Database schema (run in Supabase SQL Editor)
├── .env.example                  # Environment variable template
└── package.json
```

---

## Environment Variables

Create a `.env.local` file in the project root:

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | **Yes** | Google Gemini API key for AI research |
| `NEXT_PUBLIC_SUPABASE_URL` | Recommended | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Recommended | Supabase anonymous/public key |

Without Supabase, reports still generate but won't be saved to history.

---

## Setup: Gemini API

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Click **Create API Key**
4. Copy the key into `.env.local`:
   ```
   GEMINI_API_KEY=your_key_here
   ```

The app uses **Gemini 2.0 Flash** with **Google Search grounding** for real-time web research.

---

## Setup: Supabase

### Step 1 — Create a project

1. Go to [supabase.com](https://supabase.com) and sign up
2. Click **New Project**
3. Choose a name, password, and region
4. Wait for the project to finish provisioning (~2 minutes)

### Step 2 — Run the database schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the contents of `supabase/schema.sql` and paste it
4. Click **Run**

### Step 3 — Get your API keys

1. Go to **Project Settings → API**
2. Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
3. Copy **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Add both to `.env.local`

---

## Deployment (Vercel)

### Step 1 — Push to GitHub

```bash
git add .
git commit -m "Initial Research Intelligence Platform MVP"
git push origin main
```

### Step 2 — Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **Add New Project**
3. Import your GitHub repository
4. Vercel auto-detects Next.js — no config changes needed
5. Add environment variables in **Settings → Environment Variables**:
   - `GEMINI_API_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Click **Deploy**

Your app will be live at `https://your-project.vercel.app`

---

## How It Works

```
User enters query → API route → Gemini + Google Search → Structured JSON report
                                      ↓
                              Save to Supabase → Redirect to results dashboard
```

**Report sections generated:**
- Executive Summary
- Timeline of Important Events
- Key Facts
- Source List (with URLs)
- Related People, Companies & Topics
- Research Questions
- Interview Questions
- Deep-Dive Questions

---

## Future Improvements

| Feature | Description |
|---------|-------------|
| **User authentication** | Sign up / login to save personal research libraries |
| **PDF export** | Download reports as PDF for offline use |
| **Collaborative notes** | Add annotations and highlights to reports |
| **Compare mode** | Side-by-side comparison of two research subjects |
| **Scheduled research** | Auto-refresh reports on topics you follow |
| **Custom report templates** | Journalist, investor, or podcast-specific formats |
| **Source verification** | Cross-reference claims across multiple sources |
| **Team workspaces** | Share research with your team |
| **API access** | Programmatic access for integrations |
| **Multi-language** | Generate reports in different languages |

---

## Tech Stack

- **Next.js 16** — React framework with App Router
- **TypeScript** — Type safety
- **Tailwind CSS 4** — Styling
- **Supabase** — PostgreSQL database
- **Gemini 2.0 Flash** — AI research with Google Search
- **Vercel** — Deployment platform

---

## License

MIT
