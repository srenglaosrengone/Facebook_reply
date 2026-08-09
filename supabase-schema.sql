-- Supabase SQL Schema for Facebook Page Manager SaaS

-- 1. Facebook Pages Table
CREATE TABLE facebook_pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    page_id TEXT NOT NULL,
    page_name TEXT NOT NULL,
    access_token TEXT NOT NULL, -- You might want to encrypt this in production
    auto_reply_enabled BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, page_id)
);

-- Enable RLS for facebook_pages
ALTER TABLE facebook_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own pages."
ON facebook_pages FOR SELECT
USING ( auth.uid() = user_id );

CREATE POLICY "Users can insert their own pages."
ON facebook_pages FOR INSERT
WITH CHECK ( auth.uid() = user_id );

CREATE POLICY "Users can update their own pages."
ON facebook_pages FOR UPDATE
USING ( auth.uid() = user_id )
WITH CHECK ( auth.uid() = user_id );

CREATE POLICY "Users can delete their own pages."
ON facebook_pages FOR DELETE
USING ( auth.uid() = user_id );

-- 2. Reply Rules Table
CREATE TABLE reply_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_id UUID REFERENCES facebook_pages(id) ON DELETE CASCADE,
    keyword TEXT NOT NULL,
    reply_message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for reply_rules
ALTER TABLE reply_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view rules for their pages."
ON reply_rules FOR SELECT
USING ( EXISTS (
    SELECT 1 FROM facebook_pages 
    WHERE facebook_pages.id = reply_rules.page_id 
    AND facebook_pages.user_id = auth.uid()
) );

CREATE POLICY "Users can insert rules for their pages."
ON reply_rules FOR INSERT
WITH CHECK ( EXISTS (
    SELECT 1 FROM facebook_pages 
    WHERE facebook_pages.id = reply_rules.page_id 
    AND facebook_pages.user_id = auth.uid()
) );

CREATE POLICY "Users can update rules for their pages."
ON reply_rules FOR UPDATE
USING ( EXISTS (
    SELECT 1 FROM facebook_pages 
    WHERE facebook_pages.id = reply_rules.page_id 
    AND facebook_pages.user_id = auth.uid()
) );

CREATE POLICY "Users can delete rules for their pages."
ON reply_rules FOR DELETE
USING ( EXISTS (
    SELECT 1 FROM facebook_pages 
    WHERE facebook_pages.id = reply_rules.page_id 
    AND facebook_pages.user_id = auth.uid()
) );

-- 3. Reply Logs Table
CREATE TABLE reply_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_id UUID REFERENCES facebook_pages(id) ON DELETE CASCADE,
    comment_id TEXT NOT NULL,
    sender_id TEXT NOT NULL,
    comment_text TEXT NOT NULL,
    reply_sent TEXT,
    status TEXT NOT NULL, -- 'success', 'error', 'ignored'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for reply_logs
ALTER TABLE reply_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view logs for their pages."
ON reply_logs FOR SELECT
USING ( EXISTS (
    SELECT 1 FROM facebook_pages 
    WHERE facebook_pages.id = reply_logs.page_id 
    AND facebook_pages.user_id = auth.uid()
) );
