"use client";

import React from "react";
import { useSelector } from "react-redux";

export function Table({ children, className }) {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  return (
    <div className={`overflow-x-auto w-full ${className || ""}`}>
      <table
        className={`min-w-full divide-y ${
          isDarkMode ? "divide-gray-700 bg-gray-900 text-gray-300" : "divide-gray-200 bg-white text-gray-900"
        }`}
      >
        {children}
      </table>
    </div>
  );
}

export function TableHead({ children, className }) {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  return (
    <thead
      className={`${className || ""} ${
        isDarkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-900"
      }`}
    >
      {children}
    </thead>
  );
}

export function TableBody({ children, className }) {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  return (
    <tbody
      className={`${className || ""} ${
        isDarkMode ? "bg-gray-900 text-gray-300" : "bg-white text-gray-900"
      }`}
    >
      {children}
    </tbody>
  );
}

export function TableRow({ children, className }) {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  return (
    <tr
      className={`border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"} ${
        className || ""
      }`}
    >
      {children}
    </tr>
  );
}

export function TableCell({ children, className }) {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  return (
    <td
      className={`px-4 py-2 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"} ${
        className || ""
      }`}
    >
      {children}
    </td>
  );
}
