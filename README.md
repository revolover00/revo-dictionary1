<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0A0A0A,0D1117,161B22,0D1117&height=200&section=header"/>
</div>

<br/>

<div align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Inter&size=28&duration=3000&pause=800&color=7F77DD&center=true&vCenter=true&width=600&lines=REVO+DICTIONARY;Smart+Dictionary+with+Supabase;Real-time+Sync+%7C+Auth+%7C+Cloud" alt="Typing SVG"/>
</div>

<br/>

<div align="center">
  <img src="https://img.shields.io/badge/📖_STATUS_📖-LIVE-7F77DD?style=for-the-badge&logoColor=white&labelColor=0A0A0A"/>
  <img src="https://img.shields.io/badge/🔄_VERSION_🔄-1.0.0-7F77DD?style=for-the-badge&labelColor=0A0A0A"/>
  <img src="https://img.shields.io/badge/📜_LICENSE_📜-MIT-7F77DD?style=for-the-badge&labelColor=0A0A0A"/>
  <img src="https://img.shields.io/github/stars/revolover00/revo-dictionary1?style=for-the-badge&logo=github&logoColor=7F77DD&color=7F77DD&labelColor=0A0A0A&label=⭐_STARS"/>
</div>

<br/>

<div align="center">
  <img src="https://img.shields.io/badge/TypeScript-0A0A0A?style=for-the-badge&logo=typescript&logoColor=white&labelColor=7F77DD"/>
  <img src="https://img.shields.io/badge/React-0A0A0A?style=for-the-badge&logo=react&logoColor=white&labelColor=7F77DD"/>
  <img src="https://img.shields.io/badge/Supabase-0A0A0A?style=for-the-badge&logo=supabase&logoColor=white&labelColor=7F77DD"/>
  <img src="https://img.shields.io/badge/Tailwind-0A0A0A?style=for-the-badge&logo=tailwindcss&logoColor=white&labelColor=7F77DD"/>
</div>

---

## ✦ WHAT IS REVO DICTIONARY?

| | |
|---|---|
| 📚 **Purpose** | Smart dictionary with real-time sync and cloud storage |
| 🔐 **Auth** | User accounts with Supabase authentication |
| ☁️ **Sync** | Your words sync automatically across all devices |
| ⚡ **Real-time** | Updates appear instantly for all users |

**Revo Dictionary** is not just a dictionary — it's a personal vocabulary builder. Save words, add definitions, create categories, and access your collection anywhere.

---

## ✦ FEATURES

| ICON | FEATURE | DESCRIPTION |
|:----:|:--------|:------------|
| 🔍 | **Smart Search** | Instant search through your vocabulary |
| ➕ | **Add Words** | Save new words with definitions and examples |
| 🏷️ | **Categories** | Organize words into custom categories |
| 🔄 | **Real-time Sync** | Changes appear instantly across devices |
| 🔐 | **User Auth** | Secure login with Supabase Auth |
| 🌙 | **Dark Theme** | Built-in dark mode for night studying |
| 📊 | **Statistics** | Track your vocabulary growth |
| 📱 | **Responsive** | Works on mobile, tablet, and desktop |

---

## ✦ TECH STACK

| CATEGORY | TECHNOLOGY |
|:---------|:-----------|
| Frontend | TypeScript · React · Vite |
| Styling | TailwindCSS · shadcn/ui · Framer Motion |
| Backend & DB | Supabase (PostgreSQL) |
| Authentication | Supabase Auth (Email/Password) |
| Real-time | Supabase Realtime Subscriptions |
| Deployment | Vercel |

---

## ✦ DATABASE SCHEMA

-- Words table
CREATE TABLE words (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  word TEXT NOT NULL,
  definition TEXT NOT NULL,
  example TEXT,
  category TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE words ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD their own words" ON words
  USING (auth.uid() = user_id);

---

## ✦ QUICK START

# Clone the repository
git clone https://github.com/revolover00/revo-dictionary1.git

# Navigate to project
cd revo-dictionary1

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Add your Supabase credentials in .env.local
# NEXT_PUBLIC_SUPABASE_URL=your_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key

# Start development server
npm run dev

# Build for production
npm run build

---

## ✦ ENVIRONMENT VARIABLES

VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

---

## ✦ PROJECT STRUCTURE

REVO-DICTIONARY/
├── src/
│   ├── components/
│   │   ├── SearchBar.tsx      # Instant word search
│   │   ├── WordCard.tsx       # Word display with definition
│   │   ├── AddWordForm.tsx    # Add new words
│   │   ├── CategoryFilter.tsx # Filter by category
│   │   ├── Auth.tsx           # Login/Signup
│   │   └── ui/                # shadcn/ui components
│   ├── lib/
│   │   ├── supabase.ts        # Supabase client
│   │   └── types.ts           # TypeScript interfaces
│   ├── hooks/
│   │   ├── useWords.ts        # Word CRUD operations
│   │   ├── useAuth.ts         # Authentication state
│   │   └── useRealtime.ts     # Real-time subscriptions
│   ├── styles/
│   │   └── globals.css
│   ├── App.tsx
│   └── main.tsx
├── public/
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── README.md

---

## ✦ API REFERENCE

| Endpoint | Method | Description |
|:---------|:------:|:------------|
| `/words` | GET | Fetch all words for current user |
| `/words` | POST | Add a new word |
| `/words/{id}` | PUT | Update a word |
| `/words/{id}` | DELETE | Delete a word |
| `/categories` | GET | Fetch user categories |
| `/categories` | POST | Create new category |

---

## ✦ ROADMAP

| STATUS | FEATURE |
|:------:|:--------|
| ✅ | Word CRUD operations |
| ✅ | User authentication |
| ✅ | Real-time sync |
| ✅ | Categories |
| ✅ | Dark mode |
| ⬜ | Flashcards for studying |
| ⬜ | Import/Export (CSV/JSON) |
| ⬜ | Pronunciation audio |
| ⬜ | Example sentences from API |
| ⬜ | Mobile app (React Native) |
| ⬜ | Share word lists with friends |

---

## ✦ PREVIEW

<p align="center">
  <a href="https://revo-dictionary.vercel.app" target="_blank">
    <img src="https://via.placeholder.com/900x500/0A0A0A/7F77DD?text=REVO+DICTIONARY+DEMO" alt="Revo Dictionary Preview" width="85%"/>
  </a>
  <br/>
  <sub>✨ Build your vocabulary — try it live ✨</sub>
</p>

---

## ✦ STATS

<p align="center">
  <img src="https://github-readme-stats.vercel.app/api/pin/?username=revolover00&repo=revo-dictionary1&theme=dark&bg_color=0A0A0A&border_color=7F77DD&title_color=7F77DD&text_color=AAAAAA&icon_color=7F77DD"/>
</p>

---

<div align="center">
  <samp>
    <b>✦ LEARN. SAVE. GROW. ✦</b>
  </samp>
</div>

<br/>

<div align="center">
  <sub>Built by <b>Baldwin · revolover00</b> | Revo Code 🔮</sub>
  <br/>
  <sub>Egypt → Worldwide</sub>
</div>

<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=7F77DD,0D1117,0A0A0A,000000&height=120&section=footer"/>
</div>
