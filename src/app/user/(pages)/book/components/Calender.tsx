"use client";

import { format, addDays, eachDayOfInterval, isSameDay } from "date-fns";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppSelector } from "@/store/hooks";

interface AvailabilityItem {
  day_of_week: string;
  status: "available" | "not_available";
}

interface Center {
  availability?: AvailabilityItem[];
}

interface CalendarProps {
  selectedCenter: CalendarCenter | null;
  selectedDate: Date | null;
  handleDateSelect: (date: Date) => void;
}


export interface CalendarAvailability {
  day_of_week: string;
  status: "available" | "not_available";
}

export interface CalendarCenter {
  availability?: CalendarAvailability[];
}


const Calendar = ({
  selectedCenter,
  selectedDate,
  handleDateSelect,
}: CalendarProps) => {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  const today = new Date();
  const daysInRange = eachDayOfInterval({
    start: today,
    end: addDays(today, 6),
  });

  const weekDays: readonly string[] = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ];

  const availabilityMap = (selectedCenter?.availability || []).reduce<
    Record<string, string>
  >((acc, day) => {
    acc[day.day_of_week] = day.status;
    return acc;
  }, {});

  return (
    <Card
      className={`px-0 py-3 sm:p-6 rounded-xl shadow-lg transition-all duration-300 ${isDarkMode
        ? "bg-slate-900 border-slate-800 text-white"
        : "bg-white text-black"
        }`}
    >
      <CardHeader className="flex justify-center">
        <CardTitle>Select Date</CardTitle>
      </CardHeader>

      <CardContent className="px-3">
        <div className="grid grid-cols-7 sm:gap-2 mb-2 font-semibold text-center">
          {weekDays.map((day) => (
            <div
              key={day}
              className={isDarkMode ? "text-gray-400" : "text-gray-600"}
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2 sm:gap-2">
          {daysInRange.map((day) => {
            const dayFullName = format(day, "EEEE");
            const slotStatus =
              availabilityMap[dayFullName] || "not_available";
            const isSelectable = slotStatus === "available";
            const isSelected =
              selectedDate !== null && isSameDay(day, selectedDate);

            let bgColor = isDarkMode
              ? "bg-slate-800 text-slate-500"
              : "bg-gray-100 text-gray-400";

            if (isSelectable) {
              bgColor = isDarkMode
                ? "bg-emerald-900/30 text-emerald-400 border border-emerald-800"
                : "bg-green-100 text-green-700 border border-green-200";
            }

            if (isSelected) {
              bgColor =
                "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20 border-transparent";
            } else if (!isSelectable) {
              bgColor = isDarkMode
                ? "bg-rose-900/20 text-rose-500/50"
                : "bg-red-50 text-red-300";
            }

            return (
              <motion.div
                key={day.toISOString()}
                whileHover={{ scale: isSelectable ? 1.05 : 1 }}
                whileTap={{ scale: isSelectable ? 0.95 : 1 }}
                className={`p-2 text-center transition-all rounded-lg flex flex-col items-center justify-center h-16 sm:h-20 ${bgColor} ${isSelectable ? "cursor-pointer" : "cursor-not-allowed"
                  }`}
                onClick={() => isSelectable && handleDateSelect(day)}
              >
                <span className="text-xs uppercase font-bold opacity-60 mb-1">
                  {format(day, "MMM")}
                </span>
                <span className="text-lg sm:text-2xl font-bold">
                  {format(day, "d")}
                </span>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm">
          {[
            {
              color: isDarkMode
                ? "bg-emerald-900/30 border-emerald-800"
                : "bg-green-100 border-green-200",
              text: "Available",
            },
            {
              color: isDarkMode ? "bg-rose-900/20" : "bg-red-50",
              text: "Not Available",
            },
            { color: "bg-cyan-500", text: "Selected" },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-2">
              <span
                className={`${item.color} rounded-md w-6 h-6 border flex-shrink-0`}
              />
              <span
                className={isDarkMode ? "text-gray-400" : "text-gray-600"}
              >
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Calendar;
