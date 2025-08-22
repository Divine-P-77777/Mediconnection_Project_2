import AdminDashboard from './AdminDashboard';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function DashboardPage() {
  try {
    // fetch all health centers directly
    const { data: healthCenters, error } = await supabaseAdmin
      .from('health_centers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return <AdminDashboard centers={healthCenters || []} />;
  } catch (err) {
    console.error('Dashboard load error:', err);
    return <div className="p-6 text-red-600">Error loading health centers</div>;
  }
}
