"use client";

import { useState, useEffect, ReactElement } from "react";
import { useAppSelector } from "@/store/hooks";



const monthNames: readonly string[] = [
  "January", "February", "March", "April", "May", "June", "July",
  "August", "September", "October", "November", "December",
];

const isLeapYear = (year: number): boolean =>
  (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

const getFebDays = (year: number): number =>
  isLeapYear(year) ? 29 : 28;

/* ---------------------------------- */
/* Props */
/* ---------------------------------- */

interface SeamlessCalendarProps {
  onDateChange?: (date: Date) => void;
  selectedDate?: Date | null;
  allowedDates?: Date[];
}

/* ---------------------------------- */
/* Component */
/* ---------------------------------- */

export default function SeamlessCalendar({
  onDateChange,
  selectedDate: externalDate = null,
  allowedDates = [],
}: SeamlessCalendarProps) {
  const currDate = new Date();

  const isDarkMode = useAppSelector(
    (state) => state.theme.isDarkMode
  );

  const [month, setMonth] = useState<number>(
    externalDate ? externalDate.getMonth() : currDate.getMonth()
  );
  const [year, setYear] = useState<number>(
    externalDate ? externalDate.getFullYear() : currDate.getFullYear()
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    externalDate
  );

  /* ---------- Sync with external date ---------- */
  useEffect(() => {
    if (externalDate) {
      setMonth(externalDate.getMonth());
      setYear(externalDate.getFullYear());
      setSelectedDate(externalDate);
    }
  }, [externalDate]);

  const daysOfMonth: number[] = [
    31,
    getFebDays(year),
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];

  /* ---------- Date availability ---------- */
  const isDateAllowed = (date: Date): boolean => {
    if (!allowedDates.length) return true;

    return allowedDates.some(
      (d) =>
        d.getFullYear() === date.getFullYear() &&
        d.getMonth() === date.getMonth() &&
        d.getDate() === date.getDate()
    );
  };

  /* ---------- Date selection ---------- */
  const handleDateSelect = (day: number): void => {
    const newDate = new Date(year, month, day);
    if (!isDateAllowed(newDate)) return;

    setSelectedDate(newDate);
    onDateChange?.(newDate);
  };

  /* ---------- Calendar rendering ---------- */
  const generateCalendarDays = (): ReactElement[] => {
    const firstDay = new Date(year, month, 1).getDay();
    const days: ReactElement[] = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="w-10 h-10" />
      );
    }

    for (let i = 1; i <= daysOfMonth[month]; i++) {
      const current = new Date(year, month, i);
      const allowed = isDateAllowed(current);

      const isSelected =
        selectedDate !== null &&
        i === selectedDate.getDate() &&
        year === selectedDate.getFullYear() &&
        month === selectedDate.getMonth();

      let bgClass = "opacity-30 cursor-not-allowed";
      if (allowed) {
        bgClass = isDarkMode
          ? "hover:bg-slate-700 text-gray-300"
          : "hover:bg-gray-100 text-gray-700";
      }
      if (isSelected) {
        bgClass =
          "bg-cyan-600 text-white shadow-lg shadow-cyan-500/20";
      }

      days.push(
        <div
          key={i}
          className={`p-2 w-10 h-10 flex items-center justify-center rounded-lg cursor-pointer transition-all duration-300 ${bgClass}`}
          onClick={() => handleDateSelect(i)}
        >
          {i}
        </div>
      );
    }

    return days;
  };

  return (
    <div
      className={`flex flex-col items-center p-4 rounded-xl shadow-lg transition-all duration-300
      ${isDarkMode
          ? "bg-slate-900 text-white border border-slate-800"
          : "bg-white text-black border border-gray-100"
        }`}
    >
      {/* Header */}
      <div
        className={`flex justify-between w-full max-w-md items-center mb-4 p-2 rounded-lg
        ${isDarkMode
            ? "bg-slate-800 border-slate-700"
            : "bg-gray-50 border-gray-200"
          }`}
      >
        <button
          className="px-3 py-1 rounded hover:bg-gray-400"
          onClick={() => setYear((y) => y - 1)}
        >
          Prev
        </button>
        <h2 className="text-xl font-bold">{year}</h2>
        <button
          className="px-3 py-1 rounded hover:bg-gray-400"
          onClick={() => setYear((y) => y + 1)}
        >
          Next
        </button>
      </div>

      {/* Month Picker */}
      <div
        className={`relative mb-4 p-2 rounded-lg
        ${isDarkMode
            ? "bg-slate-800 border-slate-700"
            : "bg-gray-50 border-gray-200"
          }`}
      >
        <select
          className={`px-4 py-2 rounded cursor-pointer outline-none ${isDarkMode
              ? "bg-slate-700 text-white"
              : "bg-white text-black border border-gray-200"
            }`}
          value={month}
          onChange={(e) =>
            setMonth(Number(e.target.value))
          }
        >
          {monthNames.map((name, index) => (
            <option key={index} value={index}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {/* Calendar */}
      <div className="grid grid-cols-7 gap-1">
        {generateCalendarDays()}
      </div>

      {/* Selected Date */}
      <p className="mt-4">
        Selected Date:{" "}
        {selectedDate
          ? `${monthNames[month]} ${selectedDate.getDate()}, ${year}`
          : "None"}
      </p>
    </div>
  );
}
