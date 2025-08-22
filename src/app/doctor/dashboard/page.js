'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Loader2, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DoctorDashboard() {
  const { user, signOut } = useAuth();
  const { Success, errorToast } = useToast();
  const router = useRouter();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', specialization: '', contact: '' });

  // Fetch doctor data from Supabase
  const fetchDoctorData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('id', user.id)
        .single();
      if (error) throw error;

      setDoctor(data);
      setForm({ name: data.name, specialization: data.specialization, contact: data.contact });
    } catch (err) {
      errorToast(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorData();
  }, [user]);

  // Update doctor data
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('doctors')
        .update({
          name: form.name,
          specialization: form.specialization,
          contact: form.contact,
        })
        .eq('id', user.id)
        .select()
        .single();
      if (error) throw error;

      Success('Profile updated successfully!');
      setDoctor(data);
    } catch (err) {
      errorToast(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !doctor) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Welcome, Dr. {doctor?.name}</h2>
        <button
          onClick={() => signOut()}
          className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded"
        >
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>

      <div className="bg-amber-400 w-60 my-2 rounded-2xl px-2 py-1">
        My Email: {user?.email}
      </div>

      <form onSubmit={handleUpdate} className="space-y-3 mt-6 border p-4 rounded shadow-md">
        <h3 className="text-xl font-semibold mb-2">Update Profile</h3>

        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-2 rounded w-full"
          required
        />
        <input
          placeholder="Specialization"
          value={form.specialization}
          onChange={(e) => setForm({ ...form, specialization: e.target.value })}
          className="border p-2 rounded w-full"
          required
        />
        <input
          placeholder="Contact"
          value={form.contact}
          onChange={(e) => setForm({ ...form, contact: e.target.value })}
          className="border p-2 rounded w-full"
        />

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
          disabled={loading}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin inline-block mr-2" /> : 'Update Profile'}
        </button>
      </form>

      <div className="mt-6 p-4 bg-green-100 rounded shadow-md">
        <h3 className="text-lg font-semibold">Doctor Details</h3>
        <p><strong>Name:</strong> {doctor?.name}</p>
        <p><strong>Email:</strong> {doctor?.email}</p>
        <p><strong>Specialization:</strong> {doctor?.specialization}</p>
        <p><strong>Contact:</strong> {doctor?.contact}</p>
        <p><strong>Health Center ID:</strong> {doctor?.health_center_id}</p>
      </div>
    </div>
  );
}
