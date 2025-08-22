"use client";
import React from "react";
import { format, addDays, eachDayOfInterval, isSameDay } from "date-fns";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const cn = (classes, isDark) => {
  if (!Array.isArray(classes)) return typeof classes === "function" ? classes(isDark) : classes;
  return classes.map(c => (typeof c === "function" ? c(isDark) : c)).join(" ");
};

const Calendar = ({
  selectedCenter,
  selectedDate,
  handleDateSelect,
  isDarkMode,
  availableDaysOfWeek,
}) => {
  const today = new Date();
  const daysInRange = eachDayOfInterval({ start: today, end: addDays(today, 6) });
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Use full day names as keys!
  const availabilityMap = (selectedCenter?.availability || []).reduce((acc, day) => {
    acc[day.day_of_week] = day.status; // e.g. { "Monday": "available", ... }
    return acc;
  }, {});

  return (
    <Card
      className={cn([
        (isDark) =>
          `px-0 py-3 sm:p-6 rounded-xl shadow-lg ${
            isDark ? "bg-gray-800 text-white" : "bg-white text-black"
          }`,
      ], isDarkMode)}
    >
      <CardHeader className="flex justify-center">
        <CardTitle>Select Date</CardTitle>
      </CardHeader>
      <CardContent className="px-3">
        {/* Weekday headings */}
        <div className="grid grid-cols-7 sm:gap-2 mb-2 font-semibold text-center">
          {weekDays.map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-2 sm:gap-2">
          {daysInRange.map((day) => {
            const dayFullName = format(day, "EEEE"); // "Monday", "Tuesday", etc.
            const slotStatus = availabilityMap[dayFullName] || "not_available";
            const isSelectable = slotStatus === "available";
            const isSelected = selectedDate && isSameDay(day, selectedDate);

            const bgColor =
              isSelected
                ? "bg-cyan-400 text-black"
                : slotStatus === "available"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white";

            return (
              <motion.div
                key={day.toISOString()}
                whileHover={{ scale: isSelectable ? 1.05 : 1 }}
                className={cn([
                  `p-2 text-center transition-all rounded-full sm:rounded-lg`,
                  bgColor,
                  isSelectable
                    ? "cursor-pointer"
                    : "cursor-not-allowed opacity-60",
                ], isDarkMode)}
                onClick={() =>
                  isSelectable && handleDateSelect(day)
                }
              >
                {format(day, "d")}
              </motion.div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-10 flex-col flex sm:flex-row justify-center sm:items-center mx-auto gap-3">
          {[
            { color: "bg-green-500", text: "Available" },
            { color: "bg-red-500", text: "Not Available" },
            { color: "bg-cyan-400", text: "Selected" },
          ].map((item) => (
            <div key={item.text} className="flex items-center">
              <span className={`${item.color} rounded-full w-4 h-4`} />
              <span className="ml-2">{item.text}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Calendar;