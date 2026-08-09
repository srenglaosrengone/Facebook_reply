# Facebook Page Manager SaaS

This is a production-ready Next.js application that automates Facebook Page comment replies using the Facebook Graph API, Webhooks, and Supabase.

## Features

- Login with Facebook (Supabase Auth).
- Connect Facebook Pages.
- Manage pages and toggle auto-reply.
- Configure keyword-based reply rules.
- Facebook Webhooks integration for real-time comment tracking.
- Automated comment replies via Graph API.
- Dashboard with recent activity logs.

## Setup Instructions

### 1. Supabase Setup

1. Create a new project on [Supabase](https://supabase.com).
2. Go to **Project Settings -> API** and copy your `Project URL`, `anon public key`, and `service_role secret`.
3. In AI Studio, add these to your Secrets or Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Go to **SQL Editor** in Supabase and run the SQL script found in `supabase-schema.sql` to create the necessary tables and Row Level Security (RLS) policies.

### 2. Facebook Developer Console Setup

1. Go to [Facebook Developers](https://developers.facebook.com/) and create a new App (Type: Business).
2. Under **Add products to your app**, set up **Facebook Login** and **Webhooks**.
3. In **App Settings -> Basic**, copy the `App ID` and `App Secret`.
4. Add these to your AI Studio Secrets:
   - `FACEBOOK_APP_ID`
   - `FACEBOOK_APP_SECRET`

### 3. Supabase Auth Configuration (Facebook Login)

1. In Supabase, go to **Authentication -> Providers -> Facebook**.
2. Enable Facebook provider.
3. Enter your `Facebook App ID` and `Facebook App Secret`.
4. Copy the **Callback URL (for OAuth)** provided by Supabase (e.g., `https://<project-id>.supabase.co/auth/v1/callback`).
5. Go back to Facebook Developer Console -> **Facebook Login -> Settings**.
6. Paste the Supabase Callback URL into **Valid OAuth Redirect URIs**.

### 4. Facebook Webhooks Setup

To receive real-time comments, you must configure Facebook Webhooks.

1. Choose a secret string for verification (e.g., `my_secret_verify_token_123`) and add it to AI Studio Secrets as `FACEBOOK_VERIFY_TOKEN`.
2. In Facebook Developer Console, go to **Webhooks**.
3. Select **Page** from the dropdown and click **Subscribe to this object**.
4. Set the **Callback URL** to: `https://<YOUR_AI_STUDIO_APP_URL>/api/webhooks/facebook`
5. Set the **Verify Token** to the exact string you chose above.
6. Once subscribed, click **Subscribe** on the `feed` field. (This listens for comments).
7. *Note*: To get this working in production, your Facebook app will require App Review for the `pages_manage_engagement` and `pages_read_engagement` permissions, as well as the `feed` webhook field.

### 5. Deployment

The application is fully compatible with Next.js standard hosting environments, including Vercel and Google Cloud Run (AI Studio's runtime).

## Environment Variables Recap

```env
NEXT_PUBLIC_SUPABASE_URL="your_supabase_project_url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"
SUPABASE_SERVICE_ROLE_KEY="your_supabase_service_role_key"
FACEBOOK_APP_ID="your_facebook_app_id"
FACEBOOK_APP_SECRET="your_facebook_app_secret"
FACEBOOK_VERIFY_TOKEN="your_custom_webhook_verify_token"
```
