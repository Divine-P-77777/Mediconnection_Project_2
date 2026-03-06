-- ============================================================
-- MEDICONNECTION: PRODUCTION MIGRATION
-- Run sections in order in Supabase SQL Editor
-- ============================================================


-- ============================================================
-- 1️⃣  FIX ENUM: Add missing 'health_center' to user_role
-- ============================================================
-- Current enum has: super_admin, admin, doctor, user
-- Missing: health_center (used everywhere in the app)
-- 'admin' is unused (app uses 'super_admin') — keep for backward compat

ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'health_center';


-- ============================================================
-- 2️⃣  ENABLE RLS ON ALL UNPROTECTED TABLES
-- ============================================================
-- Currently DISABLED on 8 tables — any authenticated user
-- can read/write ALL data through the anon key!

ALTER TABLE public.account_details_doctors    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_availability        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_services            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_center_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_center_services     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_appointments       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_liveconsult        ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- 3️⃣  RLS POLICIES: account_details_doctors
-- ============================================================

-- Doctor can read/update their own account
CREATE POLICY "doctor_read_own_account" ON public.account_details_doctors
  FOR SELECT USING (doctor_id = auth.uid());

CREATE POLICY "doctor_insert_own_account" ON public.account_details_doctors
  FOR INSERT WITH CHECK (doctor_id = auth.uid());

CREATE POLICY "doctor_update_own_account" ON public.account_details_doctors
  FOR UPDATE USING (doctor_id = auth.uid())
  WITH CHECK (doctor_id = auth.uid());

-- Super admin full access
CREATE POLICY "admin_full_account_doctors" ON public.account_details_doctors
  FOR ALL USING (is_super_admin()) WITH CHECK (is_super_admin());


-- ============================================================
-- 4️⃣  RLS POLICIES: appointments
-- ============================================================

-- User can read their own appointments
CREATE POLICY "user_read_own_appointments" ON public.appointments
  FOR SELECT USING (user_id = auth.uid());

-- Users can create appointments for themselves  
CREATE POLICY "user_create_appointment" ON public.appointments
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Health center can read appointments for their center
CREATE POLICY "hc_read_center_appointments" ON public.appointments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM health_centers hc
      WHERE hc.id = appointments.center_id
        AND hc.user_id = auth.uid()
    )
  );

-- Health center can update appointments (status changes)
CREATE POLICY "hc_update_center_appointments" ON public.appointments
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM health_centers hc
      WHERE hc.id = appointments.center_id
        AND hc.user_id = auth.uid()
    )
  );

-- Super admin full access
CREATE POLICY "admin_full_appointments" ON public.appointments
  FOR ALL USING (is_super_admin()) WITH CHECK (is_super_admin());


-- ============================================================
-- 5️⃣  RLS POLICIES: doctor_availability
-- ============================================================

-- Anyone can READ availability (for booking)
CREATE POLICY "public_read_availability" ON public.doctor_availability
  FOR SELECT USING (true);

-- Doctor can manage their own availability
CREATE POLICY "doctor_manage_own_availability" ON public.doctor_availability
  FOR INSERT WITH CHECK (doctor_id = auth.uid());

CREATE POLICY "doctor_update_own_availability" ON public.doctor_availability
  FOR UPDATE USING (doctor_id = auth.uid())
  WITH CHECK (doctor_id = auth.uid());

CREATE POLICY "doctor_delete_own_availability" ON public.doctor_availability
  FOR DELETE USING (doctor_id = auth.uid());

-- Super admin full access
CREATE POLICY "admin_full_doctor_availability" ON public.doctor_availability
  FOR ALL USING (is_super_admin()) WITH CHECK (is_super_admin());


-- ============================================================
-- 6️⃣  RLS POLICIES: doctor_services
-- ============================================================

-- Anyone can READ services (for browsing/booking)
CREATE POLICY "public_read_services" ON public.doctor_services
  FOR SELECT USING (true);

