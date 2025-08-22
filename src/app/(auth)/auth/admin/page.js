"use client";

import { useState } from "react";
import { supabase } from "@/supabase/client";
import { useRouter } from "next/navigation";

const allowedSuperAdmins = ["dynamicphillic77777@gmail.com"];




export default function AdminAuthPage() {
  const router = useRouter();
  const [tab, setTab] = useState("login"); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Handle Register
  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { role: "super_admin" }, // 👈 goes to raw_user_meta_data
        },
      });

      if (error) throw error;

      if (data.user) {
        setSuccessMsg("✅ Registration successful. You can now log in.");
        setTab("login");
      }
    } catch (err) {
      setErrorMsg(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      const user = data.user;

      if (user && allowedSuperAdmins.includes(user.email)) {
        setSuccessMsg("✅ Welcome Super Admin!");
        router.push("/super-admin"); // redirect to dashboard
      } else {
        await supabase.auth.signOut();
        throw new Error("You are not authorized as a Super Admin.");
      }
    } catch (err) {
      setErrorMsg(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-2xl shadow-md w-96">
        {/* Tabs */}
        <div className="flex justify-between mb-6">
          <button
            onClick={() => setTab("login")}
            className={`w-1/2 py-2 ${
              tab === "login" ? "border-b-2 border-indigo-600 font-bold" : "text-gray-500"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setTab("register")}
            className={`w-1/2 py-2 ${
              tab === "register" ? "border-b-2 border-indigo-600 font-bold" : "text-gray-500"
            }`}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={tab === "login" ? handleLogin : handleRegister}
          className="space-y-4"
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded-md"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded-md"
            required
          />

          {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
          {successMsg && <p className="text-green-600 text-sm">{successMsg}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Please wait..." : tab === "login" ? "Login" : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}
