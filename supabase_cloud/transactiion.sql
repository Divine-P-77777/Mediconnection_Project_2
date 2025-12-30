CREATE OR REPLACE FUNCTION get_pending_payouts()
RETURNS TABLE (
  payment_id bigint,
  amount numeric,
  doctor_id uuid,
  account_number text,
  ifsc_code text,
  bank_name text,
  email text,
  phone numeric
) AS $$
  SELECT pl.id,
         (pl.amount * 0.8) AS amount,  -- doctor share
         lc.doctor_id,
         ad.account_number,
         ad.ifsc_code,
         ad.bank_name,
         lc.email,
         lc.phone
  FROM public.payment_liveconsult pl
  JOIN public.liveconsult lc ON pl.liveconsult_id = lc.id
  JOIN public.account_details_doctors ad ON ad.doctor_id = lc.doctor_id
  WHERE pl.status = 'success'
    AND NOT EXISTS (
      SELECT 1
      FROM public.payouts_history ph
      WHERE ph.payment_liveconsult_id = pl.id
    );
$$ LANGUAGE sql STABLE;
