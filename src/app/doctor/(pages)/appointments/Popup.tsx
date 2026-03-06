"use client";

import { FC, useEffect, useState, ChangeEvent } from "react";
import { supabase } from "@/supabase/client";
import { Button } from "@/components/ui/button";

/* ================= TYPES ================= */

type FileType = "reports" | "bills" | "prescriptions";

interface FileState {
  reports: string[];
  bills: string[];
  prescriptions: string[];
}

interface NewFileState {
  reports: File[];
  bills: File[];
  prescriptions: File[];
}

interface LiveConsultPopupProps {
  consultId: number | null;
  onClose: () => void;
  onUpdate?: () => void;
}

/* ================= HELPERS ================= */

const fetchFiles = async (consultId: number): Promise<FileState> => {
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
    reports: data?.reports ?? [],
    bills: data?.bills ?? [],
    prescriptions: data?.prescriptions ?? [],
  };
};

/* ================= COMPONENT ================= */

const LiveConsultPopup: FC<LiveConsultPopupProps> = ({
  consultId,
  onClose,
  onUpdate,
}) => {
  const [files, setFiles] = useState<FileState>({
    reports: [],
    bills: [],
    prescriptions: [],
  });

  const [newFiles, setNewFiles] = useState<NewFileState>({
    reports: [],
    bills: [],
    prescriptions: [],
  });

  const [loading, setLoading] = useState<boolean>(false);

  useEffect((): void => {
    if (!consultId) return;

    setLoading(true);
    fetchFiles(consultId)
      .then(setFiles)
      .finally(() => setLoading(false));
  }, [consultId]);

  const handleFiles = (
    e: ChangeEvent<HTMLInputElement>,
    type: FileType
  ): void => {
    if (!e.target.files) return;

    setNewFiles((prev) => ({
      ...prev,
      [type]: Array.from(e.target.files),
    }));
  };

  const uploadToCloudinary = async (
    filesArr: File[],
    fileType: FileType
  ): Promise<string[]> => {
    const uploadedUrls: string[] = [];

    for (const file of filesArr) {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(
        `/api/upload?consultId=${consultId}&fileType=${fileType}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        throw new Error(`Failed to upload ${file.name}`);
      }

      const data: { url?: string } = await res.json();
      if (data.url) uploadedUrls.push(data.url);
    }

    return uploadedUrls;
  };

  const handleDelete = async (
    fileType: FileType,
    url: string
  ): Promise<void> => {
    if (!consultId) return;

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

      onUpdate?.();
    } catch (err) {
      alert("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (): Promise<void> => {
    if (!consultId) {
      alert("Invalid consult!");
      return;
    }

    setLoading(true);
    try {
      let updatedReports = [...files.reports];
      let updatedBills = [...files.bills];
      let updatedPrescriptions = [...files.prescriptions];

      if (newFiles.reports.length) {
        const urls = await uploadToCloudinary(
          newFiles.reports,
          "reports"
        );
        updatedReports = [...updatedReports, ...urls];
      }

      if (newFiles.bills.length) {
        const urls = await uploadToCloudinary(
          newFiles.bills,
          "bills"
        );
        updatedBills = [...updatedBills, ...urls];
      }

      if (newFiles.prescriptions.length) {
        const urls = await uploadToCloudinary(
          newFiles.prescriptions,
          "prescriptions"
        );
        updatedPrescriptions = [...updatedPrescriptions, ...urls];
      }

      const { error } = await supabase
        .from("liveconsult")
        .update({
          reports: updatedReports,
          bills: updatedBills,
          prescriptions: updatedPrescriptions,
        })
        .eq("id", consultId);

      if (error) throw error;

      onUpdate?.();
      onClose();
    } catch {
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const renderFileList = (fileType: FileType) => (
    <div className="flex flex-wrap gap-2 mt-2">
      {files[fileType].length === 0 ? (
        <span className="text-xs text-gray-400">No files</span>
      ) : (
        files[fileType].map((url) => (
          <div
            key={url}
            className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded"
          >
            <span className="truncate max-w-[150px] text-xs">
              {url.split("/").pop()}
            </span>
            <Button

              variant="outline"
              onClick={() => window.open(url, "_blank")}
            >
              View
            </Button>
            <Button
              variant="outline"
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

  if (!consultId) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-lg space-y-4">
        <h2 className="text-lg font-bold">Upload / View Documents</h2>

        {(["reports", "bills", "prescriptions"] as FileType[]).map(
          (type) => (
            <div key={type}>
              <label className="block mb-1 capitalize">
                {type} (PDF)
              </label>
              <input
                type="file"
                multiple
                accept="application/pdf"
                onChange={(e) => handleFiles(e, type)}
              />
              {renderFileList(type)}
            </div>
          )
        )}

        <div className="flex justify-end gap-2 mt-4">
          <Button onClick={onClose} variant="default">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LiveConsultPopup;
