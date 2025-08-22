'use client';

import { useEffect, useState } from 'react';
import { Loader2, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/supabase/client';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

const HealthCenterDashboard = () => {
  const { Success, errorToast } = useToast();
  const router = useRouter();
const { user } = useAuth();
  const [healthCenter, setHealthCenter] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    specialization: '',
    contact: '',
  });

  // Fetch current logged-in user and health center
  useEffect(() => {
 const fetchHealthCenter = async () => {
  try {
    setLoading(true);
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;
    if (!session?.user) throw new Error('Please login first');

    const { data, error } = await supabase
      .from('health_centers')
      .select('id, name')
      .eq('id', session.user.id)
      .maybeSingle(); // ✅ won’t throw if no match

    if (error) throw error;
    if (!data) throw new Error('No linked health center found for this account'); 

    setHealthCenter(data);
  } catch (err) {
    errorToast(err.message);
  } finally {
    setLoading(false);
  }
};

    fetchHealthCenter();
  }, []);

  // Fetch doctors linked to this health center
  const fetchDoctors = async () => {
    if (!healthCenter?.id) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/healthcenter/doctor?health_center_id=${healthCenter.id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch doctors');
      setDoctors(data.data);
    } catch (err) {
      errorToast(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (healthCenter?.id) fetchDoctors();
  }, [healthCenter]);

  // Add doctor
  const handleAddDoctor = async (e) => {
    e.preventDefault();
    if (!healthCenter?.id) return errorToast('Health center not loaded yet');

    try {
      setLoading(true);
      const res = await fetch('/api/healthcenter/doctor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, health_center_id: healthCenter.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add doctor');

      Success('Doctor added successfully!');
      setForm({ name: '', email: '', password: '', specialization: '', contact: '' });
      fetchDoctors();
    } catch (err) {
      errorToast(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete doctor
  const handleDeleteDoctor = async (id) => {
    try {
      const res = await fetch('/api/healthcenter/doctor', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete doctor');
      Success('Doctor deleted successfully');
      fetchDoctors();
    } catch (err) {
      errorToast(err.message);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push('/auth/healthcenter');
    } catch (err) {
      errorToast(err.message);
    }
  };

  if (loading && !healthCenter) return <Loader2 className="h-6 w-6 animate-spin" />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
       
        <h2 className="text-2xl font-bold">Welcome, {healthCenter?.name || 'Health Center'}</h2>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded"
        >
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>
<div className='bg-amber-400 w-40 my-2 rounded-2xl px-2 py-1'> My Email :{user?.email}</div>
      <form onSubmit={handleAddDoctor} className="space-y-2 mb-6">
        <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="border p-2 rounded w-full" required />
        <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="border p-2 rounded w-full" required />
        <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="border p-2 rounded w-full" required />
        <input placeholder="Specialization" value={form.specialization} onChange={e => setForm({ ...form, specialization: e.target.value })} className="border p-2 rounded w-full" required />
        <input placeholder="Contact" value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} className="border p-2 rounded w-full" />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 animate-spin mr-2 inline-block" />} Add Doctor
        </button>
      </form>

      <h3 className="text-xl font-semibold mb-2">Doctors</h3>
      {loading ? (
        <Loader2 className="h-6 w-6 animate-spin" />
      ) : (
        <ul>
          {doctors.map(d => (
            <li key={d.id} className="flex justify-between items-center border p-2 rounded mb-2">
              <div>
                <p><strong>{d.name}</strong> ({d.specialization})</p>
                <p>{d.email} | {d.contact}</p>
              </div>
              <button onClick={() => handleDeleteDoctor(d.id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HealthCenterDashboard;
