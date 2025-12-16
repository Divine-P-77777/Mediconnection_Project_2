import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const monthNames = [
  "January", "February", "March", "April", "May", "June", "July",
  "August", "September", "October", "November", "December"
];

const isLeapYear = (year) => (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
const getFebDays = (year) => (isLeapYear(year) ? 29 : 28);

export default function SeamlessCalendar({ onDateChange, selectedDate: externalDate, allowedDates = [] }) {
  const currDate = new Date();
  const isDarkMode = useSelector(state => state.theme.isDarkMode);

  const [month, setMonth] = useState(externalDate ? externalDate.getMonth() : currDate.getMonth());
  const [year, setYear] = useState(externalDate ? externalDate.getFullYear() : currDate.getFullYear());
  const [selectedDate, setSelectedDate] = useState(externalDate || null);

  // Sync with externalDate
  useEffect(() => {
    if (externalDate) {
      setMonth(externalDate.getMonth());
      setYear(externalDate.getFullYear());
      setSelectedDate(externalDate);
    }
  }, [externalDate]);

  const daysOfMonth = [31, getFebDays(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  const isDateAllowed = (date) => {
    if (!allowedDates || allowedDates.length === 0) return true; // allow all if not provided
    return allowedDates.some(d =>
      d.getFullYear() === date.getFullYear() &&
      d.getMonth() === date.getMonth() &&
      d.getDate() === date.getDate()
    );
  };

  const handleDateSelect = (day) => {
    const newDate = new Date(year, month, day);
    if (!isDateAllowed(newDate)) return; // ignore clicks on unavailable dates
    setSelectedDate(newDate);
    if (onDateChange) onDateChange(newDate);
  };

  const generateCalendarDays = () => {
    const firstDay = new Date(year, month, 1).getDay();
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-10 h-10"></div>);
    }

    for (let i = 1; i <= daysOfMonth[month]; i++) {
      const current = new Date(year, month, i);
      const allowed = isDateAllowed(current);

      const isSelected = selectedDate &&
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
        bgClass = "bg-cyan-600 text-white shadow-lg shadow-cyan-500/20";
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
    <div className={`flex flex-col items-center p-4 rounded-xl shadow-lg transition-all duration-300
      ${isDarkMode ? "bg-slate-900 text-white border border-slate-800" : "bg-white text-black border border-gray-100"}`}
    >
      {/* Header */}
      <div className={`flex justify-between w-full max-w-md items-center mb-4 p-2 rounded-lg
        ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-gray-50 border-gray-200"}`}
      >
        <button className="px-3 py-1 rounded hover:bg-gray-400" onClick={() => setYear(year - 1)}>Prev</button>
        <h2 className="text-xl font-bold">{year}</h2>
        <button className="px-3 py-1 rounded hover:bg-gray-400" onClick={() => setYear(year + 1)}>Next</button>
      </div>

      {/* Month Picker Dropdown */}
      <div className={`relative mb-4 p-2 rounded-lg
        ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-gray-50 border-gray-200"}`}
      >
        <select
          className={`px-4 py-2 rounded cursor-pointer outline-none ${isDarkMode ? "bg-slate-700 text-white" : "bg-white text-black border border-gray-200"}`}
          value={month}
          onChange={(e) => setMonth(parseInt(e.target.value))}
        >
          {monthNames.map((name, index) => (
            <option key={index} value={index}>{name}</option>
          ))}
        </select>
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1">{generateCalendarDays()}</div>

      {/* Selected Date Display */}
      <p className="mt-4">Selected Date: {selectedDate ? `${monthNames[month]} ${selectedDate.getDate()}, ${year}` : "None"}</p>
    </div>
  );
}