-- Doctor manages own services
CREATE POLICY "doctor_insert_own_service" ON public.doctor_services
  FOR INSERT WITH CHECK (doctor_id = auth.uid());

CREATE POLICY "doctor_update_own_service" ON public.doctor_services
  FOR UPDATE USING (doctor_id = auth.uid())
  WITH CHECK (doctor_id = auth.uid());

CREATE POLICY "doctor_delete_own_service" ON public.doctor_services
  FOR DELETE USING (doctor_id = auth.uid());

-- Super admin full access
CREATE POLICY "admin_full_doctor_services" ON public.doctor_services
  FOR ALL USING (is_super_admin()) WITH CHECK (is_super_admin());


-- ============================================================
-- 7️⃣  RLS POLICIES: health_center_availability
-- ============================================================

-- Anyone can READ (for booking)
CREATE POLICY "public_read_hc_availability" ON public.health_center_availability
  FOR SELECT USING (true);

-- Health center manages own availability
CREATE POLICY "hc_manage_own_availability" ON public.health_center_availability
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM health_centers hc
      WHERE hc.id = health_center_availability.health_center_id
        AND hc.user_id = auth.uid())
  );

CREATE POLICY "hc_update_own_availability" ON public.health_center_availability
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM health_centers hc
      WHERE hc.id = health_center_availability.health_center_id
        AND hc.user_id = auth.uid())
  );

CREATE POLICY "hc_delete_own_availability" ON public.health_center_availability
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM health_centers hc
      WHERE hc.id = health_center_availability.health_center_id
        AND hc.user_id = auth.uid())
  );

CREATE POLICY "admin_full_hc_availability" ON public.health_center_availability
  FOR ALL USING (is_super_admin()) WITH CHECK (is_super_admin());


-- ============================================================
-- 8️⃣  RLS POLICIES: health_center_services
-- ============================================================

-- Anyone can READ (for booking page)
CREATE POLICY "public_read_hc_services" ON public.health_center_services
  FOR SELECT USING (true);

-- Health center manages own services
CREATE POLICY "hc_insert_own_service" ON public.health_center_services
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM health_centers hc
      WHERE hc.id = health_center_services.health_center_id
        AND hc.user_id = auth.uid())
  );

CREATE POLICY "hc_update_own_service" ON public.health_center_services
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM health_centers hc
      WHERE hc.id = health_center_services.health_center_id
        AND hc.user_id = auth.uid())
  );

CREATE POLICY "hc_delete_own_service" ON public.health_center_services
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM health_centers hc
      WHERE hc.id = health_center_services.health_center_id
        AND hc.user_id = auth.uid())
  );

CREATE POLICY "admin_full_hc_services" ON public.health_center_services
  FOR ALL USING (is_super_admin()) WITH CHECK (is_super_admin());


-- ============================================================
-- 9️⃣  RLS POLICIES: payment_appointments
-- ============================================================

-- User can read their own payment records
CREATE POLICY "user_read_own_payment" ON public.payment_appointments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM appointments a
      WHERE a.id = payment_appointments.appointment_id
        AND a.user_id = auth.uid()
    )
  );

-- System inserts payments (service role only — no user insert policy)
-- Super admin full access
CREATE POLICY "admin_full_payment_appointments" ON public.payment_appointments
  FOR ALL USING (is_super_admin()) WITH CHECK (is_super_admin());


-- ============================================================
-- 🔟  RLS POLICIES: payment_liveconsult  
-- ============================================================

-- Doctor can read their own payout records
CREATE POLICY "doctor_read_own_payout" ON public.payment_liveconsult
  FOR SELECT USING (doctor_id = auth.uid());

-- Super admin full access
CREATE POLICY "admin_full_payment_liveconsult" ON public.payment_liveconsult
  FOR ALL USING (is_super_admin()) WITH CHECK (is_super_admin());


-- ============================================================
-- 1️⃣1️⃣  MISSING POLICY: liveconsult DELETE
-- ============================================================
-- liveconsult has SELECT, INSERT, UPDATE but no DELETE

