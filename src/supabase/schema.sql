-- Paste this in your Supabase SQL Editor to run

-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
    id UUID PRIMARY KEY,
    phone_number TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) for patients
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Patients can view own record" ON patients FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own record" ON patients FOR INSERT WITH CHECK (auth.uid() = id);

-- Create staff_accounts table
CREATE TABLE IF NOT EXISTS staff_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'staff' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for staff
ALTER TABLE staff_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff can view own record" ON staff_accounts FOR SELECT USING (auth.uid() = id);

-- Optionally insert an admin staff account for testing (password 'admin123', hashed using bcrypt/pgcrypto ideally)
-- Note: actual password hashing should be handled through Supabase auth or a server API, this is just arbitrary if you want a raw login
-- INSERT INTO staff_accounts (staff_id, password_hash, role) VALUES ('admin', 'admin123_hash_placeholder', 'admin');
