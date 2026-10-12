-- ==============================================================================
-- PRODUCTION-GRADE ROW LEVEL SECURITY (RLS) POLICIES
-- Designed for Supabase Anon Key & Authenticated Sessions
-- Allows safe operation without requiring the Supabase service_role secret key
-- ==============================================================================

-- ==============================================================================
-- 1. HELPER FUNCTIONS (SECURITY DEFINER to prevent RLS recursion)
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'super_admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.current_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.profiles
  WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.get_my_health_center_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id
  FROM public.health_centers
  WHERE user_id = auth.uid()
  LIMIT 1;
$$;


-- ==============================================================================
-- 2. ENABLE RLS ON ALL 13 TABLES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_center_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_center_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.liveconsult ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.account_details_doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.account_details_healthcenter ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_liveconsult ENABLE ROW LEVEL SECURITY;


-- ==============================================================================
-- 3. DROP ALL EXISTING POLICIES (Clean Slate)
-- ==============================================================================

-- profiles
DROP POLICY IF EXISTS "profiles_select_own_or_admin" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own_or_admin" ON public.profiles;
DROP POLICY IF EXISTS "profiles_no_direct_insert" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_policy" ON public.profiles;

-- health_centers
DROP POLICY IF EXISTS "health_center_read" ON public.health_centers;
DROP POLICY IF EXISTS "health_center_create_own" ON public.health_centers;
DROP POLICY IF EXISTS "health_center_update_owner_or_admin" ON public.health_centers;
DROP POLICY IF EXISTS "health_center_delete_admin_only" ON public.health_centers;
DROP POLICY IF EXISTS "health_centers_select_policy" ON public.health_centers;
DROP POLICY IF EXISTS "health_centers_insert_policy" ON public.health_centers;
DROP POLICY IF EXISTS "health_centers_update_policy" ON public.health_centers;
DROP POLICY IF EXISTS "health_centers_delete_policy" ON public.health_centers;

-- doctors
DROP POLICY IF EXISTS "doctor_read" ON public.doctors;
DROP POLICY IF EXISTS "doctor_create_by_health_center" ON public.doctors;
DROP POLICY IF EXISTS "doctor_update_owner_or_admin" ON public.doctors;
DROP POLICY IF EXISTS "doctor_delete_owner_or_admin" ON public.doctors;
DROP POLICY IF EXISTS "doctors_select_policy" ON public.doctors;
DROP POLICY IF EXISTS "doctors_insert_policy" ON public.doctors;
DROP POLICY IF EXISTS "doctors_update_policy" ON public.doctors;
DROP POLICY IF EXISTS "doctors_delete_policy" ON public.doctors;

-- doctor_services
DROP POLICY IF EXISTS "doctor_services_select_policy" ON public.doctor_services;
DROP POLICY IF EXISTS "doctor_services_insert_policy" ON public.doctor_services;
DROP POLICY IF EXISTS "doctor_services_update_policy" ON public.doctor_services;
DROP POLICY IF EXISTS "doctor_services_delete_policy" ON public.doctor_services;

-- doctor_availability
DROP POLICY IF EXISTS "doctor_availability_select_policy" ON public.doctor_availability;
DROP POLICY IF EXISTS "doctor_availability_insert_policy" ON public.doctor_availability;
DROP POLICY IF EXISTS "doctor_availability_update_policy" ON public.doctor_availability;
DROP POLICY IF EXISTS "doctor_availability_delete_policy" ON public.doctor_availability;

-- health_center_services
DROP POLICY IF EXISTS "health_center_services_select_policy" ON public.health_center_services;
DROP POLICY IF EXISTS "health_center_services_insert_policy" ON public.health_center_services;
DROP POLICY IF EXISTS "health_center_services_update_policy" ON public.health_center_services;
DROP POLICY IF EXISTS "health_center_services_delete_policy" ON public.health_center_services;

