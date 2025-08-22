  "use client";

  import { useState } from "react";
  import { Button } from "@/components/ui/button";
  import { supabase } from "@/supabase/client";

  export default function Popup({ appointmentId, onClose, onUpdate }) {
    const [reports, setReports] = useState([]);
    const [bills, setBills] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleFiles = (e, setFiles) => setFiles([...e.target.files]);

const uploadToCloudinary = async (files, fileType) => {
  const uploadedUrls = [];
  for (const file of files) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`/api/upload?appointmentId=${appointmentId}&fileType=${fileType}`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (data.url) uploadedUrls.push(data.url);
  }
  return uploadedUrls;
};

const handleSubmit = async () => {
  if (!appointmentId) return alert("Invalid appointment!");

  setLoading(true);
  try {
    await uploadToCloudinary(reports, "reports");
    await uploadToCloudinary(bills, "bills");
    await uploadToCloudinary(prescriptions, "prescriptions");

    alert("Documents uploaded successfully!");
    onUpdate(); // refresh table
    onClose();
  } catch (err) {
    console.error(err);
    alert("Upload failed: " + err.message);
  } finally {
    setLoading(false);
  }
};
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-lg space-y-4">
          <h2 className="text-lg font-bold">Upload Documents</h2>

          <div>
            <label className="block mb-1">Reports (PDF)</label>
            <input type="file" multiple accept="application/pdf" onChange={(e) => handleFiles(e, setReports)} />
          </div>

          <div>
            <label className="block mb-1">Bills (PDF)</label>
            <input type="file" multiple accept="application/pdf" onChange={(e) => handleFiles(e, setBills)} />
          </div>

          <div>
            <label className="block mb-1">Prescriptions (PDF)</label>
            <input type="file" multiple accept="application/pdf" onChange={(e) => handleFiles(e, setPrescriptions)} />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={onClose} variant="secondary">Cancel</Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </div>
      </div>
    );
  }
