"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import {
  Download,
  Calendar,
  Clock,
  MapPin,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { useAppSelector } from "@/store/hooks";
import { generateAppointmentPDF } from "@/utils/pdfGenerator";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

/* -------------------- TYPES -------------------- */

type AppointmentStatus =
  | "confirmed"
  | "pending"
  | "completed"
  | "cancelled"
  | string;

interface Appointment {
  id: string;
  date: string | Date;
  time: string;
  center_name?: string;
  user_name?: string;
  purpose: string;
  status: AppointmentStatus;
}

interface AppointmentsApiResponse {
  success: boolean;
  appointments: Appointment[];
  error?: string;
}

/* -------------------- COMPONENT -------------------- */

export default function MyBookingsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { errorToast, success: Success } = useToast();
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const itemsPerPage = 5;

  /* -------------------- EFFECTS -------------------- */

  useEffect(() => {
    if (user) fetchAppointments();
  }, [user]);

  useEffect(() => {
    filterData();
  }, [appointments, statusFilter]);

  /* -------------------- DATA FETCH -------------------- */

  const fetchAppointments = async (): Promise<void> => {
    setLoading(true);
    try {
      const userId = (user as any)?._id || (user as any)?.id;
      const res = await fetch(`/api/appointments/my?user_id=${userId}`);
      const data: AppointmentsApiResponse = await res.json();

      if (data.success) {
        setAppointments(data.appointments);
      } else {
        errorToast(data.error ?? "Failed to fetch appointments");
      }
    } catch {
      errorToast("Something went wrong while fetching appointments");
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- FILTER -------------------- */

  const filterData = (): void => {
    let data = [...appointments];

    if (statusFilter !== "All") {
      data = data.filter(
        (app) =>
          app.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    setFilteredAppointments(data);
    setCurrentPage(1);
  };

  /* -------------------- PAGINATION -------------------- */

  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);

  const paginatedData = filteredAppointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  /* -------------------- ACTIONS -------------------- */

  const handleDownloadPDF = (appointment: Appointment): void => {
    const success = generateAppointmentPDF(appointment, user as any);
    success
      ? Success("PDF downloaded successfully!")
      : errorToast("Failed to generate PDF.");
  };

  const getStatusColor = (status?: string): string => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "text-green-500 bg-green-100 dark:bg-green-900/20";
      case "pending":
        return "text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20";
      case "cancelled":
        return "text-red-500 bg-red-100 dark:bg-red-900/20";
      case "completed":
        return "text-blue-500 bg-blue-100 dark:bg-blue-900/20";
      default:
        return "text-gray-500 bg-gray-100 dark:bg-gray-800";
    }
  };

  /* -------------------- STYLES -------------------- */

  const pageBg = isDarkMode
    ? "bg-slate-900 text-white"
    : "bg-gray-50 text-gray-900";

  const cardBg = isDarkMode
    ? "bg-slate-800 border-slate-700"
    : "bg-white border-gray-200";

  const tableHeadBg = isDarkMode
    ? "bg-slate-900 text-gray-300"
    : "bg-gray-100 text-gray-700";

  const tableRowHover = isDarkMode
    ? "hover:bg-slate-700/50"
    : "hover:bg-gray-50";

  /* -------------------- LOADING -------------------- */

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${pageBg}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500" />
      </div>
    );
  }

  /* -------------------- RENDER -------------------- */

  return (
    <div className={`min-h-screen py-32 px-4 sm:px-8 ${pageBg}`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
            My Appointments
          </h1>

          <div className="flex items-center gap-4">
            {/* BLINKING BUTTON */}
            <button
              onClick={() => router.push("/user/book")}
              className="px-4 py-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-full font-semibold shadow-lg hover:shadow-emerald-500/50 transition-all transform hover:scale-105"
            >
              Book Another
            </button>

            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`p-2 rounded-lg border outline-none focus:ring-2 focus:ring-cyan-500 ${isDarkMode
                  ? "bg-slate-800 border-slate-700 text-white"
                  : "bg-white border-gray-300 text-gray-800"
                  }`}
              >
                <option value="All">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className={`rounded-xl border overflow-hidden shadow-lg ${cardBg}`}>
          <table className="w-full">
            <thead>
              <tr className={`text-sm font-semibold ${tableHeadBg}`}>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Health Center</th>
                <th className="p-4">Patient</th>
                <th className="p-4">Purpose</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((app) => (
                <tr key={app.id} className={tableRowHover}>
                  <td className="p-4">
                    {format(new Date(app.date), "MMM d, yyyy")} — {app.time}
                  </td>
                  <td className="p-4">{app.center_name}</td>
                  <td className="p-4">{app.user_name}</td>
                  <td className="p-4">{app.purpose}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(app.status)}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <Button
                      variant="outline"
                      className="h-8 w-8 p-0 border-none shadow-none hover:bg-slate-100 dark:hover:bg-slate-800 bg-transparent text-slate-500"
                      onClick={() => handleDownloadPDF(app)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
