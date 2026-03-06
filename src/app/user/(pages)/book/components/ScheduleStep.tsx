"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import Calendar from "./Calender";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store/hooks";
import type { CalendarCenter } from "./Calender";


interface SlotAvailability {
  day_of_week: string;
  slot_time: string[];
}

interface Purpose {
  service_name: string;
  price: number;
  status: "active" | "inactive";
}

interface Center {
  availability?: SlotAvailability[];
  purposes?: Purpose[];
}

interface ScheduleConfirmPayload {
  date: Date;
  time: string;
  purpose: Purpose;
}

interface ScheduleStepProps {
  center: Center;
  form?: unknown;
  onConfirm: (payload: ScheduleConfirmPayload) => void;
  isBooking: boolean;
}

export default function ScheduleStep({
  center,
  onConfirm,
  isBooking,
}: ScheduleStepProps) {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string>("");
  const [purpose, setPurpose] = useState<Purpose | null>(null);

  const availability = center.availability ?? [];
  const purposes =
    center.purposes?.filter((p) => p.status === "active") ?? [];

  const slots = useMemo<string[]>(() => {
    if (!date) return [];
    const day = format(date, "EEEE");
    return (
      availability.find((a) => a.day_of_week === day)?.slot_time ??
      []
    );
  }, [date, availability]);

  const calendarCenter: CalendarCenter = {
    availability:
      center.availability?.map((a) => ({
        day_of_week: a.day_of_week,
        status: a.slot_time.length > 0 ? "available" : "not_available",
      })) ?? [],
  };


  return (
    <>
      <Calendar
        selectedCenter={calendarCenter}
        selectedDate={date}
        handleDateSelect={(d: Date) => setDate(d)}
      />

      {date && slots.length === 0 && (
        <Card
          className={`mt-6 p-6 text-center border-l-4 border-l-red-500 shadow-md ${isDarkMode
            ? "bg-slate-900 border-slate-800"
            : "bg-white"
            }`}
        >
          <p className="text-red-500 font-semibold text-lg">
            No slots available for this date.
          </p>
          <p
            className={
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }
          >
            Please select another date from the calendar.
          </p>
        </Card>
      )}

      {slots.length > 0 && (
        <>
          <Card
            className={`mt-6 p-4 shadow-sm rounded-[2rem] border-transparent transition-all duration-300 ${isDarkMode
              ? "bg-slate-900"
              : "bg-white"
              }`}
          >
            <CardHeader>
              <CardTitle
                className={`text-center text-lg ${isDarkMode ? "text-white" : "text-gray-900"
                  }`}
              >
                Select Time Slot
              </CardTitle>
            </CardHeader>

            <CardContent className="grid grid-cols-3 gap-2">
              {slots.map((t) => (
                <Button
                  key={t}
                  onClick={() => setTime(t)}
                  className={`rounded-full py-6 transition-all duration-300 font-medium ${time === t
                    ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md shadow-cyan-500/30 scale-105 border-0"
                    : isDarkMode
                      ? "bg-slate-800 text-gray-300 hover:bg-slate-700 hover:text-white border-transparent"
                      : "bg-gray-50 text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 border-transparent shadow-sm"
                    }`}
                >
                  {t}
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card
            className={`mt-6 p-4 shadow-sm rounded-[2rem] border-transparent transition-all duration-300 ${isDarkMode
              ? "bg-slate-900"
              : "bg-white"
              }`}
          >
            <CardHeader>
              <CardTitle
                className={`text-center text-lg ${isDarkMode ? "text-white" : "text-gray-900"
                  }`}
              >
                Consultation Purpose
              </CardTitle>
            </CardHeader>

            <CardContent className="grid grid-cols-2 gap-2">
              {purposes.map((p) => (
                <Button
                  key={p.service_name}
                  onClick={() => setPurpose(p)}
                  className={`h-auto py-4 px-6 rounded-2xl whitespace-normal text-left flex flex-col items-start transition-all duration-300 ${purpose?.service_name === p.service_name
                    ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md shadow-cyan-500/30 scale-[1.02] border-0"
                    : isDarkMode
                      ? "bg-slate-800 text-gray-300 hover:bg-slate-700 border-transparent"
                      : "bg-gray-50 text-gray-700 hover:bg-cyan-50 hover:text-cyan-700 border-transparent shadow-sm"
                    }`}
                >
                  <span className="font-medium">
                    {p.service_name}
                  </span>
                  {p.price > 0 && (
                    <span className="text-xs opacity-80">
                      ₹{p.price}
                    </span>
                  )}
                </Button>
              ))}
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button
              disabled={!date || !time || !purpose || isBooking}
              onClick={() =>
                onConfirm({ date, time, purpose })
              }
              className="w-full md:w-auto mt-8 bg-gradient-to-r from-cyan-500 to-blue-500 hover:shadow-cyan-500/30 hover:shadow-lg text-white py-6 px-12 rounded-full text-lg font-bold transition-all active:scale-95 disabled:opacity-50 disabled:shadow-none disabled:hover:scale-100 border-0"
            >
              {isBooking ? "Processing..." : "Confirm Appointment"}
            </Button>
          </div>
        </>
      )}
    </>
  );
}
