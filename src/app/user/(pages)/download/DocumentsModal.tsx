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
        className={`rounded-[2rem] p-8 w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl animate-fadeIn ${isDarkMode
          ? "bg-slate-900 border border-slate-800 text-gray-100"
          : "bg-white text-gray-900"
          }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">Available Documents</h3>
          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${isDarkMode
              ? "hover:bg-slate-800 bg-slate-800/50"
              : "hover:bg-gray-100 bg-gray-50"
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
                      className={`flex justify-between items-center px-5 py-4 rounded-2xl border-2 transition-all hover:-translate-y-0.5 shadow-sm ${isDarkMode
                        ? "bg-slate-800 border-slate-700 hover:border-cyan-500/50 hover:bg-slate-700/50"
                        : "bg-gray-50 border-gray-100 hover:border-cyan-200 hover:bg-cyan-50/30"
                        }`}
                    >
                      <span className="font-semibold">
                        {section.label.slice(0, -1)} {index + 1}
                      </span>
                      <div className="p-2 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400">
                        <Download size={18} />
                      </div>
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

        <div className="mt-8 text-right border-t border-gray-100 dark:border-slate-800 pt-6">
          <button
            onClick={onClose}
            className={`w-full px-6 py-3 rounded-full font-medium transition-colors ${isDarkMode
              ? "bg-slate-800 hover:bg-slate-700 text-gray-200"
              : "bg-gray-100 hover:bg-gray-200 text-gray-800"
              }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
