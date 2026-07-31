-- Create materials table
CREATE TABLE materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL, -- references auth.users(id) if using supabase auth
  title TEXT NOT NULL,
  pdf_url TEXT NOT NULL,
  extracted_text TEXT,
  status TEXT NOT NULL DEFAULT 'new', -- new, summarized, quizzed
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create material_summaries table
CREATE TABLE material_summaries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  material_id UUID NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
  summary_json JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quizzes table
CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  material_id UUID NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
  questions_json JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quiz_attempts table
CREATE TABLE quiz_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  material_id UUID NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  score INTEGER NOT NULL,
  answers_json JSONB NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create schedules table
CREATE TABLE schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  recurring TEXT, -- e.g., 'none', 'weekly'
  status TEXT NOT NULL DEFAULT 'upcoming', -- upcoming, done, missed
  linked_material_id UUID REFERENCES materials(id) ON DELETE SET NULL,
  reminded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Note: RLS (Row Level Security) policies should be added here to restrict access based on user_id 
-- if you plan to use Supabase Auth securely. For now, this is the basic schema.

-- ==========================================
-- STORAGE BUCKET SETUP
-- ==========================================
-- Create the 'materials' bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('materials', 'materials', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies to allow anyone to upload, read, and delete from this bucket
-- (This is for MVP/development. In production, restrict this to authenticated users only)
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'materials');
CREATE POLICY "Public Uploads" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'materials');
CREATE POLICY "Public Deletes" ON storage.objects FOR DELETE USING (bucket_id = 'materials');
CREATE POLICY "Public Updates" ON storage.objects FOR UPDATE USING (bucket_id = 'materials');
