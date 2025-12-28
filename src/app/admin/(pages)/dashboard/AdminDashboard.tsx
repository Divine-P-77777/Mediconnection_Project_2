"use client";

import { useState, useEffect, useMemo, JSX } from "react";
import { Check, X, Trash2, Search, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Loader from "../../../components/Loader";
import { useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

/* ---------------------------------- */
/* Types */
/* ---------------------------------- */
interface HealthCenter {
  id: string;
  name: string;
  email: string;
  hcrn_hfc: string;
  contact: string;
  pincode: string;
  address?: string;
  document_proof?: string | null;
  has_account?: boolean;
  approved: boolean;
  created_at: string;
}

/* ---------------------------------- */
/* Component */
/* ---------------------------------- */
export default function AdminDashboard(): JSX.Element {
  const { session, loading: authLoading } = useAuth();
  const router = useRouter();
  const { success: Success, errorToast } = useToast();
  const isDarkMode = useSelector((state: any) => state.theme.isDarkMode);

  const [loading, setLoading] = useState(true);
  const [localCenters, setLocalCenters] = useState<HealthCenter[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCenter, setSelectedCenter] = useState<HealthCenter | null>(
    null
  );

  const rowsPerPage = 10;

  /* ---------- Auth Guard ---------- */
  useEffect(() => {
    if (authLoading) return;

    if (!session) {
      router.replace("/auth/admin");
    }
  }, [session, authLoading, router]);

  /* ---------- Fetch Centers ---------- */
  useEffect(() => {
    if (!session) return;

    const fetchCenters = async () => {
      try {
        const res = await fetch("/api/managecenter", {
          cache: "no-store",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch health centers");

        const { data } = await res.json();
        setLocalCenters(data ?? []);
      } catch (err: any) {
        errorToast(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCenters();
  }, [session, errorToast]);

  /* ---------- Actions ---------- */
  const toggleApproval = async (id: string, approved: boolean) => {
    try {
      const res = await fetch(`/api/managecenter/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ approved: !approved }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      Success("Approval status updated");

      setLocalCenters((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, approved: !approved } : c
        )
      );
    } catch (err: any) {
      errorToast(err.message);
    }
  };

  const deleteCenter = async (id: string) => {
    const ok = window.confirm(
      "Are you sure you want to delete this health center?"
    );
    if (!ok) return;

    try {
      const res = await fetch(`/api/managecenter/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      Success("Health center deleted");

      setLocalCenters((prev) => prev.filter((c) => c.id !== id));
    } catch (err: any) {
      errorToast(err.message);
    }
  };

  /* ---------- Filtering ---------- */
  const filteredCenters = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return localCenters.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.hcrn_hfc.toLowerCase().includes(q)
    );
  }, [localCenters, searchQuery]);

  const paginatedCenters = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredCenters.slice(start, start + rowsPerPage);
  }, [filteredCenters, currentPage]);

  const totalPages = Math.ceil(filteredCenters.length / rowsPerPage);

  if (loading || authLoading) return <Loader />;

  /* ---------------------------------- */
  /* Render */
  /* ---------------------------------- */
  return (
    <div
      className={`p-6 pt-28 min-h-screen ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
        }`}
    >
      <h2 className="text-3xl font-bold mb-4">
        Health Centers Management
      </h2>

      {/* Search */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          const value = (form.query as HTMLInputElement).value;
          setSearchQuery(value);
          setCurrentPage(1);
        }}
        className="mb-4 flex gap-2 max-w-md"
      >
        <input
          name="query"
          placeholder="Search health centers..."
          className={`flex-1 p-2 rounded border ${isDarkMode
              ? "bg-gray-700 border-gray-600"
              : "bg-white border-gray-300"
            }`}
        />
        <button className="p-2 bg-blue-600 text-white rounded">
          <Search size={18} />
        </button>
      </form>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse shadow rounded-lg">
          <thead>
            <tr className={isDarkMode ? "bg-gray-700" : "bg-gray-200"}>
              {[
                "Name",
                "ID",
                "Email",
                "HCRN/HFC",
                "Contact",
                "Pincode",
                "Approved",
                "Delete",
                "View",
              ].map((h) => (
                <th key={h} className="p-3 border text-left">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {paginatedCenters.length ? (
              paginatedCenters.map((c) => (
                <tr key={c.id}>
                  <td className="p-3 border">{c.name}</td>
                  <td className="p-3 border">{c.id.slice(0, 8)}</td>
                  <td className="p-3 border">{c.email}</td>
                  <td className="p-3 border">{c.hcrn_hfc}</td>
                  <td className="p-3 border">{c.contact}</td>
                  <td className="p-3 border">{c.pincode}</td>

                  <td className="p-3 border text-center">
                    <button
                      onClick={() => toggleApproval(c.id, c.approved)}
                      className={`p-2 rounded-full ${c.approved
                          ? "bg-green-600"
                          : "bg-red-600"
                        } text-white`}
                    >
                      {c.approved ? <Check size={16} /> : <X size={16} />}
                    </button>
                  </td>

                  <td className="p-3 border text-center">
                    <button
                      onClick={() => deleteCenter(c.id)}
                      className="bg-red-600 p-2 rounded-full text-white"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>

                  <td className="p-3 border text-center">
                    <button
                      onClick={() => setSelectedCenter(c)}
                      className="bg-blue-600 p-2 rounded-full text-white"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="p-6 text-center opacity-60">
                  No health centers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-4">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Prev
          </Button>
          <span>
            Page {currentPage} / {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}

      {/* Dialog */}
      <Dialog open={!!selectedCenter} onOpenChange={() => setSelectedCenter(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Health Center Details</DialogTitle>
          </DialogHeader>

          {selectedCenter && (
            <div className="space-y-2 text-sm">
              <p><strong>Name:</strong> {selectedCenter.name}</p>
              <p><strong>Email:</strong> {selectedCenter.email}</p>
              <p><strong>Address:</strong> {selectedCenter.address}</p>
              <p><strong>Phone:</strong> {selectedCenter.contact}</p>
              <p><strong>Pincode:</strong> {selectedCenter.pincode}</p>
              <p>
                <strong>Created:</strong>{" "}
                {new Date(selectedCenter.created_at).toLocaleString()}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
