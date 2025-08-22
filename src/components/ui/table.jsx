"use client";

import React from "react";

export function Table({ children, className }) {
  return (
    <div className={`overflow-x-auto w-full ${className || ""}`}>
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        {children}
      </table>
    </div>
  );
}

export function TableHead({ children, className }) {
  return (
    <thead className={`bg-gray-100 dark:bg-gray-800 ${className || ""}`}>
      {children}
    </thead>
  );
}

export function TableBody({ children, className }) {
  return <tbody className={`bg-white dark:bg-gray-900 ${className || ""}`}>{children}</tbody>;
}

export function TableRow({ children, className }) {
  return (
    <tr className={`border-b border-gray-200 dark:border-gray-700 ${className || ""}`}>
      {children}
    </tr>
  );
}

export function TableCell({ children, className }) {
  return (
    <td
      className={`px-4 py-2 text-sm text-gray-700 dark:text-gray-300 ${className || ""}`}
    >
      {children}
    </td>
  );
}
