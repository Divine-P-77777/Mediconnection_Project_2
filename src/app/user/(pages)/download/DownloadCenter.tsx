"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/supabase/client";
import { useSelector } from "react-redux";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import DocumentsModal from "./DocumentsModal";
import { useAppSelector } from "@/store/hooks";

/* ---------- Types ---------- */

interface AppointmentRow {
  id: string;
  user_id: string;
  user_name?: string;
  full_name?: string;
  date?: string;
  consultation_date?: string;
  reports?: string[];
  bills?: string[];
  prescriptions?: string[];
}

type PopupData = AppointmentRow | null;

/* ---------- Component ---------- */

export default function DownloadCenter() {
  const [appointments, setAppointments] = useState<AppointmentRow[]>([]);
  const [consultations, setConsultations] = useState<AppointmentRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [popupData, setPopupData] = useState<PopupData>(null);

  const [appPage, setAppPage] = useState<number>(1);
  const [conPage, setConPage] = useState<number>(1);

  const isDarkMode = useAppSelector(
    (state) => state.theme.isDarkMode
  );

  const router = useRouter();
  const { user } = useAuth();

  const limit = 10;

  useEffect(() => {
    if (!user) {
      router.push("/auth");
    }
  }, [user, router]);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      setLoading(true);

      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) return;

      const { data: appts } = await supabase
        .from("appointments")
        .select("*")
        .eq("user_id", authUser.id)
        .order("date", { ascending: false });

      const { data: cons } = await supabase
        .from("liveconsult")
        .select("*")
        .eq("user_id", authUser.id)
        .order("consultation_date", { ascending: false });

      setAppointments((appts as AppointmentRow[]) || []);
      setConsultations((cons as AppointmentRow[]) || []);
      setLoading(false);
    };

    fetchData();
  }, []);

  const formatDate = (dateStr?: string): string => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const renderTable = (
    rows: AppointmentRow[],
    page: number,
    setPage: React.Dispatch<React.SetStateAction<number>>
  ) => {
    const start = (page - 1) * limit;
    const paginated = rows.slice(start, start + limit);
    const totalPages = Math.max(1, Math.ceil(rows.length / limit));

    return (
      <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <table
          className={`min-w-full text-sm ${isDarkMode ? "text-gray-200" : "text-gray-800"
            }`}
        >
          <thead
            className={`${isDarkMode
              ? "bg-gray-800 text-gray-300"
              : "bg-gray-100 text-gray-700"
              }`}
          >
            <tr>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Patient Name</th>
              <th className="px-4 py-2 text-center">Documents</th>
            </tr>
          </thead>

          <tbody>
            {paginated.map((row) => (
              <tr
                key={row.id}
                className={`border-t ${isDarkMode
                  ? "border-gray-700 hover:bg-gray-800"
                  : "border-gray-200 hover:bg-gray-50"
                  }`}
              >
                <td className="px-4 py-2">
                  {formatDate(row.date || row.consultation_date)}
                </td>
                <td className="px-4 py-2">
                  {row.user_name || row.full_name || "Unknown"}
                </td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => setPopupData(row)}
                    className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 transition"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}

            {paginated.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="text-center py-4 text-gray-500 dark:text-gray-400"
                >
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="flex justify-between items-center p-3 text-sm">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50 dark:border-gray-600"
          >
            Prev
          </button>

          <span>
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50 dark:border-gray-600"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <p
        className={`p-4 min-h-screen ${isDarkMode
          ? "bg-gray-900 text-gray-100"
          : "bg-white text-gray-900"
          }`}
      >
        Loading...
      </p>
    );
  }

  return (
    <div
      className={`p-4 pt-30 space-y-8 ${isDarkMode
        ? "bg-gray-900 text-gray-100"
        : "bg-white text-gray-900"
        }`}
    >
      <section>
        <h2 className="text-lg font-semibold mb-3">
          Healthcenter Appointments
        </h2>
        {renderTable(appointments, appPage, setAppPage)}
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">
          Doctor Consultations
        </h2>
        {renderTable(consultations, conPage, setConPage)}
      </section>

      {popupData && (
        <DocumentsModal
          data={popupData}
          isDarkMode={isDarkMode}
          onClose={() => setPopupData(null)}
        />
      )}
    </div>
  );
}
