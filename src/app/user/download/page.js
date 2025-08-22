"use client";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Utility for dark mode
const cn = (classes, isDark) => {
  if (!Array.isArray(classes)) return typeof classes === "function" ? classes(isDark) : classes;
  return classes.map((c) => (typeof c === "function" ? c(isDark) : c)).join(" ");
};

const DownloadPage = () => {
  const { user } = useAuth();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState("");

  // Fetch appointments for logged-in user
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user?.id) return;
      setIsLoading(true);
      try {
        const res = await fetch(`/api/appointments?user_id=${user.id}`);
        const data = await res.json();
        setAppointments(data);
      } catch (err) {
        console.error("Error fetching appointments:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAppointments();
  }, [user]);

  // Flatten prescriptions, bills, reports into one table
  const allData = appointments.flatMap((appt) => {
    const rows = [];
    appt.prescriptions?.forEach((url, i) =>
      rows.push({
        type: "Prescription",
        doctor: appt.user_name,
        center: appt.center_name,
        date: appt.date,
        url,
        id: `${appt.id}-p${i}`,
      })
    );
    appt.bills?.forEach((url, i) =>
      rows.push({
        type: "Bill",
        doctor: appt.user_name,
        center: appt.center_name,
        date: appt.date,
        url,
        id: `${appt.id}-b${i}`,
      })
    );
    appt.reports?.forEach((url, i) =>
      rows.push({
        type: "Report",
        doctor: appt.user_name,
        center: appt.center_name,
        date: appt.date,
        url,
        id: `${appt.id}-r${i}`,
      })
    );
    return rows;
  });

  // Apply date filter
  const filteredData = allData.filter((item) => dateFilter === "" || item.date === dateFilter);

  return (
    <div
      className={`mt-20 ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"} min-h-screen p-6 md:p-8`}
    >
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">My Documents</h1>

      <div className="max-w-5xl mx-auto space-y-6">
        {/* Date Filter */}
        <Card className="p-6">
          <CardHeader>
            <CardTitle>Filter by Date</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row gap-3">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className={cn(
                [(isDark) => `w-full p-3 rounded-lg border ${isDark ? "bg-[#0A192F] text-white" : "bg-white text-black"}`],
                isDarkMode
              )}
            />
            <Button
              onClick={() => setDateFilter("")}
              className="bg-gray-500 text-white hover:bg-gray-600"
            >
              Reset
            </Button>
          </CardContent>
        </Card>

        {/* Data Table */}
        {isLoading ? (
          <div className="flex justify-center py-6">
            <div className="w-6 h-6 border-4 border-blue-400 border-t-transparent animate-spin rounded-full"></div>
          </div>
        ) : (
          <div className="overflow-x-auto mt-6">
            {filteredData.length > 0 ? (
              <table
                className={`w-full border-collapse text-sm ${isDarkMode ? "border-gray-600 bg-gray-800 text-white" : "border-gray-300 bg-white text-black"}`}
              >
                <thead className={`${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                  <tr>
                    <th className="p-2 border">Type</th>
                    <th className="p-2 border">Doctor</th>
                    <th className="p-2 border">Health Center</th>
                    <th className="p-2 border">Date</th>
                    <th className="p-2 border">Download</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-cyan-200 dark:hover:bg-gray-600 transition"
                    >
                      <td className="p-2 border">{item.type}</td>
                      <td className="p-2 border">{item.doctor}</td>
                      <td className="p-2 border">{item.center}</td>
                      <td className="p-2 border">{item.date}</td>
                      <td className="p-2 border text-center">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-cyan-500 text-white rounded hover:bg-cyan-600 text-xs"
                        >
                          Download
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400">
                No records found.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DownloadPage;
