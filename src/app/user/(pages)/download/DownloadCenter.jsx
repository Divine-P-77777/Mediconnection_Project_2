"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/supabase/client";
import { useSelector } from "react-redux";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import DocumentsModal from "./DocumentsModal";

export default function DownloadCenter() {
  const [appointments, setAppointments] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popupData, setPopupData] = useState(null);
  
  
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  
  const [appPage, setAppPage] = useState(1);
  const [conPage, setConPage] = useState(1);
  const router = useRouter();
  const { user } = useAuth();


  
  //  redirect to auth if not logged in
      useEffect(() => {
          if (!user) {
            router.push("/auth");
          }
        }, [user, router]); 
    
  
  const limit = 10;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: appts } = await supabase
        .from("appointments")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      const { data: cons } = await supabase
        .from("liveconsult")
        .select("*")
        .eq("user_id", user.id)
        .order("consultation_date", { ascending: false });

      setAppointments(appts || []);
      setConsultations(cons || []);
      setLoading(false);
    };

    fetchData();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const renderTable = (rows, page, setPage) => {
    const start = (page - 1) * limit;
    const paginated = rows.slice(start, start + limit);

    return (
      <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <table
          className={`min-w-full text-sm ${
            isDarkMode ? "text-gray-200" : "text-gray-800"
          }`}
        >
          <thead
            className={`${
              isDarkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-700"
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
                className={`border-t ${
                  isDarkMode
                    ? "border-gray-700 hover:bg-gray-800"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <td className="px-4 py-2">{formatDate(row.date || row.consultation_date)}</td>
                <td className="px-4 py-2">{row.user_name || row.full_name || "Unknown"}</td>
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
                  colSpan="3"
                  className="text-center py-4 text-gray-500 dark:text-gray-400"
                >
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between items-center p-3 text-sm">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50 dark:border-gray-600"
          >
            Prev
          </button>
          <span>
            Page {page} of {Math.ceil(rows.length / limit) || 1}
          </span>
          <button
            disabled={page >= Math.ceil(rows.length / limit)}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50 dark:border-gray-600"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className={`p-4 pt-30 space-y-8 ${isDarkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"}`}>
      {/* Healthcenter Appointments */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Healthcenter Appointments</h2>
        {renderTable(appointments, appPage, setAppPage)}
      </section>

      {/* Doctor Consultations */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Doctor Consultations</h2>
        {renderTable(consultations, conPage, setConPage)}
      </section>

      {/* Popup Modal */}
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
