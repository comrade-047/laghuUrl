# laghuUrl 🚀

**laghuUrl** (from Sanskrit *"laghu"*, meaning short or light) is a modern, full-stack URL shortening service built with the **Next.js App Router**.  
It provides a seamless, server-rendered experience for creating, managing, and analyzing short links, complete with:

- Robust multi-provider authentication system
- Dynamic dashboard
- Advanced features like QR code generation & link analytics

---

## 🔧 Tech Stack

### Frontend
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Charting:** Chart.js & Recharts
- **Forms:** React Hook Form + Zod

### Backend & Infrastructure
- **Runtime:** Node.js (within Next.js)
- **Database:** Supabase (PostgreSQL)
- **ORM:** Prisma
- **Authentication:** NextAuth.js
- **Email (OTP):** Resend
- **Web Scraping:** Cheerio

### Deployment
- **Application:** Vercel
- **Database:** Supabase

---

## 📁 Project Architecture

The app is structured using the **Next.js App Router** for co-located server and frontend logic.

```
.
├── prisma/                 # Prisma schema for the database
│   └── schema.prisma
│
├── public/                 # Static assets (images, logos)
│
├── src/                    # Main source code
│   ├── app/                # Next.js App Router pages and layouts
│   │   ├── (site)/         # Route group for public pages (e.g., homepage)
│   │   ├── (auth)
│   │   ├── [slug]          # for intercepting the custom links 
│   │   ├── dashboard/      # Protected routes for the user dashboard
│   │   ├── api/            # All backend API endpoints
│   │   └── layout.tsx   
│   │   └── global.css      
│   │
│   ├── components/         # Reusable React components
│   │   ├── dashboard/
│   │   ├── forms/
│   │   └── layout/
│   │   ├── landing
│   │   └── providers
│   │   ├── ui
│   │
│   ├── lib/                # Core logic, utilities, and configs (auth.ts, prisma.ts)
│   └── types/              # TypeScript type definitions (e.g., next-auth.d.ts)
│
└── middleware.ts           # Handles authentication checks and redirects
```

---

## ✨ Features

✅ **Multi-Provider Authentication**  
- Secure sign-up & login with Google, GitHub, or username/password + email OTP.

✅ **Dynamic Dashboard**  
- Real-time stats: total links, clicks, and a table of recent activity.

✅ **Advanced Link Management**  
- Custom Slugs (limit 5 per user)  
- Custom Expiration  
- Edit Destination  
- Secure Deletion (with confirmation)

✅ **Detailed Analytics Page**  
- Clicks Over Time chart  
- Destination page metadata preview (title, description, image)

✅ **QR Code Generation**  
- Generate & download high-quality **SVG QR codes**

✅ **Smart Previews & Validation**  
- OG Tag Preview  
- Live URL availability check

✅ **Modern UI/UX**  
- Responsive design  
- Hover-to-expand sidebar  
- Dark mode  
- Toast notifications

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js (v18+)
- npm, yarn, or pnpm
- Supabase account
- Google & GitHub OAuth credentials
- Resend API key

### Setup

Clone the repo:
```bash
git clone https://github.com/comrade-047/laghuUrl.git
cd laghuUrl
```

Install dependencies:
```bash
npm install
```

Set up environment variables:  
Create a `.env` file in the root:

```env
# Database URL from Supabase
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.project-ref.supabase.co:5432/postgres"

# NextAuth.js
NEXTAUTH_SECRET="YOUR_GENERATED_SECRET"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="YOUR_GOOGLE_CLIENT_ID"
GOOGLE_CLIENT_SECRET="YOUR_GOOGLE_CLIENT_SECRET"

# GitHub OAuth
GITHUB_CLIENT_ID="YOUR_GITHUB_CLIENT_ID"
GITHUB_CLIENT_SECRET="YOUR_GITHUB_CLIENT_SECRET"

# Resend (Email OTP)
RESEND_API_KEY="re_..."
EMAIL_FROM="onboarding@resend.dev"

# Public App URL
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

Sync the database schema:
```bash
npx prisma db push
```

Run the application:
```bash
npm run dev
```

Your app is now live at:

- Frontend → [http://localhost:3000](http://localhost:3000)  
- Backend API → [http://localhost:3000/api](http://localhost:3000/api)

---

## 🧪 Future Enhancements
- **Team/Organization Support** – Shared links within orgs  
- **Custom Domains** – Branded short links  
- **Advanced Analytics** – Referrers, geo, device info  
- **Public API** – Allow developer integrations  

---

