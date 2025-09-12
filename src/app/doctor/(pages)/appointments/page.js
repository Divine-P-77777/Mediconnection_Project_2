"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Popup from "./Popup";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAuth } from "@/hooks/useAuth";
import { useSelector } from "react-redux";

export default function DoctorAppointments() {
  const { user } = useAuth();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const [appointments, setAppointments] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [loadingMeet, setLoadingMeet] = useState(null);
  const [loadingAppointments, setLoadingAppointments] = useState(false);

  const fetchAppointments = async () => {
    if (!user?.id) return;
    try {
      setLoadingAppointments(true);
      const res = await fetch(`/api/liveconsult/appointments?doctorId=${user.id}`);
      const { data, error } = await res.json();

      if (error) {
        console.error("Error fetching appointments:", error);
        return;
      }

      setAppointments(data || []);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    } finally {
      setLoadingAppointments(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [user]);

  const openPopup = (id) => {
    setSelectedId(id);
    setShowPopup(true);
  };

  const closePopup = () => {
    setSelectedId(null);
    setShowPopup(false);
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch("/api/liveconsult/appointments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId: id, status: newStatus }),
      });
      const { data, error } = await res.json();

      if (error) throw new Error(error);

      fetchAppointments();
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status");
    }
  };

const generateMeet = async (id, status) => {
  if (status !== "approved") {
    alert("You must approve this appointment before generating a link.");
    return;
  }
  setLoadingMeet(id);
  try {
    const res = await fetch(`/api/consultation/meet?appointmentId=${id}`);

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Server error (${res.status}): ${text}`);
    }

    const { success, error } = await res.json();
    if (!success) throw new Error(error);

    alert("Meet link generated!");
    fetchAppointments();
  } catch (err) {
    console.error("Meet generation failed:", err);
    alert("Failed to generate Meet link: " + err.message);
  } finally {
    setLoadingMeet(null);
  }
};


  // Chart Data
  const statusCounts = appointments.reduce((acc, appt) => {
    acc[appt.status] = (acc[appt.status] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(statusCounts).map(([status, count]) => ({
    status,
    count,
  }));

  return (
    <div className={`p-6 space-y-8 transition-colors ${isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
      <h1 className="text-2xl font-bold">Doctor Dashboard</h1>

      {/* Stats Chart */}
      <Card className={isDarkMode ? "bg-gray-800 border-gray-700" : ""}>
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-4">Appointments by Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="status" stroke={isDarkMode ? "#fff" : "#000"} />
              <YAxis stroke={isDarkMode ? "#fff" : "#000"} />
              <Tooltip />
              <Bar dataKey="count" fill="#06b6d4" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Appointments Table */}
      <Card className={isDarkMode ? "bg-gray-800 border-gray-700" : ""}>
        <CardContent className="overflow-x-auto">
          <h2 className="text-lg font-semibold mb-4">Appointments</h2>
          {loadingAppointments ? (
            <p className="text-center py-10">Loading appointments...</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className={isDarkMode ? "bg-gray-700" : "bg-gray-100"}>
                  {["Name","Email","Date","Time","Speciality","Status","Bill","Schedule","Actions"].map((th) => (
                    <th key={th} className="p-2 border">{th}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt) => (
                  <tr key={appt.id} className={`text-center border-b ${isDarkMode ? "border-gray-600" : ""}`}>
                    <td className="p-2 border">{appt.full_name}</td>
                    <td className="p-2 border">{appt.email}</td>
                    <td className="p-2 border">{appt.consultation_date}</td>
                    <td className="p-2 border">{appt.consultation_time}</td>
                    <td className="p-2 border">{appt.speciality}</td>
                    <td className="p-2 border">
                      <select
                        value={appt.status || "pending"}
                        onChange={(e) => updateStatus(appt.id, e.target.value)}
                        className={`border rounded px-2 py-1 ${isDarkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-black border-gray-300"}`}
                      >
                        {["pending","approved","completed","rejected"].map((status) => (
                          <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2 border">₹{appt.bill ?? 0}</td>
                    <td className="p-2 border">
                      {appt.meet_url ? (
                        <div className="flex flex-col items-center space-y-1">
                          <a
                            href={appt.meet_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline"
                          >
                            Join
                          </a>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigator.clipboard.writeText(appt.meet_url)}
                          >
                            Copy URL
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => generateMeet(appt.id, appt.status)}
                          disabled={loadingMeet === appt.id}
                        >
                          {loadingMeet === appt.id ? "Generating..." : "Generate"}
                        </Button>
                      )}
                    </td>
                    <td className="p-2 border">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openPopup(appt.id)}
                      >
                        Manage
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {showPopup && (
        <Popup
          consultId={selectedId}
          type="liveconsult"
          onClose={closePopup}
          onUpdate={fetchAppointments}
        />
      )}
    </div>
  );
}
