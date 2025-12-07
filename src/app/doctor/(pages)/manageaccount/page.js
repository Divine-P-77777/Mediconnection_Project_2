'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { errToast, Success } from '@/hooks/use-toast';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function ManageAccount() {
  const { user, isDoctor, loading } = useAuth();
  const doctorId = user?.id;
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  const [formData, setFormData] = useState({
    account_number: '',
    bank_name: '',
    ifsc_code: '',
  });
  const [saving, setSaving] = useState(false);

  const router = useRouter();
  const { errorToast } = useToast();


    if(!user){
    router.push("/auth/doctor");
    errorToast("Please login to access doctor portal");
    return null;
  }


  // ✅ Fetch existing account details when doctor logs in
  useEffect(() => {
    if (!doctorId) return;

    (async () => {
      try {
        const res = await fetch(`/api/doctor/account?doctor_id=${doctorId}`);
        const data = await res.json();
        if (data && !data.error && data.account_number) {
          setFormData({
            account_number: data.account_number,
            bank_name: data.bank_name,
            ifsc_code: data.ifsc_code,
          });
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }, [doctorId]);

  // ✅ Handle form input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Save / Update account details
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!doctorId) return errToast('Doctor ID not found');
    setSaving(true);

    try {
      const res = await fetch('/api/doctor/account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doctor_id: doctorId, ...formData }),
      });

      const data = await res.json();
      if (res.ok) {
        Success('Account details saved!');
      } else {
        errToast(data.error || 'Error saving account details');
      }
    } catch (err) {
      errToast(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Loading UI
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div
          className={`animate-spin rounded-full h-10 w-10 border-b-2 ${
            isDarkMode ? 'border-cyan-400' : 'border-cyan-600'
          }`}
        />
      </div>
    );
  }

  // Access Control
  if (!isDoctor) {
    return (
      <div
        className={`flex justify-center items-center h-screen ${
          isDarkMode ? 'text-red-300' : 'text-red-600'
        }`}
      >
        Access denied. Doctors only.
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen pt-30 flex justify-center items-center px-4 py-10 ${
        isDarkMode ? 'bg-gray-900 text-cyan-300' : 'bg-gray-100 text-gray-800'
      }`}
    >
      <form
        onSubmit={handleSubmit}
        className={`p-8 rounded-2xl w-full max-w-md shadow-xl transition-colors duration-300 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        <h2
          className={`text-3xl font-bold mb-6 text-center ${
            isDarkMode ? 'text-cyan-300' : 'text-cyan-600'
          }`}
        >
          Manage Account Details
        </h2>

        {/* Account Number */}
        <div className="mb-5">
          <label
            className={`block mb-2 text-sm font-medium ${
              isDarkMode ? 'text-cyan-200' : 'text-gray-700'
            }`}
          >
            Account Number
          </label>
          <input
            type="text"
            name="account_number"
            value={formData.account_number}
            onChange={handleChange}
            className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-200 ${
              isDarkMode
                ? 'bg-gray-700 text-white border-gray-600 focus:ring-cyan-400'
                : 'bg-gray-50 text-gray-800 border-gray-300 focus:ring-cyan-600'
            }`}
            required
          />
        </div>

        {/* Bank Name */}
        <div className="mb-5">
          <label
            className={`block mb-2 text-sm font-medium ${
              isDarkMode ? 'text-cyan-200' : 'text-gray-700'
            }`}
          >
            Bank Name
          </label>
          <input
            type="text"
            name="bank_name"
            value={formData.bank_name}
            onChange={handleChange}
            className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-200 ${
              isDarkMode
                ? 'bg-gray-700 text-white border-gray-600 focus:ring-cyan-400'
                : 'bg-gray-50 text-gray-800 border-gray-300 focus:ring-cyan-600'
            }`}
            required
          />
        </div>

        {/* IFSC Code */}
        <div className="mb-5">
          <label
            className={`block mb-2 text-sm font-medium ${
              isDarkMode ? 'text-cyan-200' : 'text-gray-700'
            }`}
          >
            IFSC Code
          </label>
          <input
            type="text"
            name="ifsc_code"
            value={formData.ifsc_code}
            onChange={handleChange}
            className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-200 ${
              isDarkMode
                ? 'bg-gray-700 text-white border-gray-600 focus:ring-cyan-400'
                : 'bg-gray-50 text-gray-800 border-gray-300 focus:ring-cyan-600'
            }`}
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={saving}
          className={`w-full py-3 rounded-lg font-semibold shadow-md transform transition-all duration-200 ${
            saving
              ? 'opacity-70 cursor-not-allowed'
              : 'hover:scale-[1.02] active:scale-[0.98]'
          } ${
            isDarkMode
              ? 'bg-cyan-500 text-black hover:bg-cyan-400'
              : 'bg-cyan-600 text-white hover:bg-cyan-500'
          }`}
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  );
}
