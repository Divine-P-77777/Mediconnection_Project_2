"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { useSelector } from "react-redux";
import { useAuth } from "@/hooks/useAuth";
import Loader from "@/app/components/Loader";

/* ---------- Types ---------- */

type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

type AvailabilityStatus = "available" | "unavailable";

interface DayAvailability {
  day_of_week: DayOfWeek;
  slots: string[];
  status: AvailabilityStatus;
}

interface RootState {
  theme: {
    isDarkMode: boolean;
  };
}

/* ---------- Constants ---------- */

const daysOfWeek: DayOfWeek[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const defaultSlots: string[] = [
  "09:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "03:00 PM - 04:00 PM",
  "04:00 PM - 05:00 PM",
  "05:00 PM - 06:00 PM",
];

/* ---------- Component ---------- */

const HealthCenterManageProfile = () => {
  const isDarkMode = useSelector(
    (state: RootState) => state.theme.isDarkMode
  );

  const { user } = useAuth();
  const userId: string | undefined = user?.id;

  const [healthCenterId, setHealthCenterId] = useState<number | null>(null);

  const [availability, setAvailability] = useState<DayAvailability[]>(
    daysOfWeek.map((day) => ({
      day_of_week: day,
      slots: [],
      status: "available",
    }))
  );

  const [activeTab, setActiveTab] = useState<DayOfWeek>("Monday");
  const [newSlot, setNewSlot] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [initLoading, setInitLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>("");

  /* ---------- Fetch Health Center ID ---------- */
  useEffect(() => {
    if (!userId) {
      setInitLoading(false);
      setHealthCenterId(null);
      return;
    }

    setInitLoading(true);
    setErrorMsg("");

    fetch(`/api/healthcenter/getHealthCenterId?user_id=${userId}`)
      .then((res) => res.json())
      .then((data: { health_center_id?: number }) => {
        setHealthCenterId(data.health_center_id ?? null);
      })
      .catch((err: Error) => {
        setErrorMsg(`Failed to load health center: ${err.message}`);
        setHealthCenterId(null);
      })
      .finally(() => {
        setInitLoading(false);
      });
  }, [userId]);

  /* ---------- Fetch Availability ---------- */
  useEffect(() => {
    if (!healthCenterId) return;

    setLoading(true);
    setErrorMsg("");

    fetch(`/api/healthcenter/slot?health_center_id=${healthCenterId}`)
      .then((res) => res.json())
      .then((data: Array<{ day_of_week: DayOfWeek; slot_time: string[]; status: AvailabilityStatus }>) => {
        const mapped: DayAvailability[] = daysOfWeek.map((day) => {
          const record = data.find((d) => d.day_of_week === day);
          return {
            day_of_week: day,
            slots: record?.slot_time ?? [],
            status: record?.status ?? "available",
          };
        });
        setAvailability(mapped);
      })
      .catch((err: Error) => {
        setErrorMsg(`Failed to fetch slots: ${err.message}`);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [healthCenterId]);

  /* ---------- Handlers ---------- */

  const toggleSlot = (day: DayOfWeek, slot: string): void => {
    setAvailability((prev) =>
      prev.map((d) =>
        d.day_of_week === day
          ? {
              ...d,
              slots: d.slots.includes(slot)
                ? d.slots.filter((s) => s !== slot)
                : [...d.slots, slot],
            }
          : d
      )
    );
  };

  const toggleStatus = (day: DayOfWeek): void => {
    setAvailability((prev) =>
      prev.map((d) =>
        d.day_of_week === day
          ? {
              ...d,
              status: d.status === "available" ? "unavailable" : "available",
            }
          : d
      )
    );
  };

  const addCustomSlot = (): void => {
    if (!newSlot.trim()) return;
    toggleSlot(activeTab, newSlot.trim());
    setNewSlot("");
  };

  const handleSave = async (): Promise<void> => {
    if (!healthCenterId) {
      setErrorMsg("Health center not found!");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/healthcenter/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          health_center_id: healthCenterId,
          availability,
        }),
      });

      const data: {
        success: boolean;
        error?: string;
        updatedAvailability?: Array<{
          day_of_week: DayOfWeek;
          slot_time: string[];
          status: AvailabilityStatus;
        }>;
      } = await res.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to save availability");
      }

      if (data.updatedAvailability) {
        const updated = daysOfWeek.map((day) => {
          const record = data.updatedAvailability?.find(
            (d) => d.day_of_week === day
          );
          return {
            day_of_week: day,
            slots: record?.slot_time ?? [],
            status: record?.status ?? "available",
          };
        });
        setAvailability(updated);
      }

      alert("Availability saved successfully ✅");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unknown error";
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- UI ---------- */

  if (initLoading) return <Loader />;

  if (!healthCenterId) {
    return (
      <div className="p-6 text-center text-red-600">
        No health center found for your account.
        {errorMsg && <p className="mt-2">{errorMsg}</p>}
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-20 px-6 transition-colors ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      <h1 className="text-3xl font-bold mb-6 text-cyan-500">
        Manage Health Center Availability
      </h1>
      <p className="mb-4 text-sm opacity-80">
        Select consulting days and slots for your Health Center. Patients will
        only see the slots you mark as{" "}
        <span className="text-cyan-500 font-semibold">available</span>.
      </p>

      {errorMsg && <div className="mb-4 text-red-500">{errorMsg}</div>}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {daysOfWeek.map((day) => (
          <button
            key={day}
            onClick={() => setActiveTab(day)}
            className={`px-4 py-2 rounded-xl font-medium transition ${
              activeTab === day
                ? "bg-cyan-500 text-white"
                : isDarkMode
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Active Day */}
      {availability
        .filter((d) => d.day_of_week === activeTab)
        .map((day) => (
          <div
            key={day.day_of_week}
            className={`p-5 rounded-2xl shadow-md ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{day.day_of_week}</h2>
              <button
                onClick={() => toggleStatus(day.day_of_week)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  day.status === "available"
                    ? "bg-cyan-500 text-white hover:bg-cyan-600"
                    : "bg-red-500 text-white hover:bg-red-600"
                }`}
              >
                {day.status}
              </button>
            </div>

            {/* Default Slots */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
              {defaultSlots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => toggleSlot(day.day_of_week, slot)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    day.slots.includes(slot)
                      ? "bg-cyan-500 text-white border-cyan-500"
                      : isDarkMode
                      ? "bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-200"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>

            {/* Custom Slot Add */}
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={newSlot}
                onChange={(e) => setNewSlot(e.target.value)}
                placeholder="e.g., 07:00 PM - 08:00 PM"
                className={`flex-1 px-3 py-2 rounded-lg border ${
                  isDarkMode
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-white text-black border-gray-300"
                }`}
              />
              <button
                onClick={addCustomSlot}
                className="px-4 py-2 rounded-lg bg-cyan-500 text-white hover:bg-cyan-600"
              >
                Add
              </button>
            </div>

            {/* Selected Slots */}
            {day.slots.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Selected Slots:</h3>
                <div className="flex flex-wrap gap-2">
                  {day.slots.map((slot, i) => {
                    const isCustom = !defaultSlots.includes(slot);
                    return (
                      <span
                        key={i}
                        onClick={() => {
                          if (isCustom) toggleSlot(day.day_of_week, slot);
                        }}
                        className={`px-3 py-1 rounded-full text-sm cursor-pointer ${
                          isCustom
                            ? "bg-red-200 text-red-700 hover:bg-red-300 dark:bg-red-600 dark:text-white"
                            : "bg-cyan-100 text-cyan-700 dark:bg-cyan-600 dark:text-white"
                        }`}
                        title={isCustom ? "Click to remove custom slot" : ""}
                      >
                        {slot}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}

      {/* Save Button */}
      <div className="mt-8">
        <button
          onClick={handleSave}
          disabled={loading || !healthCenterId}
          className={`px-6 py-3 rounded-xl font-semibold shadow-md transition flex items-center gap-2 ${
            loading
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-cyan-500 text-white hover:bg-cyan-600"
          }`}
        >
          {loading && (
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          )}
          {loading ? "Saving..." : "Save Availability"}
        </button>
      </div>
    </div>
  );
};

export default HealthCenterManageProfile;