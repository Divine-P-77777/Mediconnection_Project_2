"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/supabase/client";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const MAIN_SUPER_ADMIN_EMAIL = process.env.NEXT_PUBLIC_MAIN_SUPER_ADMIN_EMAIL;

export default function CareersPage() {
  const router = useRouter();
  const { Success, errorToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    role: "health_center",
    first_name: "",
    last_name: "",
    username: "",
    health_center_name: "",
    pincode: "",
    official_email: "",
    contact_number: "",
    address: "",
    hcrn_hfc: "",
  });

  // 🔐 Strict Super Admin Guard
  useEffect(() => {
    const checkAccess = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;

      if (!user || user.email !== MAIN_SUPER_ADMIN_EMAIL) {
        await supabase.auth.signOut();
        errorToast("❌ Unauthorized access");
        router.replace("/admin");
        return;
      }

      setLoading(false);
    };

    checkAccess();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🚀 Register Profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // 1️⃣ Create Auth User
      const { data: authData, error: authError } =
        await supabase.auth.admin.createUser({
          email: form.official_email,
          email_confirm: true,
        });

      if (authError) throw authError;

      const userId = authData.user.id;

      // 2️⃣ Insert into profiles table
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: userId,
          role: form.role,
          first_name: form.first_name,
          last_name: form.last_name,
          username: form.username,
          health_center_name: form.health_center_name,
          pincode: form.pincode,
          official_email: form.official_email,
          contact_number: form.contact_number,
          address: form.address,
          hcrn_hfc: form.hcrn_hfc,
          approved: false, // ⛔ approval required
        });

      if (profileError) throw profileError;

      Success("✅ Registration submitted for approval");

      setForm({
        role: "health_center",
        first_name: "",
        last_name: "",
        username: "",
        health_center_name: "",
        pincode: "",
        official_email: "",
        contact_number: "",
        address: "",
        hcrn_hfc: "",
      });
    } catch (err) {
      errorToast(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4">
      <div className="w-full max-w-2xl bg-white p-6 rounded-xl shadow">
        <h1 className="text-xl font-bold mb-4">
          Register Health Center / Technical Person
        </h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          >
            <option value="health_center">Health Center</option>
            <option value="doctor">Doctor</option>
            <option value="user">Technical User</option>
          </select>

          <input name="first_name" placeholder="First Name" required className="border p-2 rounded" onChange={handleChange} value={form.first_name} />
          <input name="last_name" placeholder="Last Name" className="border p-2 rounded" onChange={handleChange} value={form.last_name} />
          <input name="username" placeholder="Username (unique)" required className="border p-2 rounded" onChange={handleChange} value={form.username} />
          <input name="official_email" type="email" placeholder="Official Email" required className="border p-2 rounded" onChange={handleChange} value={form.official_email} />
          <input name="contact_number" placeholder="Contact Number" className="border p-2 rounded" onChange={handleChange} value={form.contact_number} />

          <input name="health_center_name" placeholder="Health Center Name" className="border p-2 rounded" onChange={handleChange} value={form.health_center_name} />
          <input name="hcrn_hfc" placeholder="HCRN / HFC Code" className="border p-2 rounded" onChange={handleChange} value={form.hcrn_hfc} />
          <input name="pincode" placeholder="Pincode" className="border p-2 rounded" onChange={handleChange} value={form.pincode} />
          <textarea name="address" placeholder="Address" className="border p-2 rounded" onChange={handleChange} value={form.address} />

          <button
            type="submit"
            disabled={submitting}
            className="bg-cyan-600 text-white py-2 rounded font-semibold"
          >
            {submitting ? "Submitting..." : "Submit for Approval"}
          </button>
        </form>
      </div>
    </div>
  );
}