-- health_center_availability
DROP POLICY IF EXISTS "health_center_availability_select_policy" ON public.health_center_availability;
DROP POLICY IF EXISTS "health_center_availability_insert_policy" ON public.health_center_availability;
DROP POLICY IF EXISTS "health_center_availability_update_policy" ON public.health_center_availability;
DROP POLICY IF EXISTS "health_center_availability_delete_policy" ON public.health_center_availability;

-- appointments
DROP POLICY IF EXISTS "appointments_select_policy" ON public.appointments;
DROP POLICY IF EXISTS "appointments_insert_policy" ON public.appointments;
DROP POLICY IF EXISTS "appointments_update_policy" ON public.appointments;
DROP POLICY IF EXISTS "appointments_delete_policy" ON public.appointments;

-- liveconsult
DROP POLICY IF EXISTS "User/Doctor/Admin can read consults" ON public.liveconsult;
DROP POLICY IF EXISTS "User/Doctor/Admin update allowed consults" ON public.liveconsult;
DROP POLICY IF EXISTS "Users create their own consult" ON public.liveconsult;
DROP POLICY IF EXISTS "liveconsult_select_policy" ON public.liveconsult;
DROP POLICY IF EXISTS "liveconsult_insert_policy" ON public.liveconsult;
DROP POLICY IF EXISTS "liveconsult_update_policy" ON public.liveconsult;
DROP POLICY IF EXISTS "liveconsult_delete_policy" ON public.liveconsult;

-- account_details_doctors
DROP POLICY IF EXISTS "account_details_doctors_select_policy" ON public.account_details_doctors;
DROP POLICY IF EXISTS "account_details_doctors_insert_policy" ON public.account_details_doctors;
DROP POLICY IF EXISTS "account_details_doctors_update_policy" ON public.account_details_doctors;
DROP POLICY IF EXISTS "account_details_doctors_delete_policy" ON public.account_details_doctors;

-- account_details_healthcenter
DROP POLICY IF EXISTS "Health center can delete its own account details" ON public.account_details_healthcenter;
DROP POLICY IF EXISTS "Health center can insert its own account details" ON public.account_details_healthcenter;
DROP POLICY IF EXISTS "Health center can update its own account details" ON public.account_details_healthcenter;
DROP POLICY IF EXISTS "Health center can view its own account details" ON public.account_details_healthcenter;
DROP POLICY IF EXISTS "Super admins have full access to account details" ON public.account_details_healthcenter;
DROP POLICY IF EXISTS "account_details_healthcenter_select_policy" ON public.account_details_healthcenter;
DROP POLICY IF EXISTS "account_details_healthcenter_insert_policy" ON public.account_details_healthcenter;
DROP POLICY IF EXISTS "account_details_healthcenter_update_policy" ON public.account_details_healthcenter;
DROP POLICY IF EXISTS "account_details_healthcenter_delete_policy" ON public.account_details_healthcenter;

-- payment_appointments
DROP POLICY IF EXISTS "payment_appointments_select_policy" ON public.payment_appointments;
DROP POLICY IF EXISTS "payment_appointments_insert_policy" ON public.payment_appointments;
DROP POLICY IF EXISTS "payment_appointments_update_policy" ON public.payment_appointments;
DROP POLICY IF EXISTS "payment_appointments_delete_policy" ON public.payment_appointments;

-- payment_liveconsult
DROP POLICY IF EXISTS "payment_liveconsult_select_policy" ON public.payment_liveconsult;
DROP POLICY IF EXISTS "payment_liveconsult_insert_policy" ON public.payment_liveconsult;
DROP POLICY IF EXISTS "payment_liveconsult_update_policy" ON public.payment_liveconsult;
DROP POLICY IF EXISTS "payment_liveconsult_delete_policy" ON public.payment_liveconsult;


-- ==============================================================================
-- 4. CREATE ROBUST TABLE-WISE POLICIES
-- ==============================================================================

--------------------------------------------------------------------------------
-- TABLE: profiles
--------------------------------------------------------------------------------
CREATE POLICY "profiles_select_policy" ON public.profiles
FOR SELECT USING (
  id = auth.uid() 
  OR public.is_super_admin()
  OR role IN ('health_center', 'doctor')
);

