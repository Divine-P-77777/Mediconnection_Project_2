// /app/api/healthcenter/me/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('health_centers')
    .select('id, name')
    .eq('id', user.id)
    .single();

  if (error) return Response.json({ error: error.message }, { status: 400 });
  return Response.json({ data });
}
