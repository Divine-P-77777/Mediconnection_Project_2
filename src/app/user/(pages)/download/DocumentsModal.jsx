"use client";

import { X, Download, FileText, Receipt, ClipboardList } from "lucide-react";

export default function DocumentsModal({ data, isDarkMode, onClose }) {
  if (!data) return null;

  const sections = [
    { label: "Reports", key: "reports", icon: <FileText size={20} /> },
    { label: "Bills", key: "bills", icon: <Receipt size={20} /> },
    { label: "Prescriptions", key: "prescriptions", icon: <ClipboardList size={20} /> },
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-3">
      <div
        className={`rounded-xl p-6 w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl animate-fadeIn
        ${isDarkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"}`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Available Documents</h3>
          <button
            onClick={onClose}
            className={`p-2 rounded hover:bg-gray-200 ${isDarkMode ? "dark:hover:bg-gray-700" : ""} transition`}
          >
            <X size={22} />
          </button>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section) => {
            const items = data[section.key];
            if (!items?.length) return null;

            return (
              <div key={section.key}>
                <div className="flex items-center gap-2 mb-3 text-lg font-semibold">
                  {section.icon}
                  {section.label}
                </div>

                {/* Document Cards */}
                <div className="grid grid-cols-1 gap-3">
                  {items.map((url, index) => (
                    <a
                      key={index}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className={`flex justify-between items-center px-4 py-3 rounded-lg border shadow-sm
                        transition hover:shadow-md
                        ${
                          isDarkMode
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

          {/* No docs */}
          {!data.reports?.length &&
            !data.bills?.length &&
            !data.prescriptions?.length && (
              <p className="text-gray-500 dark:text-gray-400 text-center">
                No documents available.
              </p>
            )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg ${isDarkMode ?"bg-gray-800 hover:bg-gray-700 " :"bg-gray-300 hover:bg-gray-400 "} 
         transition`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
