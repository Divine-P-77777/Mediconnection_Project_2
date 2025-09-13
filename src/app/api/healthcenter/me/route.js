import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('health_centers')
    .select('id, name, hcrn_hfc, address, phone, pincode, approved, email, document_proof, created_at')
    .eq('user_id', user.id)
    .single();

  if (error) {
    console.error('Health center fetch error:', error.message);
    return Response.json({ error: error.message }, { status: 400 });
  }

  return Response.json({ data });
}
