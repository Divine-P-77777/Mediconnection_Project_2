import { useState, useMemo } from "react";
import { format } from "date-fns";
import Calendar from "./Calender";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";

export default function ScheduleStep({ center, form, onConfirm, isBooking }) {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState("");
  const [purpose, setPurpose] = useState(null);

  const availability = center.availability || [];
  const purposes = center.purposes?.filter((p) => p.status === "active") || [];

  const slots = useMemo(() => {
    if (!date) return [];
    const day = format(date, "EEEE");
    return (
      availability.find((a) => a.day_of_week === day)?.slot_time || []
    );
  }, [date, availability]);

  return (
    <>
      <Calendar
        selectedCenter={center}
        selectedDate={date}
        handleDateSelect={setDate}
        isDarkMode={isDarkMode}
      />



      {/* Logic: If date selected but NO slots, show warning */}
      {
        date && slots.length === 0 && (
          <Card className={`mt-6 p-6 text-center border-l-4 border-l-red-500 shadow-md ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white"}`}>
            <p className="text-red-500 font-semibold text-lg">No slots available for this date.</p>
            <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Please select another date from the calendar.</p>
          </Card>
        )
      }

      {/* Only show Time & Purpose if slots exist */}
      {
        slots.length > 0 && (
          <>
            <Card className={`mt-6 p-2 shadow-md transition-all duration-300 ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white"}`}>
              <CardHeader>
                <CardTitle className={`text-center ${isDarkMode ? "text-white" : "text-gray-900"}`}>Select Time</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-3 gap-2">
                {slots.map((t) => (
                  <Button
                    key={t}
                    onClick={() => setTime(t)}
                    className={`transition-all duration-300 ${time === t
                      ? "bg-cyan-600 text-white hover:bg-cyan-700 shadow-md shadow-cyan-500/20"
                      : isDarkMode
                        ? "bg-slate-800 text-gray-300 hover:bg-slate-700 border border-slate-700"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                      }`}
                  >
                    {t}
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card className={`mt-6 p-2 shadow-md transition-all duration-300 ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white"}`}>
              <CardHeader>
                <CardTitle className={`text-center ${isDarkMode ? "text-white" : "text-gray-900"}`}  >Purpose</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-2">
                {purposes.map((p) => (
                  <Button
                    key={p.service_name}
                    onClick={() => setPurpose(p)}
                    className={`h-auto py-3 whitespace-normal text-left flex flex-col items-start transition-all duration-300 ${purpose?.service_name === p.service_name
                      ? "bg-cyan-600 text-white hover:bg-cyan-700 shadow-md shadow-cyan-500/20"
                      : isDarkMode
                        ? "bg-slate-800 text-gray-300 hover:bg-slate-700 border border-slate-700"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                      }`}
                  >
                    <span className="font-medium">{p.service_name}</span>
                    {p.price > 0 && <span className="text-xs opacity-80">₹{p.price}</span>}
                  </Button>
                ))}
              </CardContent>
            </Card>
            <div className="flex justify-center">
              <Button
                disabled={!date || !time || !purpose || isBooking}
                onClick={() => onConfirm({ date, time, purpose })}
                className="w-fit mt-6 bg-cyan-600 hover:bg-cyan-700 text-white py-1 px-6 text-lg font-semibold shadow-lg shadow-cyan-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:shadow-none"
              >
                {isBooking ? "Processing..." : "Confirm Appointment"}
              </Button>
            </div>
          </>
        )
      }
    </>
  );
}
