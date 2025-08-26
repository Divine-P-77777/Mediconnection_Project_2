import AdminDashboard from './AdminDashboard';

export default async function DashboardPage() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/adminaccess`, {
      method: 'GET',
      cache: 'no-store', // avoids stale data in Next.js
    });

    if (!res.ok) throw new Error('Failed to fetch data from API');

    const { success, healthCenters } = await res.json();

    if (!success) throw new Error('API did not return success');

    return <AdminDashboard centers={healthCenters || []} />;
  } catch (err) {
    console.error('Dashboard load error:', err);
    return (
      <div className="p-6 text-red-600">
        Error loading health centers. Please try again later.
      </div>
    );
  }
}
