"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/supabase/client";
import { format } from "date-fns";
import { Dialog } from "@headlessui/react";

export default function ConsultationsTable() {
  const [consults, setConsults] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedConsult, setSelectedConsult] = useState(null);

  const pageSize = 5;

  // Fetch consultations
  const fetchConsults = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("liveconsult")
        .select("*, doctors(name)")
        .order("created_at", { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);

      if (search) {
        query = query.ilike("full_name", `%${search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      setConsults(data || []);
    } catch (err) {
      console.error("Fetch error:", err.message);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  // Initial & reactive fetch
  useEffect(() => {
    fetchConsults();
  }, [fetchConsults]);

  // Re-fetch after booking (listen to custom event)
  useEffect(() => {
    const handleRefresh = () => fetchConsults();
    window.addEventListener("consult-booked", handleRefresh);
    return () => window.removeEventListener("consult-booked", handleRefresh);
  }, [fetchConsults]);

  // Parse consultation time slot "09:00 PM - 11:00 PM"
  function canJoinConsult(c) {
    if (c.status !== "approved" || !c.consultation_time) return false;

    try {
      const [startTimeStr, endTimeStr] = c.consultation_time.split(" - ");
      const startDateTime = new Date(`${c.consultation_date} ${startTimeStr}`);
      const endDateTime = new Date(`${c.consultation_date} ${endTimeStr}`);
      const now = new Date();

      return now >= startDateTime && now <= endDateTime;
    } catch (err) {
      console.error("Time parse error:", err);
      return false;
    }
  }

  return (
    <div className="mt-16 max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Recent Consultations</h2>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by patient name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border rounded-lg"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border rounded-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Patient</th>
              <th className="p-3 text-left">Consult Type</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-center">View</th>
              <th className="p-3 text-center">Join</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center p-4">
                  Loading...
                </td>
              </tr>
            ) : consults.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-4">
                  No consultations found.
                </td>
              </tr>
            ) : (
              consults.map((c) => (
                <tr key={c.id} className="border-b">
                  <td className="p-3">
                    {format(new Date(c.consultation_date), "dd MMM yyyy")} <br />
                    <span className="text-sm text-gray-500">{c.consultation_time}</span>
                  </td>
                  <td className="p-3">{c.full_name}</td>
                  <td className="p-3">{c.speciality}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        c.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : c.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : c.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => setSelectedConsult(c)}
                      className="px-3 py-1 bg-cyan-500 text-white rounded-md hover:bg-cyan-600"
                    >
                      View
                    </button>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      disabled={!canJoinConsult(c)}
                      className={`px-3 py-1 rounded-md ${
                        canJoinConsult(c)
                          ? "bg-green-500 text-white hover:bg-green-600"
                          : "bg-gray-300 text-gray-600 cursor-not-allowed"
                      }`}
                      onClick={() => window.open(c.meet_url, "_blank")}
                    >
                      Join Now
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4 gap-2">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="px-3 py-1 border rounded disabled:opacity-50"
          disabled={page === 1}
        >
          Prev
        </button>
        <span className="px-3 py-1">{page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 border rounded"
        >
          Next
        </button>
      </div>

      {/* View Details Modal */}
      {selectedConsult && (
        <Dialog
          open={true}
          onClose={() => setSelectedConsult(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        >
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h3 className="text-lg font-bold mb-2">Consultation Details</h3>
            <p>
              <strong>Patient:</strong> {selectedConsult.full_name}
            </p>
            <p>
              <strong>DOB:</strong> {selectedConsult.dob}
            </p>
            <p>
              <strong>Email:</strong> {selectedConsult.email}
            </p>
            <p>
              <strong>Phone:</strong> {selectedConsult.phone}
            </p>
            <p>
              <strong>Speciality:</strong> {selectedConsult.speciality}
            </p>
            <p>
              <strong>Status:</strong> {selectedConsult.status}
            </p>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setSelectedConsult(null)}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}
