"use client";

import { FC, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { supabase } from "@/supabase/client";

// TYPES 

interface AccountNoSetProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (accountNo: string) => void;
}

// COMPONENT 

const AccountNoSet: FC<AccountNoSetProps> = ({
  userId,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  const [accountNo, setAccountNo] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSave = async (): Promise<void> => {
    if (!accountNo.trim()) {
      alert("Account number is required");
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase
        .from("doctors")
        .update({ account_number: accountNo })
        .eq("id", userId);

      if (error) throw error;

      alert("Account number saved successfully ");
      onSuccess(accountNo);
      onClose();
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div
        className={`w-96 p-6 rounded-2xl shadow-lg transition-colors ${isDarkMode
            ? "bg-gray-800 text-white"
            : "bg-white text-black"
          }`}
      >
        <h2 className="text-xl font-semibold mb-4">
          Set Your Account Number
        </h2>

        <input
          type="text"
          value={accountNo}
          onChange={(e) => setAccountNo(e.target.value)}
          placeholder="Enter your account number"
          className={`w-full px-3 py-2 mb-4 rounded border ${isDarkMode
              ? "bg-gray-700 border-gray-600 text-white"
              : "bg-gray-100 border-gray-300 text-black"
            }`}
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg ${isDarkMode
                ? "bg-gray-600 hover:bg-gray-500"
                : "bg-gray-200 hover:bg-gray-300"
              }`}
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className={`px-4 py-2 rounded-lg bg-cyan-500 text-white hover:bg-cyan-600 transition ${loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountNoSet;
