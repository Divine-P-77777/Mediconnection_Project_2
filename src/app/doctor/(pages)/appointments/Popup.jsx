// app/components/LiveConsultPopup.jsx
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/supabase/client";
import { Button } from "@/components/ui/button";

async function fetchFiles(consultId) {
  const { data, error } = await supabase
    .from("liveconsult")
    .select("reports, bills, prescriptions")
    .eq("id", consultId)
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

export default function LiveConsultPopup({ consultId, onClose, onUpdate }) {
  const [files, setFiles] = useState({ reports: [], bills: [], prescriptions: [] });
  const [newFiles, setNewFiles] = useState({ reports: [], bills: [], prescriptions: [] });
  const [loading, setLoading] = useState(false);

  // Fetch files when popup opens
  useEffect(() => {
    if (!consultId) return;
    setLoading(true);
    fetchFiles(consultId)
      .then(setFiles)
      .finally(() => setLoading(false));
  }, [consultId]);

  // Handle new file selection
  const handleFiles = (e, type) => {
    setNewFiles((prev) => ({
      ...prev,
      [type]: Array.from(e.target.files),
    }));
  };

  //  Upload files to Cloudinary via API
  const uploadToCloudinary = async (filesArr, fileType) => {
    const uploadedUrls = [];
    for (const file of filesArr) {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`/api/upload?consultId=${consultId}&fileType=${fileType}`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error(`Failed to upload ${file.name}`);
      const data = await res.json();
      if (data.url) uploadedUrls.push(data.url);
    }
    return uploadedUrls;
  };

  //  Delete file from Supabase
  const handleDelete = async (fileType, url) => {
    setLoading(true);
    try {
      const updatedList = files[fileType].filter((u) => u !== url);
      const { error } = await supabase
        .from("liveconsult")
        .update({ [fileType]: updatedList })
        .eq("id", consultId);

      if (error) throw error;

      setFiles((prev) => ({
        ...prev,
        [fileType]: updatedList,
      }));
      if (onUpdate) onUpdate();
    } catch (err) {
      alert("Delete failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  //  Submit new files & update Supabase
  const handleSubmit = async () => {
    if (!consultId) return alert("Invalid consult!");
    setLoading(true);
    try {
      let updatedReports = [...files.reports];
      let updatedBills = [...files.bills];
      let updatedPrescriptions = [...files.prescriptions];

      // Upload new files (with correct fileType)
      if (newFiles.reports.length) {
        const urls = await uploadToCloudinary(newFiles.reports, "reports");
        updatedReports = [...updatedReports, ...urls];
      }
      if (newFiles.bills.length) {
        const urls = await uploadToCloudinary(newFiles.bills, "bills");
        updatedBills = [...updatedBills, ...urls];
      }
      if (newFiles.prescriptions.length) {
        const urls = await uploadToCloudinary(newFiles.prescriptions, "prescriptions");
        updatedPrescriptions = [...updatedPrescriptions, ...urls];
      }

      // Update Supabase
      const { error } = await supabase
        .from("liveconsult")
        .update({
          reports: updatedReports,
          bills: updatedBills,
          prescriptions: updatedPrescriptions,
        })
        .eq("id", consultId);

      if (error) throw error;

      alert("Documents uploaded successfully!");
      if (onUpdate) onUpdate();
      onClose();
    } catch (err) {
      alert("Upload failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ File list renderer
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
            <span className="truncate max-w-[150px] text-xs">{url.split("/").pop()}</span>
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
          <input
            type="file"
            multiple
            accept="application/pdf"
            onChange={(e) => handleFiles(e, "reports")}
          />
          {renderFileList("reports")}
        </div>

        <div>
          <label className="block mb-1">Bills (PDF)</label>
          <input
            type="file"
            multiple
            accept="application/pdf"
            onChange={(e) => handleFiles(e, "bills")}
          />
          {renderFileList("bills")}
        </div>

        <div>
          <label className="block mb-1">Prescriptions (PDF)</label>
          <input
            type="file"
            multiple
            accept="application/pdf"
            onChange={(e) => handleFiles(e, "prescriptions")}
          />
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
