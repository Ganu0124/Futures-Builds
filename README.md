# FutureBuilds — Full-Stack Website

A complete full-stack technology company website built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## 🚀 Quick Start

### 1. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a free project
2. In the Supabase **SQL Editor**, run the contents of `supabase-setup.sql`
3. Go to **Project Settings → API** and copy:
   - Project URL
   - Anon (public) key
   - Service Role key

### 2. Configure Environment Variables

Edit `.env.local` with your real Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 3. Create Admin Account

In your Supabase dashboard:
- Go to **Authentication → Users**
- Click **"Add User"** → **"Create new user"**
- Enter your admin email and password
- That's it — use these credentials to log in at `/admin/login`

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
d:\company
├── app/
│   ├── page.tsx                    # Main homepage (public)
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                 # Design system & styles
│   ├── admin/
│   │   ├── layout.tsx              # Admin layout
│   │   ├── login/page.tsx          # Admin login
│   │   └── dashboard/page.tsx      # Admin dashboard
│   └── api/
│       ├── submit-project/route.ts # Form submission endpoint
│       └── admin/
│           ├── projects/route.ts   # CRUD for project requests
│           └── export/route.ts     # Excel export endpoint
├── lib/
│   ├── supabase.ts                 # Browser Supabase client
│   └── supabase-admin.ts           # Server-only admin client
├── proxy.ts                        # Auth protection for admin routes
├── supabase-setup.sql              # Database setup script
└── .env.local                      # Environment variables
```

---

## 🗃️ Database Schema

Table: `project_requests`

| Column | Type | Description |
|---|---|---|
| id | UUID | Auto-generated primary key |
| full_name | TEXT | Submitter's full name |
| email | TEXT | Email address |
| phone_number | TEXT | Phone number |
| project_title | TEXT | Title of the project |
| project_description | TEXT | Description of the project |
| status | TEXT | Default: `New Request` |
| created_at | TIMESTAMPTZ | Auto-set on insert |

---

## 🛡️ Routes

| Route | Access | Description |
|---|---|---|
| `/` | Public | Homepage with project request form |
| `/admin/login` | Public | Admin login page |
| `/admin/dashboard` | Protected | Admin dashboard |
| `/api/submit-project` | Public POST | Submit a project request |
| `/api/admin/projects` | Server | GET/PATCH/DELETE projects |
| `/api/admin/export` | Server | Download Excel export |

---

## ✅ Status Options

- **New Request** — Default on submission
- **Under Review** — Being evaluated
- **Contacted** — Client has been reached
- **In Progress** — Development started
- **Completed** — Project finished
- **Rejected** — Request declined

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS v4, Custom CSS Design System
- **Backend**: Next.js API Routes
- **Database**: Supabase PostgreSQL
- **Auth**: Supabase Auth
- **Excel Export**: xlsx library
