"use client";

import {
  X,
  Download,
  FileText,
  Receipt,
  ClipboardList,
} from "lucide-react";
import React from "react";

interface DocumentsData {
  reports?: string[];
  bills?: string[];
  prescriptions?: string[];
}

interface DocumentsModalProps {
  data: DocumentsData | null;
  isDarkMode: boolean;
  onClose: () => void;
}

type SectionKey = keyof DocumentsData;

interface Section {
  label: string;
  key: SectionKey;
  icon: React.ReactNode;
}

export default function DocumentsModal({
  data,
  isDarkMode,
  onClose,
}: DocumentsModalProps) {
  if (!data) return null;

  const sections: Section[] = [
    { label: "Reports", key: "reports", icon: <FileText size={20} /> },
    { label: "Bills", key: "bills", icon: <Receipt size={20} /> },
    {
      label: "Prescriptions",
      key: "prescriptions",
      icon: <ClipboardList size={20} />,
    },
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-3">
      <div
        className={`rounded-xl p-6 w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl animate-fadeIn ${isDarkMode
          ? "bg-gray-900 text-gray-100"
          : "bg-white text-gray-900"
          }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Available Documents</h3>
          <button
            onClick={onClose}
            className={`p-2 rounded transition ${isDarkMode
              ? "hover:bg-gray-700"
              : "hover:bg-gray-200"
              }`}
          >
            <X size={22} />
          </button>
        </div>

        <div className="space-y-6">
          {sections.map((section) => {
            const items = data[section.key];

            if (!items || items.length === 0) return null;

            return (
              <div key={section.key}>
                <div className="flex items-center gap-2 mb-3 text-lg font-semibold">
                  {section.icon}
                  {section.label}
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {items.map((url, index) => (
                    <a
                      key={`${section.key}-${index}`}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className={`flex justify-between items-center px-4 py-3 rounded-lg border shadow-sm transition hover:shadow-md ${isDarkMode
                        ? "bg-gray-800 border-gray-700 hover:bg-gray-700"
                        : "bg-gray-100 border-gray-300 hover:bg-gray-200"
                        }`}
                    >
                      <span className="font-medium">
                        {section.label.slice(0, -1)} {index + 1}
                      </span>
                      <Download size={20} className="text-blue-500" />
                    </a>
                  ))}
                </div>
              </div>
            );
          })}

          {!data.reports?.length &&
            !data.bills?.length &&
            !data.prescriptions?.length && (
              <p className="text-center text-gray-500 dark:text-gray-400">
                No documents available.
              </p>
            )}
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg transition ${isDarkMode
              ? "bg-gray-800 hover:bg-gray-700"
              : "bg-gray-300 hover:bg-gray-400"
              }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
