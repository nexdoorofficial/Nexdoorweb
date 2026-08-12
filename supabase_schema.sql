-- =========================================================================
-- SUPABASE DATABASE MIGRATION SCRIPT FOR NEXDOOR WEB APPLICATION
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard)
-- Project ID: zavdaottweujphpvgkce
-- =========================================================================

-- 1. Create 'bookings' table
CREATE TABLE IF NOT EXISTS public.bookings (
  id TEXT PRIMARY KEY,
  reference_id TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  address TEXT,
  area TEXT,
  pincode TEXT,
  service_id TEXT,
  service_name TEXT,
  category_or_package TEXT,
  scheduled_date TEXT,
  scheduled_time TEXT,
  estimated_total NUMERIC DEFAULT 0,
  deposit_paid NUMERIC DEFAULT 199,
  status TEXT DEFAULT 'pending',
  assigned_staff TEXT DEFAULT 'Unassigned',
  assigned_technician TEXT DEFAULT 'Unassigned',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS and public access policy for bookings
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public access on bookings" ON public.bookings;
CREATE POLICY "Public access on bookings" ON public.bookings FOR ALL USING (true) WITH CHECK (true);


-- 2. Create 'inquiries' table
CREATE TABLE IF NOT EXISTS public.inquiries (
  id TEXT PRIMARY KEY,
  reference_id TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  service_interest TEXT,
  message TEXT,
  status TEXT DEFAULT 'new',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public access on inquiries" ON public.inquiries;
CREATE POLICY "Public access on inquiries" ON public.inquiries FOR ALL USING (true) WITH CHECK (true);


-- 3. Create 'job_applications' table
CREATE TABLE IF NOT EXISTS public.job_applications (
  id TEXT PRIMARY KEY,
  reference_id TEXT NOT NULL,
  applicant_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  location TEXT,
  qualification TEXT,
  position_applied TEXT,
  job_id TEXT,
  status TEXT DEFAULT 'new',
  notes TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public access on job_applications" ON public.job_applications;
CREATE POLICY "Public access on job_applications" ON public.job_applications FOR ALL USING (true) WITH CHECK (true);


-- 4. Create 'site_settings' table
CREATE TABLE IF NOT EXISTS public.site_settings (
  id INT PRIMARY KEY DEFAULT 1,
  logo_url TEXT,
  favicon_url TEXT,
  support_phone TEXT,
  support_email TEXT,
  operating_hours TEXT,
  stat_cleaned_count TEXT,
  stat_cleaned_label TEXT,
  stat_rating TEXT,
  stat_rating_label TEXT,
  stat_hubs_count TEXT,
  stat_hubs_label TEXT,
  stat_eco_percent TEXT,
  stat_eco_label TEXT,
  header_menu JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public access on site_settings" ON public.site_settings;
CREATE POLICY "Public access on site_settings" ON public.site_settings FOR ALL USING (true) WITH CHECK (true);

-- Insert initial site_settings row if not present
INSERT INTO public.site_settings (id, support_phone, support_email, operating_hours)
VALUES (1, '+91 98765 43210', 'support@nexdoorclean.com', 'Monday - Sunday: 07:00 AM - 09:00 PM')
ON CONFLICT (id) DO NOTHING;
