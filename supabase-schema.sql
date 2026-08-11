-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create facebook_pages table
CREATE TABLE IF NOT EXISTS public.facebook_pages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid DEFAULT auth.uid() REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  page_id text NOT NULL,
  page_name text NOT NULL,
  page_username text,
  page_picture_url text,
  access_token text NOT NULL,
  is_active boolean DEFAULT true,
  auto_reply_enabled boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, page_id)
);

-- Create reply_rules table
CREATE TABLE IF NOT EXISTS public.reply_rules (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id text NOT NULL,
  user_id uuid DEFAULT auth.uid() REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  keyword text NOT NULL,
  reply_text text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create comments table
CREATE TABLE IF NOT EXISTS public.comments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id text NOT NULL,
  user_id uuid DEFAULT auth.uid() REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  facebook_comment_id text NOT NULL,
  facebook_user_id text,
  message text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create reply_logs table
CREATE TABLE IF NOT EXISTS public.reply_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id text NOT NULL,
  user_id uuid DEFAULT auth.uid() REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  comment_id uuid REFERENCES public.comments ON DELETE CASCADE,
  rule_id uuid REFERENCES public.reply_rules ON DELETE SET NULL,
  reply_text text NOT NULL,
  facebook_reply_id text,
  status text NOT NULL,
  error_message text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facebook_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reply_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reply_logs ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Facebook pages policies
CREATE POLICY "Users can view own facebook pages" 
  ON public.facebook_pages FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own facebook pages" 
  ON public.facebook_pages FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own facebook pages" 
  ON public.facebook_pages FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own facebook pages" 
  ON public.facebook_pages FOR DELETE 
  USING (auth.uid() = user_id);

-- Reply rules policies
CREATE POLICY "Users can view own reply rules" 
  ON public.reply_rules FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reply rules" 
  ON public.reply_rules FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reply rules" 
  ON public.reply_rules FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reply rules" 
  ON public.reply_rules FOR DELETE 
  USING (auth.uid() = user_id);

-- Comments policies
CREATE POLICY "Users can view own comments" 
  ON public.comments FOR SELECT 
  USING (auth.uid() = user_id);

-- Reply logs policies
CREATE POLICY "Users can view own reply logs" 
  ON public.reply_logs FOR SELECT 
  USING (auth.uid() = user_id);

-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();