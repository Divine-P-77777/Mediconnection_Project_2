"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export default function Select({ label, options = [], value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full relative" ref={ref}>
      {label && (
        <label className="block mb-1 text-sm font-medium text-cyan-700">
          {label}
        </label>
      )}

      {/* Trigger */}
      <div
        className={`w-full cursor-pointer border rounded-xl px-4 py-2 flex justify-between items-center transition-all
        ${open ? "border-cyan-500 ring-2 ring-cyan-400" : "border-gray-300"}
        bg-white text-gray-800`}
        onClick={() => setOpen(!open)}
      >
        <span>{value || "Select option"}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </div>

      {/* Dropdown */}
      {open && (
        <ul className="absolute mt-1 w-full bg-white border border-cyan-300 rounded-xl shadow-lg max-h-56 overflow-auto z-20">
          {options.length > 0 ? (
            options.map((opt) => (
              <li
                key={opt}
                className={`px-4 py-2 hover:bg-cyan-100 cursor-pointer transition-colors ${
                  value === opt ? "bg-cyan-200 font-medium" : ""
                }`}
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
              >
                {opt}
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-gray-400">No options</li>
          )}
        </ul>
      )}
    </div>
  );
}
