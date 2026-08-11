# Facebook Page Manager SaaS

A modern SaaS application that automatically replies to comments on your Facebook Pages based on keyword rules.

## Features

- **Facebook Page Access Token-only architecture**: Securely connect pages using long-lived access tokens without needing full Facebook Login OAuth.
- **Rule-based Auto Replies**: Define keyword triggers to automatically reply to comments.
- **Supabase Authentication & Database**: Built on a secure Supabase backend with Row Level Security.
- **Modern Dashboard**: Responsive and clean UI built with Next.js App Router and Tailwind CSS.

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Supabase (Auth, Postgres, RLS)
- Facebook Graph API & Webhooks

## Prerequisites

- Node.js 18+
- Supabase Project
- Facebook Developer App (with Webhooks enabled)

## Local Development Instructions

1. **Clone the repository and install dependencies**
   ```bash
   npm install
   ```

2. **Set up Supabase Database**
   - Go to your Supabase project's SQL Editor.
   - Run the SQL queries from `supabase-schema.sql` to create tables and RLS policies.

3. **Configure Environment Variables**
   - Copy `.env.example` to `.env.local`:
     ```bash
     cp .env.example .env.local
     ```
   - Fill in your Supabase details (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`).
   - Fill in your Facebook Developer details.

4. **Run the development server**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

5. **Facebook Webhook Setup (Local Testing)**
   - Use a tunneling tool like Ngrok or Cloudflare Tunnels to expose your local environment.
   - Example: `ngrok http 3000`
   - Use the Ngrok URL for your Supabase "Site URL" and Facebook Webhook "Callback URL".

## Vercel Deployment Instructions

1. Push your code to a GitHub repository.
2. Log in to Vercel and click "Add New... > Project".
3. Import your GitHub repository.
4. Expand the "Environment Variables" section.
5. Add all the variables from your `.env.local` file.
6. Click "Deploy".
7. Once deployed, take your Vercel production URL and update:
   - Supabase Site URL (Authentication > URL Configuration)
   - Facebook Webhook Callback URL (e.g., `https://your-vercel-domain.com/api/webhooks/facebook`)

## Security Notes

- Facebook Page Access Tokens are never exposed to the client browser after they are securely saved.
- Row Level Security (RLS) guarantees that users can only access their own Facebook Pages, rules, comments, and logs.
- Server-side Next.js API routes handle all interactions with the Facebook Graph API to prevent credential leakage.
