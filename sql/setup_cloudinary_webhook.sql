-- ==============================================================================
-- SUPABASE DATABASE WEBHOOK FOR CLOUDINARY MEDIA CLEANUP ON ROW DELETE
-- Automatically purges associated Cloudinary images/documents whenever a row
-- is deleted from:
--   1. appointments (reports, bills, prescriptions)
--   2. liveconsult (reports, bills, prescriptions)
--   3. doctors (profile, document_proof)
--   4. health_centers (document_proof)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- METHOD A (RECOMMENDED): SUPABASE DASHBOARD DATABASE WEBHOOKS (Zero Code)
-- ------------------------------------------------------------------------------
-- 1. Go to your Supabase Project Dashboard.
-- 2. Navigate to: Database -> Webhooks -> "Create a new webhook".
-- 3. Configuration:
--    - Name: "cloudinary_cleanup_appointments"
--    - Table: "appointments"
--    - Events to fire: Check "DELETE" only
--    - Webhook type: "HTTP Request"
--    - HTTP Method: "POST"
--    - URL: "https://your-domain.com/api/webhooks/cloudinary-cleanup"
--    - HTTP Headers:
--        Content-Type: application/json
--        x-webhook-secret: <your SUPABASE_WEBHOOK_SECRET> (optional)
-- 4. Repeat for tables: "liveconsult", "doctors", "health_centers".


-- ------------------------------------------------------------------------------
-- METHOD B: SQL TRIGGER USING SUPABASE PG_NET EXTENSION
-- If you want to configure the webhook trigger purely through SQL:
-- ------------------------------------------------------------------------------

-- 1. Enable the pg_net extension
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- 2. Create the notification trigger function
CREATE OR REPLACE FUNCTION public.trigger_cloudinary_cleanup_on_delete()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_payload jsonb;
  -- Set your app URL here or configure via Supabase secrets
  v_app_url text := 'https://your-app-domain.com';
BEGIN
  v_payload := jsonb_build_object(
    'type', 'DELETE',
    'table', TG_TABLE_NAME,
    'schema', TG_TABLE_SCHEMA,
    'old_record', to_jsonb(OLD)
  );

  -- Send non-blocking async HTTP POST to Next.js webhook endpoint
  PERFORM extensions.net_http_post(
    url := v_app_url || '/api/webhooks/cloudinary-cleanup',
    body := v_payload,
    headers := '{"Content-Type": "application/json"}'::jsonb
  );

  RETURN OLD;
EXCEPTION
  WHEN OTHERS THEN
    -- Prevent blocking database deletes if network fails
    RAISE WARNING 'Cloudinary webhook notification failed: %', SQLERRM;
    RETURN OLD;
END;
$$;

-- 3. Attach triggers to tables that store Cloudinary media
DROP TRIGGER IF EXISTS trg_cleanup_appointments_cloudinary ON public.appointments;
CREATE TRIGGER trg_cleanup_appointments_cloudinary
AFTER DELETE ON public.appointments
FOR EACH ROW EXECUTE FUNCTION public.trigger_cloudinary_cleanup_on_delete();

DROP TRIGGER IF EXISTS trg_cleanup_liveconsult_cloudinary ON public.liveconsult;
CREATE TRIGGER trg_cleanup_liveconsult_cloudinary
AFTER DELETE ON public.liveconsult
FOR EACH ROW EXECUTE FUNCTION public.trigger_cloudinary_cleanup_on_delete();

DROP TRIGGER IF EXISTS trg_cleanup_doctors_cloudinary ON public.doctors;
CREATE TRIGGER trg_cleanup_doctors_cloudinary
AFTER DELETE ON public.doctors
FOR EACH ROW EXECUTE FUNCTION public.trigger_cloudinary_cleanup_on_delete();

DROP TRIGGER IF EXISTS trg_cleanup_health_centers_cloudinary ON public.health_centers;
CREATE TRIGGER trg_cleanup_health_centers_cloudinary
AFTER DELETE ON public.health_centers
FOR EACH ROW EXECUTE FUNCTION public.trigger_cloudinary_cleanup_on_delete();
