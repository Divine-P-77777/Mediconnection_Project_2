'use client';
import { useState } from 'react';
import { Loader2, Check, X, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export default function AdminDashboard({ centers }) {
  const [loading, setLoading] = useState(false);
  const { Success, errorToast } = useToast();
  const [localCenters, setLocalCenters] = useState(centers);
  const { user, session } = useAuth();

  const toggleApproval = async (id, approved) => {
    try {
      const res = await fetch(`/api/managecenter/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved: !approved }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      Success('Updated successfully');
      setLocalCenters(prev =>
        prev.map(c => (c.id === id ? { ...c, approved: !approved } : c))
      );
    } catch (err) {
      errorToast(err.message);
    }
  };

  const deleteCenter = async (id) => {
    if (!confirm('Are you sure to delete this health center?')) return;
    try {
      const res = await fetch(`/api/managecenter/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      Success('Deleted successfully');
      setLocalCenters(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      errorToast(err.message);
    }
  };

  if (loading) return <Loader2 className="animate-spin h-6 w-6 mx-auto mt-10" />;

  return (
    <div className="p-6 overflow-x-auto">
      <h2 className="text-2xl font-bold mb-5">Health Centers Management</h2>
      <h2>Name: {user?.user_metadata?.name}</h2>
      <p>Email: {user?.email}</p>
      <table className="w-full border-collapse border border-gray-300 min-w-[700px]">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Name</th>
            <th className="border p-2">User ID</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">HCRN/HFC</th>
            <th className="border p-2">Contact</th>
            <th className="border p-2">Pincode</th>
            <th className="border p-2">Approved</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {localCenters.map(c => (
            <tr key={c.id} className="hover:bg-gray-50">
              <td className="border p-2">{c.name}</td>
              <td className="border p-2">{c.id}</td>
              <td className="border p-2">{c.email}</td>
              <td className="border p-2">{c.hcrn_hfc}</td>
              <td className="border p-2">{c.contact}</td>
              <td className="border p-2">{c.pincode}</td>
              <td className="border p-2 text-center">
                <button
                  onClick={() => toggleApproval(c.id, c.approved)}
                  className={`p-1 rounded ${c.approved ? 'bg-green-200' : 'bg-red-200'}`}
                >
                  {c.approved ? (
                    <Check className="inline-block h-4 w-4 text-green-700" />
                  ) : (
                    <X className="inline-block h-4 w-4 text-red-700" />
                  )}
                </button>
              </td>
              <td className="border p-2 text-center">
                <button
                  onClick={() => deleteCenter(c.id)}
                  className="bg-red-500 hover:bg-red-600 text-white p-1 rounded"
                >
                  <Trash2 className="inline-block h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