CREATE POLICY "profiles_insert_policy" ON public.profiles
FOR INSERT WITH CHECK (
  id = auth.uid() 
  OR public.is_super_admin()
);

CREATE POLICY "profiles_update_policy" ON public.profiles
FOR UPDATE USING (
  (id = auth.uid() AND (role = public.current_role() OR role = 'user'))
  OR public.is_super_admin()
) WITH CHECK (
  (id = auth.uid() AND (role = public.current_role() OR role = 'user'))
  OR public.is_super_admin()
);

CREATE POLICY "profiles_delete_policy" ON public.profiles
FOR DELETE USING (
  public.is_super_admin()
);


--------------------------------------------------------------------------------
-- TABLE: health_centers
--------------------------------------------------------------------------------
CREATE POLICY "health_centers_select_policy" ON public.health_centers
FOR SELECT USING (
  approved = true 
  OR user_id = auth.uid() 
  OR public.is_super_admin()
);

CREATE POLICY "health_centers_insert_policy" ON public.health_centers
FOR INSERT WITH CHECK (
  user_id = auth.uid() 
  OR public.is_super_admin()
);

CREATE POLICY "health_centers_update_policy" ON public.health_centers
FOR UPDATE USING (
  user_id = auth.uid() 
  OR public.is_super_admin()
) WITH CHECK (
  (user_id = auth.uid() AND approved = (SELECT hc.approved FROM public.health_centers hc WHERE hc.id = health_centers.id))
  OR public.is_super_admin()
);

CREATE POLICY "health_centers_delete_policy" ON public.health_centers
FOR DELETE USING (
  public.is_super_admin()
);


--------------------------------------------------------------------------------
-- TABLE: doctors
--------------------------------------------------------------------------------
CREATE POLICY "doctors_select_policy" ON public.doctors
FOR SELECT USING (
  approved = true 
  OR id = auth.uid() 
  OR health_center_id = public.get_my_health_center_id()
  OR public.is_super_admin()
);

CREATE POLICY "doctors_insert_policy" ON public.doctors
FOR INSERT WITH CHECK (
  (health_center_id = public.get_my_health_center_id() AND EXISTS (
    SELECT 1 FROM public.health_centers hc WHERE hc.id = public.get_my_health_center_id() AND hc.approved = true
  ))
  OR id = auth.uid()
  OR public.is_super_admin()
);

CREATE POLICY "doctors_update_policy" ON public.doctors
FOR UPDATE USING (
  id = auth.uid() 
  OR health_center_id = public.get_my_health_center_id() 
  OR public.is_super_admin()
) WITH CHECK (
  (id = auth.uid() AND approved = (SELECT d.approved FROM public.doctors d WHERE d.id = doctors.id))
  OR (health_center_id = public.get_my_health_center_id())
  OR public.is_super_admin()
);

CREATE POLICY "doctors_delete_policy" ON public.doctors
FOR DELETE USING (
  health_center_id = public.get_my_health_center_id() 
  OR public.is_super_admin()
);


--------------------------------------------------------------------------------
-- TABLE: doctor_services
--------------------------------------------------------------------------------
-- Publicly readable so users can search & browse services
CREATE POLICY "doctor_services_select_policy" ON public.doctor_services
FOR SELECT USING (true);

CREATE POLICY "doctor_services_insert_policy" ON public.doctor_services
FOR INSERT WITH CHECK (
  doctor_id = auth.uid() 
  OR public.is_super_admin()
);

CREATE POLICY "doctor_services_update_policy" ON public.doctor_services
FOR UPDATE USING (
  doctor_id = auth.uid() 
  OR public.is_super_admin()
);

CREATE POLICY "doctor_services_delete_policy" ON public.doctor_services
FOR DELETE USING (
  doctor_id = auth.uid() 
  OR public.is_super_admin()
);


--------------------------------------------------------------------------------
-- TABLE: doctor_availability
--------------------------------------------------------------------------------
-- Publicly readable so users can book available slots
CREATE POLICY "doctor_availability_select_policy" ON public.doctor_availability
FOR SELECT USING (true);