CREATE POLICY "admin_delete_consult" ON public.liveconsult
  FOR DELETE USING (is_super_admin());


-- ============================================================
-- 1️⃣2️⃣  STORAGE POLICIES: documents bucket
-- ============================================================
-- Currently only has SELECT (download). Missing INSERT (upload).

-- Users can upload to their own folder: documents/{user_id}/...
CREATE POLICY "Users can upload own documents" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'documents'
    AND (auth.uid())::text = (storage.foldername(name))[1]
  );

-- Users can update their own documents
CREATE POLICY "Users can update own documents" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'documents'
    AND (auth.uid())::text = (storage.foldername(name))[1]
  );

-- Users can delete their own documents
CREATE POLICY "Users can delete own documents" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'documents'
    AND (auth.uid())::text = (storage.foldername(name))[1]
  );


-- ============================================================
-- 1️⃣3️⃣  SET FILE SIZE LIMIT ON DOCUMENTS BUCKET
-- ============================================================

UPDATE storage.buckets 
SET file_size_limit = 10485760,  -- 10 MB
    allowed_mime_types = ARRAY[
      'application/pdf',
      'image/jpeg', 'image/png', 'image/webp',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
WHERE id = 'documents';


-- ============================================================
-- 1️⃣4️⃣  PERFORMANCE INDEXES (missing from current schema)
-- ============================================================

-- appointments: frequent query by center_id + date
CREATE INDEX IF NOT EXISTS idx_appointments_center_date
  ON public.appointments (center_id, date);

-- appointments: frequent query by user_id
CREATE INDEX IF NOT EXISTS idx_appointments_user
  ON public.appointments (user_id);

-- liveconsult: frequent query by doctor_id + date
CREATE INDEX IF NOT EXISTS idx_liveconsult_doctor
  ON public.liveconsult (doctor_id, consultation_date);

-- liveconsult: frequent query by user_id
CREATE INDEX IF NOT EXISTS idx_liveconsult_user
  ON public.liveconsult (user_id);

-- doctor_availability: frequent query by doctor_id
CREATE INDEX IF NOT EXISTS idx_doctor_availability_doctor
  ON public.doctor_availability (doctor_id);

-- doctor_services: frequent query by doctor_id
CREATE INDEX IF NOT EXISTS idx_doctor_services_doctor
  ON public.doctor_services (doctor_id);

-- health_center_availability: frequent query by health_center_id
CREATE INDEX IF NOT EXISTS idx_hc_availability_hcid
  ON public.health_center_availability (health_center_id);

-- health_center_services: frequent query by health_center_id
CREATE INDEX IF NOT EXISTS idx_hc_services_hcid
  ON public.health_center_services (health_center_id);

-- profiles: lookup by role (used in admin queries)
CREATE INDEX IF NOT EXISTS idx_profiles_role
  ON public.profiles (role);

-- health_centers: lookup by approved status
CREATE INDEX IF NOT EXISTS idx_hc_approved
  ON public.health_centers (approved);

-- doctors: lookup by health_center_id
CREATE INDEX IF NOT EXISTS idx_doctors_hcid
  ON public.doctors (health_center_id);

-- payment_appointments: lookup by appointment_id
CREATE INDEX IF NOT EXISTS idx_payment_appt_id
  ON public.payment_appointments (appointment_id);


-- ============================================================
-- 1️⃣5️⃣  MISSING FOREIGN KEY: appointments.center_id → health_centers.id
-- ============================================================
-- appointments has user_id FK but no center_id FK

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'appointments_center_id_fkey'
      AND table_name = 'appointments'
  ) THEN
    ALTER TABLE public.appointments
      ADD CONSTRAINT appointments_center_id_fkey
      FOREIGN KEY (center_id) REFERENCES public.health_centers(id);
  END IF;
END $$;


-- ============================================================
-- DONE! Run this in Supabase SQL Editor.
-- If any statement fails, it's likely because a policy/index
-- with that name already exists — safe to skip that one.
-- ============================================================
