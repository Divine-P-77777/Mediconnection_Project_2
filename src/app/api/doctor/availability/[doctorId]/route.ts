import { NextResponse } from "next/server";
import { serviceSupabase } from "@/supabase/serviceClient";

/* -------------------- TYPES -------------------- */

interface DoctorAvailability {
  day_of_week: string;
  slot_time: string[];
  status: string;
}

interface EnhancedAvailability extends DoctorAvailability {
  actual_date: string;
  display_label: string;
}

const daysMap: Record<string, number> = {
  sunday: 0, monday: 1, tuesday: 2, wednesday: 3,
  thursday: 4, friday: 5, saturday: 6,
};

function getNextDateForDay(dayName: string): Date | null {
  const today = new Date();
  const targetDay = daysMap[dayName.toLowerCase()];
  if (targetDay === undefined) return null;

  let daysUntil = targetDay - today.getDay();
  if (daysUntil < 0) daysUntil += 7;

  const nextDate = new Date();
  nextDate.setDate(today.getDate() + daysUntil);
  return nextDate;
}

/* -------------------- GET -------------------- */

interface RouteParams {
  params: Promise<{ doctorId: string }>;
}

export async function GET(req: Request, { params }: RouteParams) {
  const { doctorId } = await params;

  if (!doctorId) {
    return NextResponse.json({ success: false, error: "Doctor ID is required" }, { status: 400 });
  }

  try {
    const { data, error } = await serviceSupabase
      .from("doctor_availability")
      .select("day_of_week, slot_time, status")
      .eq("doctor_id", doctorId);

    if (error) throw error;

    const availability: EnhancedAvailability[] = ((data ?? []) as DoctorAvailability[])
      .map((d) => {
        const date = getNextDateForDay(d.day_of_week);
        if (!date) return null;
        return {
          ...d,
          actual_date: date.toISOString().split("T")[0],
          display_label: `${d.day_of_week} - ${date.toLocaleDateString("en-US", {
            weekday: "short", month: "short", day: "numeric",
          })}`,
        };
      })
      .filter((item): item is EnhancedAvailability => item !== null);

    return NextResponse.json({ success: true, availability });
  } catch (err: any) {
    console.error("Error fetching availability:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
