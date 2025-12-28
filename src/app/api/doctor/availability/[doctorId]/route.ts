import { NextResponse } from "next/server";
import { supabase } from "@/supabase/client";

/* -------------------- TYPES -------------------- */
type WeekDay =
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday";

interface DoctorAvailability {
  day_of_week: string;
  slot_time: string[];
  status: string;
}

interface EnhancedAvailability extends DoctorAvailability {
  actual_date: string;
  display_label: string;
}

// Map days to numeric indices
const daysMap: Record<string, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

// Utility: get next date for a weekday
function getNextDateForDay(dayName: string): Date | null {
  const today = new Date();
  const todayDay = today.getDay(); // 0 = Sunday
  const targetDay = daysMap[dayName.toLowerCase()];

  if (targetDay === undefined) return null;

  let daysUntil = targetDay - todayDay;
  if (daysUntil < 0) daysUntil += 7;

  const nextDate = new Date();
  nextDate.setDate(today.getDate() + daysUntil);

  return nextDate;
}

/* -------------------- GET -------------------- */

// Next.js 15+: params is a Promise
interface RouteParams {
  params: Promise<{ doctorId: string }>;
}

export async function GET(
  req: Request,
  { params }: RouteParams
): Promise<NextResponse> {
  const { doctorId } = await params;

  if (!doctorId) {
    return NextResponse.json(
      { success: false, error: "Doctor ID is required" },
      { status: 400 }
    );
  }

  try {
    const { data: availabilityData, error } = await supabase
      .from("doctor_availability")
      .select("day_of_week, slot_time, status")
      .eq("doctor_id", doctorId);

    if (error) throw error;

    const rawData = (availabilityData ?? []) as DoctorAvailability[];

    // Add actual dates + display labels
    const availability: EnhancedAvailability[] = rawData
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
      .filter((item): item is EnhancedAvailability => item !== null);

    return NextResponse.json({ success: true, availability });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Internal server error";
    console.error("Error fetching availability:", err);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