CREATE POLICY "doctor_availability_insert_policy" ON public.doctor_availability
FOR INSERT WITH CHECK (
  doctor_id = auth.uid() 
  OR public.is_super_admin()
);

CREATE POLICY "doctor_availability_update_policy" ON public.doctor_availability
FOR UPDATE USING (
  doctor_id = auth.uid() 
  OR public.is_super_admin()
);

CREATE POLICY "doctor_availability_delete_policy" ON public.doctor_availability
FOR DELETE USING (
  doctor_id = auth.uid() 
  OR public.is_super_admin()
);


--------------------------------------------------------------------------------
-- TABLE: health_center_services
--------------------------------------------------------------------------------
-- Patients see active services; health centers and admins see all
CREATE POLICY "health_center_services_select_policy" ON public.health_center_services
FOR SELECT USING (
  status = 'active'
  OR health_center_id = public.get_my_health_center_id()
  OR public.is_super_admin()
);

CREATE POLICY "health_center_services_insert_policy" ON public.health_center_services
FOR INSERT WITH CHECK (
  health_center_id = public.get_my_health_center_id()
  OR public.is_super_admin()
);

CREATE POLICY "health_center_services_update_policy" ON public.health_center_services
FOR UPDATE USING (
  health_center_id = public.get_my_health_center_id()
  OR public.is_super_admin()
);

CREATE POLICY "health_center_services_delete_policy" ON public.health_center_services
FOR DELETE USING (
  health_center_id = public.get_my_health_center_id()
  OR public.is_super_admin()
);


--------------------------------------------------------------------------------
-- TABLE: health_center_availability
--------------------------------------------------------------------------------
-- Publicly readable so patients can check available booking days/slots
CREATE POLICY "health_center_availability_select_policy" ON public.health_center_availability
FOR SELECT USING (true);

CREATE POLICY "health_center_availability_insert_policy" ON public.health_center_availability
FOR INSERT WITH CHECK (
  health_center_id = public.get_my_health_center_id()
  OR public.is_super_admin()
);

CREATE POLICY "health_center_availability_update_policy" ON public.health_center_availability
FOR UPDATE USING (
  health_center_id = public.get_my_health_center_id()
  OR public.is_super_admin()
);

CREATE POLICY "health_center_availability_delete_policy" ON public.health_center_availability
FOR DELETE USING (
  health_center_id = public.get_my_health_center_id()
  OR public.is_super_admin()
);


--------------------------------------------------------------------------------
-- TABLE: appointments
--------------------------------------------------------------------------------
CREATE POLICY "appointments_select_policy" ON public.appointments
FOR SELECT USING (
  user_id = auth.uid()
  OR center_id = public.get_my_health_center_id()
  OR public.is_super_admin()
);

CREATE POLICY "appointments_insert_policy" ON public.appointments
FOR INSERT WITH CHECK (
  user_id = auth.uid()
  OR public.is_super_admin()
);

CREATE POLICY "appointments_update_policy" ON public.appointments
FOR UPDATE USING (
  user_id = auth.uid()
  OR center_id = public.get_my_health_center_id()
  OR public.is_super_admin()
);

CREATE POLICY "appointments_delete_policy" ON public.appointments
FOR DELETE USING (
  public.is_super_admin()
);


--------------------------------------------------------------------------------
-- TABLE: liveconsult
--------------------------------------------------------------------------------
CREATE POLICY "liveconsult_select_policy" ON public.liveconsult
FOR SELECT USING (
  user_id = auth.uid()
  OR doctor_id = auth.uid()
  OR public.is_super_admin()
);

CREATE POLICY "liveconsult_insert_policy" ON public.liveconsult
FOR INSERT WITH CHECK (
  user_id = auth.uid()
  OR public.is_super_admin()
);

CREATE POLICY "liveconsult_update_policy" ON public.liveconsult
FOR UPDATE USING (
  user_id = auth.uid()
  OR doctor_id = auth.uid()
  OR public.is_super_admin()
);

