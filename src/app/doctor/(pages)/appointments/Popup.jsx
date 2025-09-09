"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";

export default function Popup({ id, type = "appointment", onClose, onUpdate }) {
  const [docs, setDocs] = useState({ reports: [], bills: [], prescriptions: [] });
  const [files, setFiles] = useState({ reports: [], bills: [], prescriptions: [] });
  const [loading, setLoading] = useState(false);

  // Fetch existing documents
  useEffect(() => {
    if (!id) return;

    const fetchDocs = async () => {
      try {
        const res = await fetch(`/api/${type}/docs?id=${id}`);
        const data = await res.json();
        if (data.success) {
          setDocs({
            reports: data.docs.reports || [],
            bills: data.docs.bills || [],
            prescriptions: data.docs.prescriptions || [],
          });
          setFiles({
            reports: data.docs.reports || [],
            bills: data.docs.bills || [],
            prescriptions: data.docs.prescriptions || [],
          });
        }
      } catch (err) {
        console.error("Fetch docs error:", err);
      }
    };

    fetchDocs();
  }, [id, type]);

  const handleFiles = useCallback(
    (e, key) => {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prev) => ({ ...prev, [key]: [...prev[key].filter(f => typeof f === "string"), ...selectedFiles] }));
    },
    []
  );

  const uploadFiles = async (fileList, fileType) => {
    const uploadedUrls = [];
    for (const file of fileList) {
      if (typeof file === "string") {
        uploadedUrls.push(file); // already uploaded
        continue;
      }

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`/api/upload?table=${type}&id=${id}&fileType=${fileType}`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");
      uploadedUrls.push(data.url);
    }
    return uploadedUrls;
  };

  const handleSubmit = async () => {
    if (!id) return alert("Invalid item!");

    setLoading(true);
    try {
      const reportsUrls = await uploadFiles(files.reports, "reports");
      const billsUrls = await uploadFiles(files.bills, "bills");
      const prescriptionsUrls = await uploadFiles(files.prescriptions, "prescriptions");

      // Update DB
      const res = await fetch(`/api/${type}/updateDocs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          reports: reportsUrls,
          bills: billsUrls,
          prescriptions: prescriptionsUrls,
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      alert("Documents uploaded successfully!");
      onUpdate();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Upload failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderFileList = (list) =>
    list.map((file, idx) =>
      typeof file === "string" ? (
        <a
          key={idx}
          href={file}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline block truncate max-w-full"
        >
          View {idx + 1}
        </a>
      ) : (
        <p key={idx} className="truncate max-w-full">
          {file.name}
        </p>
      )
    );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-lg space-y-4 shadow-lg overflow-y-auto max-h-[90vh]">
        <h2 className="text-lg font-bold">Upload Documents</h2>

        {["reports", "bills", "prescriptions"].map((key) => (
          <div key={key}>
            <label className="block mb-1 font-medium capitalize">{key} (PDF)</label>
            <input
              type="file"
              multiple
              accept="application/pdf"
              onChange={(e) => handleFiles(e, key)}
              className="mb-2"
            />
            <div className="space-y-1">{renderFileList(files[key])}</div>
          </div>
        ))}

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
