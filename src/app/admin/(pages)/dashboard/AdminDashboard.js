"use client";
import { useState, useEffect, useMemo } from "react";
import { Loader2, Check, X, Trash2, Search, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Loader from "../../../components/Loader";
import { useSelector } from "react-redux";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [localCenters, setLocalCenters] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCenter, setSelectedCenter] = useState(null);

  const { Success, errorToast } = useToast();
  const { session } = useAuth();
  const router = useRouter();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  const rowsPerPage = 10;

  useEffect(() => {
    if (!session) router.push("/auth/admin");
  }, [session, router]);

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const res = await fetch(`/api/managecenter`, {
          cache: "no-store",
          headers: { Authorization: `Bearer ${session?.access_token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch health centers");
        const { data } = await res.json();
        setLocalCenters(data || []);
      } catch (err) {
        errorToast(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCenters();
  }, [session]);

  const toggleApproval = async (id, approved) => {
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
      Success("Updated successfully");
      setLocalCenters((prev) =>
        prev.map((c) => (c.id === id ? { ...c, approved: !approved } : c))
      );
    } catch (err) {
      errorToast(err.message);
    }
  };

  const deleteCenter = async (id) => {
    if (!confirm("Are you sure you want to delete this health center?")) return;
    try {
      const res = await fetch(`/api/managecenter/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      Success("Deleted successfully");
      setLocalCenters((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      errorToast(err.message);
    }
  };

  const filteredCenters = useMemo(() => {
    const lowerQuery = searchQuery.toLowerCase();
    return localCenters.filter(
      (c) =>
        (c.name ?? "").toLowerCase().includes(lowerQuery) ||
        (c.email ?? "").toLowerCase().includes(lowerQuery) ||
        (c.hcrn_hfc ?? "").toLowerCase().includes(lowerQuery)
    );
  }, [localCenters, searchQuery]);

  const paginatedCenters = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredCenters.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredCenters, currentPage]);

  const totalPages = Math.ceil(filteredCenters.length / rowsPerPage);

  if (loading) return <Loader />;

  return (
    <div
      className={`p-6 pt-30 min-h-screen transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >

              <h2 className="text-3xl font-bold mb-2">Health Centers Management</h2>

      {/* Search */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSearchQuery(e.target.query.value);
          setCurrentPage(1);
        }}
        className="mb-4 flex items-center gap-2 max-w-md"
      >
        <input
          name="query"
          type="text"
          placeholder="Search health centers..."
          className={`flex-1 p-2 rounded-md border ${
            isDarkMode
              ? "bg-gray-700 border-gray-600 text-white"
              : "bg-white border-gray-300"
          }`}
        />
        <button type="submit" className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md">
          <Search size={20} />
        </button>
      </form>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse rounded-lg overflow-hidden shadow-md">
          <thead>
            <tr className={`${isDarkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-800"}`}>
              <th className="p-3 text-left border">Name</th>
              <th className="p-3 text-left border">User ID</th>
              <th className="p-3 text-left border">Email</th>
              <th className="p-3 text-left border">HCRN/HFC</th>
              <th className="p-3 text-left border">Contact</th>
              <th className="p-3 text-left border">Pincode</th>
              <th className="p-3 text-center border">Approved</th>
              <th className="p-3 text-center border">Actions</th>
              <th className="p-3 text-center border">View</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCenters.length > 0 ? (
              paginatedCenters.map((c) => (
                <tr key={c.id} className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <td className="p-3 border">{c.name}</td>
                  <td className="p-3 border">{c.id.slice(0, 8)}</td>
                  <td className="p-3 border">{c.email}</td>
                  <td className="p-3 border">{c.hcrn_hfc}</td>
                  <td className="p-3 border">{c.contact}</td>
                  <td className="p-3 border">{c.pincode}</td>
                  <td className="p-3 border text-center">
                    <button
                      onClick={() => toggleApproval(c.id, c.approved)}
                      className={`p-2 rounded-full transition-colors ${
                        c.approved
                          ? "bg-green-500 hover:bg-green-600 text-white"
                          : "bg-red-500 hover:bg-red-600 text-white"
                      }`}
                    >
                      {c.approved ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                    </button>
                  </td>
                  <td className="p-3 border text-center">
                    <button
                      onClick={() => deleteCenter(c.id)}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                  <td className="p-3 border text-center">
                    <button
                      onClick={() => setSelectedCenter(c)}
                      className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center p-6 text-gray-500 dark:text-gray-400">
                  No health centers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center items-center gap-2">
          <Button
            variant="secondary"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            Prev
          </Button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="secondary"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Popup */}
      <Dialog open={!!selectedCenter} onOpenChange={() => setSelectedCenter(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Health Center Details</DialogTitle>
          </DialogHeader>
          {selectedCenter && (
            <div className="space-y-2">
              <p><strong>Name:</strong> {selectedCenter.name}</p>
              <p><strong>HCRN/HFC:</strong> {selectedCenter.hcrn_hfc}</p>
              <p><strong>Email:</strong> {selectedCenter.email}</p>
              <p><strong>Address:</strong> {selectedCenter.address}</p>
              <p><strong>Phone:</strong> {selectedCenter.contact}</p>
              <p><strong>Pincode:</strong> {selectedCenter.pincode}</p>
              <p><strong>Created:</strong> {new Date(selectedCenter.created_at).toLocaleString()}</p>
              <p>
                <strong>Document Proof:</strong>{" "}
                {selectedCenter.document_proof ? (
                  <a
                    href={selectedCenter.document_proof}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    View Document
                  </a>
                ) : (
                  "Not provided"
                )}
              </p>
              <p>
                <strong>Account Details:</strong> {selectedCenter.has_account ? "Added" : "Not Added"}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}