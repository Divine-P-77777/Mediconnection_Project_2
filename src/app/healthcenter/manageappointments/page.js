"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/supabase/client";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Popup from "./Popup";

export default function ManageAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Fetch logged-in health center user
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUser(user);
    };
    fetchUser();
  }, []);

  // Fetch appointments for this health center
  useEffect(() => {
    if (!user) return;

    const fetchAppointments = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .eq("center_id", user.id) // health center's supabase user id
        .order("date", { ascending: true })
        .order("time", { ascending: true });

      setLoading(false);
      if (error) return console.error(error.message);
      setAppointments(data || []);
    };

    fetchAppointments();
  }, [user]);

  // Update appointment status
  const updateStatus = async (id, status) => {
    const { error } = await supabase
      .from("appointments")
      .update({ status })
      .eq("id", id);

    if (error) return alert("Failed to update status");

    setAppointments((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status } : app))
    );
  };

  return (
    <div className="w-full min-h-screen p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Manage Appointments</h1>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-10">Loading...</div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-10">No appointments found.</div>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User Name</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Gender</TableCell>
                  <TableCell>DOB</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Purpose</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                  <TableCell>Upload Docs</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appointments.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell>{app.user_name}</TableCell>
                    <TableCell>{app.phone}</TableCell>
                    <TableCell>{app.gender}</TableCell>
                    <TableCell>{app.dob ? format(new Date(app.dob), "dd/MM/yyyy") : "-"}</TableCell>
                    <TableCell>{format(new Date(app.date), "dd/MM/yyyy")}</TableCell>
                    <TableCell>{app.time}</TableCell>
                    <TableCell>{app.purpose}</TableCell>
                    <TableCell>{app.status}</TableCell>
                    <TableCell className="space-x-2">
                      {["pending", "confirmed", "completed", "cancelled"]
                        .filter((s) => s !== app.status)
                        .map((s) => (
                          <Button
                            key={s}
                            size="sm"
                            onClick={() => updateStatus(app.id, s)}
                          >
                            {s}
                          </Button>
                        ))}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        onClick={() => setSelectedAppointment(app)}
                      >
                        Upload
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {selectedAppointment && (
            <Popup
              appointmentId={selectedAppointment.id}
              onClose={() => setSelectedAppointment(null)}
              onUpdate={async () => {
                // Refresh appointments after upload
                const { data, error } = await supabase
                  .from("appointments")
                  .select("*")
                  .eq("center_id", user.id)
                  .order("date", { ascending: true })
                  .order("time", { ascending: true });
                if (!error) setAppointments(data || []);
              }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
