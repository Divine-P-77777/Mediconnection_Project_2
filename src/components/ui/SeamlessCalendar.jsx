import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const monthNames = [
  "January", "February", "March", "April", "May", "June", "July",
  "August", "September", "October", "November", "December"
];

const isLeapYear = (year) => (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
const getFebDays = (year) => (isLeapYear(year) ? 29 : 28);

export default function SeamlessCalendar({ onDateChange, selectedDate: externalDate }) {
  const currDate = new Date();
  const isDarkMode = useSelector(state => state.theme.isDarkMode);

  // Use controlled date if provided, else fallback to local state
  const [month, setMonth] = useState(
    externalDate ? externalDate.getMonth() : currDate.getMonth()
  );
  const [year, setYear] = useState(
    externalDate ? externalDate.getFullYear() : currDate.getFullYear()
  );
  const [selectedDate, setSelectedDate] = useState(
    externalDate || currDate
  );

  // Keep local state in sync with externalDate
  useEffect(() => {
    if (externalDate) {
      setMonth(externalDate.getMonth());
      setYear(externalDate.getFullYear());
      setSelectedDate(externalDate);
    }
  }, [externalDate]);

  const daysOfMonth = [31, getFebDays(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  const handleDateSelect = (day) => {
    const newDate = new Date(year, month, day);
    setSelectedDate(newDate);
    if (onDateChange) onDateChange(newDate); // <-- Notify parent
  };

  const generateCalendarDays = () => {
    const firstDay = new Date(year, month, 1).getDay();
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-10 h-10"></div>);
    }

    for (let i = 1; i <= daysOfMonth[month]; i++) {
      const isSelected = selectedDate &&
        i === selectedDate.getDate() &&
        year === selectedDate.getFullYear() &&
        month === selectedDate.getMonth();
      days.push(
        <div
          key={i}
          className={`p-2 w-10 h-10 flex items-center justify-center rounded-md cursor-pointer transition-all duration-300
            ${isSelected ? "bg-cyan-500 text-white" : isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-300"}
          `}
          onClick={() => handleDateSelect(i)}
        >
          {i}
        </div>
      );
    }
    return days;
  };

  return (
    <div className={`flex flex-col items-center p-4 rounded-lg shadow-sm transition-all duration-300
      ${isDarkMode ? "bg-gray-900 text-white border border-cyan-400 shadow-cyan-200" : "bg-white text-black border border-gray-300 shadow-gray-300"}`}
    >
      {/* Header */}
      <div className={`flex justify-between w-full max-w-md items-center mb-4 p-2 rounded-lg
        ${isDarkMode ? "bg-gray-800 border border-cyan-400 shadow-cyan-200" : "bg-gray-200 border border-gray-300 shadow-gray-300"}`}
      >
        <button className="px-3 py-1 rounded hover:bg-gray-400" onClick={() => setYear(year - 1)}>Prev</button>
        <h2 className="text-xl font-bold">{year}</h2>
        <button className="px-3 py-1 rounded hover:bg-gray-400" onClick={() => setYear(year + 1)}>Next</button>
      </div>

      {/* Month Picker Dropdown */}
      <div className={`relative mb-4 p-2 rounded-lg
        ${isDarkMode ? "bg-gray-800 border border-cyan-400 shadow-cyan-200" : "bg-gray-200 border border-gray-300 shadow-gray-300"}`}
      >
        <select
          className={`px-4 py-2 rounded cursor-pointer ${isDarkMode ? "bg-gray-700 text-white" : "bg-gray-300 text-black"}`}
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