CREATE POLICY "liveconsult_delete_policy" ON public.liveconsult
FOR DELETE USING (
  public.is_super_admin()
);


--------------------------------------------------------------------------------
-- TABLE: account_details_doctors
--------------------------------------------------------------------------------
CREATE POLICY "account_details_doctors_select_policy" ON public.account_details_doctors
FOR SELECT USING (
  doctor_id = auth.uid()
  OR public.is_super_admin()
);

CREATE POLICY "account_details_doctors_insert_policy" ON public.account_details_doctors
FOR INSERT WITH CHECK (
  doctor_id = auth.uid()
  OR public.is_super_admin()
);

CREATE POLICY "account_details_doctors_update_policy" ON public.account_details_doctors
FOR UPDATE USING (
  doctor_id = auth.uid()
  OR public.is_super_admin()
);

CREATE POLICY "account_details_doctors_delete_policy" ON public.account_details_doctors
FOR DELETE USING (
  doctor_id = auth.uid()
  OR public.is_super_admin()
);


--------------------------------------------------------------------------------
-- TABLE: account_details_healthcenter
--------------------------------------------------------------------------------
CREATE POLICY "account_details_healthcenter_select_policy" ON public.account_details_healthcenter
FOR SELECT USING (
  health_center_id = public.get_my_health_center_id()
  OR public.is_super_admin()
);

CREATE POLICY "account_details_healthcenter_insert_policy" ON public.account_details_healthcenter
FOR INSERT WITH CHECK (
  health_center_id = public.get_my_health_center_id()
  OR public.is_super_admin()
);

CREATE POLICY "account_details_healthcenter_update_policy" ON public.account_details_healthcenter
FOR UPDATE USING (
  health_center_id = public.get_my_health_center_id()
  OR public.is_super_admin()
);

CREATE POLICY "account_details_healthcenter_delete_policy" ON public.account_details_healthcenter
FOR DELETE USING (
  health_center_id = public.get_my_health_center_id()
  OR public.is_super_admin()
);


--------------------------------------------------------------------------------
-- TABLE: payment_appointments
--------------------------------------------------------------------------------
CREATE POLICY "payment_appointments_select_policy" ON public.payment_appointments
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.appointments a 
    WHERE a.id = payment_appointments.appointment_id 
      AND (a.user_id = auth.uid() OR a.center_id = public.get_my_health_center_id())
  )
  OR public.is_super_admin()
);

CREATE POLICY "payment_appointments_insert_policy" ON public.payment_appointments
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.appointments a 
    WHERE a.id = payment_appointments.appointment_id 
      AND a.user_id = auth.uid()
  )
  OR public.is_super_admin()
);

CREATE POLICY "payment_appointments_update_policy" ON public.payment_appointments
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.appointments a 
    WHERE a.id = payment_appointments.appointment_id 
      AND (a.user_id = auth.uid() OR a.center_id = public.get_my_health_center_id())
  )
  OR public.is_super_admin()
);

CREATE POLICY "payment_appointments_delete_policy" ON public.payment_appointments
FOR DELETE USING (
  public.is_super_admin()
);


--------------------------------------------------------------------------------
-- TABLE: payment_liveconsult
--------------------------------------------------------------------------------
CREATE POLICY "payment_liveconsult_select_policy" ON public.payment_liveconsult
FOR SELECT USING (
  doctor_id = auth.uid()
  OR auth.uid() IS NOT NULL
  OR public.is_super_admin()
);

CREATE POLICY "payment_liveconsult_insert_policy" ON public.payment_liveconsult
FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL
  OR public.is_super_admin()
);

CREATE POLICY "payment_liveconsult_update_policy" ON public.payment_liveconsult
FOR UPDATE USING (
  doctor_id = auth.uid()
  OR auth.uid() IS NOT NULL
  OR public.is_super_admin()
);

CREATE POLICY "payment_liveconsult_delete_policy" ON public.payment_liveconsult
FOR DELETE USING (
  public.is_super_admin()
);
