"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

// ✅ Fetch directly from Supabase
async function fetchFiles(appointmentId) {
  const { data, error } = await supabase
    .from("appointments")
    .select("reports, bills, prescriptions")
    .eq("id", appointmentId)
    .single();

  if (error) {
    console.error("Error fetching files:", error.message);
    return { reports: [], bills: [], prescriptions: [] };
  }
  return {
    reports: data?.reports || [],
    bills: data?.bills || [],
    prescriptions: data?.prescriptions || [],
  };
}

export default function Popup({ appointmentId, onClose, onUpdate }) {
  const { toast } = useToast();
  const [files, setFiles] = useState({ reports: [], bills: [], prescriptions: [] });
  const [newFiles, setNewFiles] = useState({ reports: [], bills: [], prescriptions: [] });
  const [loading, setLoading] = useState(false);

  // ✅ Fetch existing files from Supabase when popup opens
  useEffect(() => {
    if (!appointmentId) return;
    setLoading(true);
    fetchFiles(appointmentId)
      .then(setFiles)
      .finally(() => setLoading(false));
  }, [appointmentId]);

  // Handle new file selection
  const handleFiles = (e, type) =>
    setNewFiles((prev) => ({
      ...prev,
      [type]: Array.from(e.target.files),
    }));

  // Upload files to backend (Cloudinary)
  const uploadToCloudinary = async (filesArr, fileType) => {
    const uploadedUrls = [];
    for (const file of filesArr) {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`/api/upload?appointmentId=${appointmentId}&fileType=${fileType}`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error(`Failed to upload ${file.name}`);
      const data = await res.json();
      if (data.url) uploadedUrls.push(data.url);
    }
    return uploadedUrls;
  };

  // Delete a file
  const handleDelete = async (fileType, url) => {
    setLoading(true);
    try {
      await fetch(`/api/upload`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId, fileType, url }),
      });
      setFiles((prev) => ({
        ...prev,
        [fileType]: prev[fileType].filter((u) => u !== url),
      }));
      toast({ description: "File deleted successfully", variant: "success" });
      if (onUpdate) onUpdate();
    } catch (err) {
      toast({ description: `Delete failed: ${err.message}`, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // Submit new files
  const handleSubmit = async () => {
    if (!appointmentId) return toast({ description: "Invalid appointment!", variant: "destructive" });
    setLoading(true);
    try {
      for (const type of ["reports", "bills", "prescriptions"]) {
        if (newFiles[type]?.length) {
          const urls = await uploadToCloudinary(newFiles[type], type);
          setFiles((prev) => ({
            ...prev,
            [type]: [...prev[type], ...urls],
          }));
        }
      }
      toast({ description: "Documents uploaded successfully!", variant: "success" });
      if (onUpdate) onUpdate();
      onClose();
    } catch (err) {
      toast({ description: `Upload failed: ${err.message}`, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // File list renderer
  const renderFileList = (fileType) => (
    <div className="flex flex-wrap gap-2 mt-2">
      {files[fileType]?.length === 0 ? (
        <span className="text-xs text-gray-400 dark:text-gray-500">No files</span>
      ) : (
        files[fileType].map((url) => (
          <div
            key={url}
            className="flex items-center gap-1 bg-cyan-100 dark:bg-cyan-700/40 px-2 py-1 rounded-md"
          >
            <span className="truncate max-w-[90px] text-xs">{url.split("/").pop()}</span>
            <Button size="xs" variant="outline" onClick={() => window.open(url, "_blank")}>
              View
            </Button>
            <Button
              size="xs"
              variant="destructive"
              onClick={() => handleDelete(fileType, url)}
              disabled={loading}
            >
              Delete
            </Button>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-lg space-y-4 shadow-xl">
        <h2 className="text-lg font-bold text-cyan-600 dark:text-cyan-400">Upload/View Documents</h2>

        <div>
          <label className="block mb-1 font-medium">Reports (PDF)</label>
          <input
            type="file"
            multiple
            accept="application/pdf"
            className="dark:text-gray-200"
            onChange={(e) => handleFiles(e, "reports")}
          />
          {renderFileList("reports")}
        </div>

        <div>
          <label className="block mb-1 font-medium">Bills (PDF)</label>
          <input
            type="file"
            multiple
            accept="application/pdf"
            className="dark:text-gray-200"
            onChange={(e) => handleFiles(e, "bills")}
          />
          {renderFileList("bills")}
        </div>

        <div>
          <label className="block mb-1 font-medium">Prescriptions (PDF)</label>
          <input
            type="file"
            multiple
            accept="application/pdf"
            className="dark:text-gray-200"
            onChange={(e) => handleFiles(e, "prescriptions")}
          />
          {renderFileList("prescriptions")}
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button onClick={onClose} variant="secondary" disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Upload"}
          </Button>
        </div>
      </div>
    </div>
  );
}
