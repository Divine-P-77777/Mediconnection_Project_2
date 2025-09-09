"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/supabase/client";
import { Button } from "@/components/ui/button";

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
      if (onUpdate) onUpdate();
    } catch (err) {
      alert("Delete failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Submit new files
  const handleSubmit = async () => {
    if (!appointmentId) return alert("Invalid appointment!");
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
      alert("Documents uploaded successfully!");
      if (onUpdate) onUpdate();
      onClose();
    } catch (err) {
      alert("Upload failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // File list renderer
  const renderFileList = (fileType) => (
    <div className="flex flex-wrap gap-2 mt-2">
      {files[fileType]?.length === 0 ? (
        <span className="text-xs text-gray-400">No files</span>
      ) : (
        files[fileType].map((url) => (
          <div
            key={url}
            className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded"
          >
            <span className="truncate max-w-[90px] text-xs">{url.split("/").pop()}</span>
            <Button size="xs" variant="outline" onClick={() => window.open(url, "_blank")}>
              View
            </Button>
            <Button size="xs" variant="destructive" onClick={() => handleDelete(fileType, url)}>
              Delete
            </Button>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-lg space-y-4">
        <h2 className="text-lg font-bold">Upload/View Documents</h2>

        <div>
          <label className="block mb-1">Reports (PDF)</label>
          <input type="file" multiple accept="application/pdf" onChange={(e) => handleFiles(e, "reports")} />
          {renderFileList("reports")}
        </div>

        <div>
          <label className="block mb-1">Bills (PDF)</label>
          <input type="file" multiple accept="application/pdf" onChange={(e) => handleFiles(e, "bills")} />
          {renderFileList("bills")}
        </div>

        <div>
          <label className="block mb-1">Prescriptions (PDF)</label>
          <input type="file" multiple accept="application/pdf" onChange={(e) => handleFiles(e, "prescriptions")} />
          {renderFileList("prescriptions")}
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button onClick={onClose} variant="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </div>
    </div>
  );
}
