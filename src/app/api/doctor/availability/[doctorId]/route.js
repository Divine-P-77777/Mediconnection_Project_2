import { NextResponse } from "next/server";
import { supabase } from "@/supabase/client";

// Map days to numeric indices
const daysMap = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

// Utility: get next date for a weekday
function getNextDateForDay(dayName) {
  const today = new Date();
  const todayDay = today.getDay();
  const targetDay = daysMap[dayName.toLowerCase()];
  if (targetDay === undefined) return null;

  let daysUntil = targetDay - todayDay;
  if (daysUntil < 0) daysUntil += 7;

  const nextDate = new Date();
  nextDate.setDate(today.getDate() + daysUntil);

  return nextDate;
}

export async function GET(req, { params }) {
  const { doctorId } = await params; // ✅ no await here

  if (!doctorId) {
    return NextResponse.json(
      { success: false, error: "Doctor ID is required" },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await supabase
      .from("doctor_availability")
      .select("day_of_week, slot_time, status")
      .eq("doctor_id", doctorId);

    if (error) throw error;

    // Add actual dates + display labels
    const availability = (data || [])
      .map((d) => {
        const date = getNextDateForDay(d.day_of_week);
        if (!date) return null;

        return {
          ...d,
          actual_date: date.toISOString().split("T")[0], // YYYY-MM-DD
          display_label: `${d.day_of_week} - ${date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}`,
        };
      })
      .filter(Boolean); // remove invalid/null

    return NextResponse.json({ success: true, availability });
  } catch (err) {
    console.error("Error fetching availability:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
