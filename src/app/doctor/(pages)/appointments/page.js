"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/supabase/client";
import { Button } from "@/components/ui/button";
import Popup from "./Popup";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [loadingMeet, setLoadingMeet] = useState(null);

  const fetchAppointments = async () => {
    const { data, error } = await supabase
      .from("liveconsult")
      .select("id, full_name, email, consultation_date, consultation_time, speciality, status, bill, prescriptions, reports, meet_url")
      .order("consultation_date", { ascending: false });

    if (error) {
      console.error("Error fetching appointments:", error);
    } else {
      setAppointments(data || []);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const openPopup = (id) => {
    setSelectedId(id);
    setShowPopup(true);
  };

  const closePopup = () => {
    setSelectedId(null);
    setShowPopup(false);
  };

  // Handle status update
  const updateStatus = async (id, newStatus) => {
    const { error } = await supabase
      .from("liveconsult")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    } else {
      fetchAppointments();
    }
  };

  // Generate Meet link
  const generateMeet = async (id, status) => {
    if (status !== "approved") {
      alert("You must approve this appointment before generating a link.");
      return;
    }
    setLoadingMeet(id);
    try {
      const res = await fetch(`/api/consultation/meet?appointmentId=${id}`);
      const data = await res.json();

      if (data.success) {
        alert("Meet link generated!");
        fetchAppointments();
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      console.error("Meet generation failed:", err);
      alert("Failed to generate Meet link");
    } finally {
      setLoadingMeet(null);
    }
  };

  // Chart Data: count appointments by status
  const statusCounts = appointments.reduce((acc, appt) => {
    acc[appt.status] = (acc[appt.status] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(statusCounts).map(([status, count]) => ({
    status,
    count,
  }));

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Doctor Dashboard</h1>

      {/* Stats Chart */}
      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-4">Appointments by Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#06b6d4" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Appointments Table */}
      <Card>
        <CardContent className="overflow-x-auto">
          <h2 className="text-lg font-semibold mb-4">Appointments</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Time</th>
                <th className="p-2 border">Speciality</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Bill</th>
                <th className="p-2 border">Schedule</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr key={appt.id} className="text-center border-b">
                  <td className="p-2 border">{appt.full_name}</td>
                  <td className="p-2 border">{appt.email}</td>
                  <td className="p-2 border">{appt.consultation_date}</td>
                  <td className="p-2 border">{appt.consultation_time}</td>
                  <td className="p-2 border">{appt.speciality}</td>
                  <td className="p-2 border">
                    <select
                      value={appt.status || "pending"}
                      onChange={(e) => updateStatus(appt.id, e.target.value)}
                      className="border rounded px-2 py-1"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="completed">Completed</option>
                      <option value="rejected">Rejected</option>
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
        className="text-blue-600 underline"
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
        </CardContent>
      </Card>

{showPopup && (
  <Popup
    id={selectedId}         
    type="liveconsult"        
    onClose={closePopup}
    onUpdate={fetchAppointments}
  />
)}

    </div>
  );
}
