"use client";

import { useState } from "react";
import { X, Upload, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { supabase } from "@/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAppSelector } from "@/store/hooks";
import { Button } from "@/components/ui/button";

interface PopupProps {
  appointmentId: number;
  onClose: () => void;
  onUpdate: () => void;
}

type DocumentType = "reports" | "bills" | "prescriptions";

export default function Popup({ appointmentId, onClose, onUpdate }: PopupProps) {
  const [file, setFile] = useState<File | null>(null);
  const [docType, setDocType] = useState<DocumentType>("reports");
  const [uploading, setUploading] = useState(false);
  const { success: successToast, errorToast } = useToast();
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      errorToast("Please select a file to upload.");
      return;
    }

    setUploading(true);
    try {
      // 1. Upload file to Supabase Storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${appointmentId}/${Date.now()}.${fileExt}`;
      const bucketName = "documents"; // Assuming a bucket named 'documents'

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file);

      if (uploadError) throw new Error(uploadError.message);

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      const publicUrl = publicUrlData.publicUrl;

      // 2. Fetch current appointment to get existing array
      const { data: currentData, error: fetchError } = await supabase
        .from("appointments")
        .select(docType)
        .eq("id", appointmentId)
        .single();

      if (fetchError) throw new Error(fetchError.message);

      const existingDocs = currentData?.[docType] || [];
      const updatedDocs = [...existingDocs, publicUrl];

      // 3. Update appointment record
      const { error: updateError } = await supabase
        .from("appointments")
        .update({ [docType]: updatedDocs })
        .eq("id", appointmentId);

      if (updateError) throw new Error(updateError.message);

      successToast("Document uploaded successfully!");
      onUpdate();
      onClose();
    } catch (err: any) {
      console.error("Upload error:", err);
      errorToast(err.message || "Failed to upload document.");
    } finally {
      setUploading(false);
    }
  };

  const theme = {
    bg: isDarkMode ? "bg-gray-800" : "bg-white",
    text: isDarkMode ? "text-gray-100" : "text-gray-900",
    border: isDarkMode ? "border-gray-700" : "border-gray-200",
    inputBg: isDarkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-50 hover:bg-gray-100",
    inputText: isDarkMode ? "text-gray-200" : "text-gray-700",
    label: isDarkMode ? "text-gray-300" : "text-gray-700",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden ${theme.bg} ${theme.text}`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${theme.border}`}>
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Upload className="w-5 h-5 text-cyan-500" />
            Upload Document
          </h3>
          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
              }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Document Type Selection */}
          <div className="space-y-2">
            <label className={`text-sm font-medium ${theme.label}`}>Document Type</label>
            <div className="grid grid-cols-3 gap-2">
              {(["reports", "bills", "prescriptions"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setDocType(type)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${docType === type
                      ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20"
                      : `border ${theme.border} ${theme.inputBg} ${theme.inputText}`
                    }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* File Upload Area */}
          <div className="space-y-2">
            <label className={`text-sm font-medium ${theme.label}`}>Select File</label>
            <div
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${theme.border
                } ${isDarkMode ? "hover:border-cyan-500/50" : "hover:border-cyan-500"}`}
            >
              <input
                type="file"
                onChange={handleFileChange}
                accept="application/pdf,image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center gap-3 pointer-events-none">
                <div className={`p-3 rounded-full ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                  {file ? (
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  ) : (
                    <FileText className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <div className="space-y-1">
                  <p className="font-medium truncate max-w-[200px]">
                    {file ? file.name : "Click or drag to upload"}
                  </p>
                  <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                    PDF, PNG, JPG up to 10MB
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`p-6 border-t ${theme.border} flex gap-3`}>
          <Button
            variant="outline"
            onClick={onClose}
            className={`flex-1 ${isDarkMode ? "border-gray-600 hover:bg-gray-700" : ""}`}
            disabled={uploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white shadow-lg shadow-cyan-500/20"
          >
            {uploading ? "Uploading..." : "Upload Document"}
          </Button>
        </div>
      </div>
    </div>
  );
}
