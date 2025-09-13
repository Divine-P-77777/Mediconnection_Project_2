"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/supabase/client";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useSelector } from "react-redux";
import { Loader2 } from "lucide-react";
import Popup from "./Popup";

const ROWS_PER_PAGE = 10;

export default function ManageAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [healthCenterId, setHealthCenterId] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { Success, errorToast } = useToast();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  // Fetch health center id
  useEffect(() => {
    const fetchHealthCenterId = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user?.id) return setLoading(false);

        const { data: center, error } = await supabase
          .from("health_centers")
          .select("id")
          .eq("user_id", user.id)
          .single();
        if (error) throw error;

        setHealthCenterId(center?.id || null);
      } catch (err) {
        errorToast(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHealthCenterId();
  }, []);

  // Fetch appointments
  const fetchAppointments = async () => {
    if (!healthCenterId) return setLoading(false);
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .eq("center_id", healthCenterId)
        .order("date", { ascending: false }) // recent date first
        .order("time", { ascending: false }); // recent time first
      if (error) throw error;
      setAppointments(data || []);
    } catch (err) {
      errorToast(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!healthCenterId) return;
    fetchAppointments();
  }, [healthCenterId]);

  // Update status
  const handleStatusChange = async (id, status) => {
    try {
      const { error } = await supabase
        .from("appointments")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
      Success(`✅ Status updated to ${status}`);
      fetchAppointments();
    } catch (err) {
      errorToast(err.message);
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(appointments.length / ROWS_PER_PAGE);
  const paginatedAppointments = appointments.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE
  );

  return (
    <div
      className={`w-full min-h-screen py-20 px-6 transition-colors ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Manage Appointments
        </h1>

        <Card className={`shadow-xl ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
          <CardHeader>
            <CardTitle className="text-cyan-600">Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
              </div>
            ) : appointments.length === 0 ? (
              <div className="text-center py-10 text-gray-500">No appointments found.</div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table className={isDarkMode ? "bg-gray-800 text-white" : "bg-white"}>
                    <TableHead className={isDarkMode ? "bg-gray-700 text-white" : "bg-gray-100"}>
                      <TableRow>
                        <TableCell>User Name</TableCell>
                        <TableCell>Phone</TableCell>
                        <TableCell>Gender</TableCell>
                        <TableCell>DOB</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Time</TableCell>
                        <TableCell>Purpose</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Upload Docs</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedAppointments.map((app) => (
                        <TableRow
                          key={app.id}
                          className={`transition-colors ${
                            isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                          }`}
                        >
                          <TableCell>{app.user_name}</TableCell>
                          <TableCell>{app.phone}</TableCell>
                          <TableCell>{app.gender}</TableCell>
                          <TableCell>{app.dob ? format(new Date(app.dob), "dd/MM/yyyy") : "-"}</TableCell>
                          <TableCell>{format(new Date(app.date), "dd/MM/yyyy")}</TableCell>
                          <TableCell>{app.time}</TableCell>
                          <TableCell>{app.purpose}</TableCell>
                          <TableCell>
                            <select
                              value={app.status}
                              onChange={(e) => handleStatusChange(app.id, e.target.value)}
                              className={`border rounded px-2 py-1 text-sm w-full ${
                                isDarkMode
                                  ? "bg-gray-700 border-gray-600 text-white"
                                  : "bg-white border-gray-300 text-gray-900"
                              }`}
                            >
                              {["pending", "confirmed", "completed", "cancelled"].map((s) => (
                                <option key={s} value={s}>
                                  {s.charAt(0).toUpperCase() + s.slice(1)}
                                </option>
                              ))}
                            </select>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              className="bg-cyan-500 hover:bg-cyan-600 text-white"
                              onClick={() => setSelectedAppointment(app)}
                            >
                              Upload
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                <div className="flex justify-between items-center mt-4">
                  <Button
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                  >
                    Previous
                  </Button>
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                  >
                    Next
                  </Button>
                </div>
              </>
            )}

            {selectedAppointment && (
              <Popup
                appointmentId={selectedAppointment.id}
                onClose={() => setSelectedAppointment(null)}
                onUpdate={fetchAppointments}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
