"use client";

import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { Dialog } from "@headlessui/react";
import { Loader } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useAppSelector } from "@/store/hooks";


interface Consultation {
  id: string;
  full_name: string;
  dob: string;
  email: string;
  phone: string;
  speciality: string;
  status: "approved" | "pending" | "rejected" | string;
  consultation_date: string;
  consultation_time: string;
  meet_url?: string;
}

export default function ConsultationsTable() {
  const [consults, setConsults] = useState<Consultation[]>([]);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [selectedConsult, setSelectedConsult] =
    useState<Consultation | null>(null);

  const { user } = useAuth();
  const { errorToast, success: Success } = useToast();
  const pageSize = 10;

  const isDarkMode = useAppSelector(
    (state) => state.theme.isDarkMode
  );

  const fetchConsults = useCallback(async (): Promise<void> => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const res = await fetch(
        `/api/liveconsult/history?page=${page}&q=${search}&pageSize=${pageSize}`,
        {
          headers: {
            "x-user-id": user.id,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch consultations");

      const data: Consultation[] = await res.json();
      setConsults(data);
    } catch (err) {
      console.error(err);
      setConsults([]);
      errorToast("Error fetching consultations");
    } finally {
      setLoading(false);
    }
  }, [page, search, user?.id, errorToast]);

  useEffect(() => {
    if (user?.id) {
      fetchConsults();
    }
  }, [fetchConsults, user?.id]);

  useEffect(() => {
    const handleRefresh = (): void => {
      fetchConsults();
      Success("Consultations list refreshed");
    };

    window.addEventListener("consult-booked", handleRefresh);
    return () =>
      window.removeEventListener("consult-booked", handleRefresh);
  }, [fetchConsults, Success]);

  function canJoinConsult(c: Consultation): boolean {
    if (c.status !== "approved" || !c.consultation_time) return false;

    try {
      const [startTimeStr, endTimeStr] =
        c.consultation_time.split(" - ");
      const startDateTime = new Date(
        `${c.consultation_date} ${startTimeStr}`
      );
      const endDateTime = new Date(
        `${c.consultation_date} ${endTimeStr}`
      );
      const now = new Date();

      return now >= startDateTime && now <= endDateTime;
    } catch (err) {
      console.error("Time parse error:", err);
      return false;
    }
  }

  return (
    <div className="py-16 max-w-6xl mx-auto px-4">
      <h2 className="text-2xl font-semibold mb-4">
        Recent Consultations
      </h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by patient name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-cyan-500 ${isDarkMode
            ? "bg-gray-800 text-white border-gray-700 placeholder-gray-400"
            : "bg-white border-gray-300"
            }`}
        />
      </div>

      <div className="overflow-x-auto shadow-md rounded-lg">
        <table
          className={`w-full border-collapse ${isDarkMode ? "text-gray-200" : "text-gray-800"
            }`}
        >
          <thead
            className={isDarkMode ? "bg-gray-800" : "bg-cyan-100"}
          >
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
                <td colSpan={6} className="text-center p-6">
                  <Loader className="w-6 h-6 animate-spin mx-auto" />
                </td>
              </tr>
            ) : consults.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-4">
                  No consultations found.
                </td>
              </tr>
            ) : (
              consults.map((c) => (
                <tr
                  key={c.id}
                  className={`border-b transition ${isDarkMode
                    ? "border-gray-700 hover:bg-black"
                    : "border-gray-200 hover:bg-cyan-50"
                    }`}
                >
                  <td className="p-3">
                    {format(
                      new Date(c.consultation_date),
                      "dd MMM yyyy"
                    )}
                    <br />
                    <span className="text-sm text-gray-500">
                      {c.consultation_time}
                    </span>
                  </td>
                  <td className="p-3">{c.full_name}</td>
                  <td className="p-3">{c.speciality}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${c.status === "approved"
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
                      className="px-4 py-1 bg-cyan-500 text-white rounded-md hover:bg-cyan-600"
                    >
                      View
                    </button>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      disabled={!canJoinConsult(c)}
                      onClick={() =>
                        c.meet_url &&
                        window.open(c.meet_url, "_blank")
                      }
                      className={`px-4 py-1 rounded-md transition-colors ${canJoinConsult(c)
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "bg-gray-300 text-gray-600 cursor-not-allowed"
                        }`}
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

      <div
        className={`flex justify-center mt-6 gap-2 ${isDarkMode ? "text-white" : "text-gray-800"
          }`}
      >
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 border rounded-lg"
        >
          Prev
        </button>
        <span className="px-4 py-2 border rounded-full">{page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 border rounded-lg"
        >
          Next
        </button>
      </div>

      {selectedConsult && (
        <Dialog
          open
          onClose={() => setSelectedConsult(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        >
          <div
            className={`rounded-lg p-6 max-w-lg w-full ${isDarkMode
              ? "bg-gray-800 text-white"
              : "bg-white"
              }`}
          >
            <h3 className="text-lg font-bold mb-4">
              Consultation Details
            </h3>

            <div className="space-y-1 text-sm">
              <p>
                <strong>Patient:</strong>{" "}
                {selectedConsult.full_name}
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
                <strong>Speciality:</strong>{" "}
                {selectedConsult.speciality}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {selectedConsult.status}
              </p>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setSelectedConsult(null)}
                className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600"
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
