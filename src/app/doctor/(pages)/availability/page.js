"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { supabase } from "@/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Loader from "@/app/components/Loader";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const defaultSlots = [
  "09:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "03:00 PM - 04:00 PM",
  "04:00 PM - 05:00 PM",
  "05:00 PM - 06:00 PM",
];

const DoctorManageProfile = () => {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const { user } = useAuth();
  const doctor_id = user?.id;
const { errorToast } = useToast();
  const router = useRouter();


    if(!user){
    router.push("/auth/doctor");
    errorToast("Please login to access doctor portal");
    return null;
  }

  const [availability, setAvailability] = useState(
    daysOfWeek.map((day) => ({
      day_of_week: day,
      slots: [],
      status: "available",
    }))
  );

  const [activeTab, setActiveTab] = useState("Monday");
  const [newSlot, setNewSlot] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch existing availability from Supabase
  useEffect(() => {
    if (!doctor_id) return;

    const fetchAvailability = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("doctor_availability")
          .select("*")
          .eq("doctor_id", doctor_id);

        if (error) throw error;

        if (data && data.length > 0) {
          // Map fetched availability to local state
          const mapped = daysOfWeek.map((day) => {
            const record = data.find((d) => d.day_of_week === day);
            return {
              day_of_week: day,
              slots: record?.slot_time || [],
              status: record?.status || "available",
            };
          });
          setAvailability(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch availability:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [doctor_id]);

  const toggleSlot = (day, slot) => {
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

  const toggleStatus = (day) => {
    setAvailability((prev) =>
      prev.map((d) =>
        d.day_of_week === day
          ? { ...d, status: d.status === "available" ? "unavailable" : "available" }
          : d
      )
    );
  };

  const addCustomSlot = () => {
    if (!newSlot.trim()) return;
    toggleSlot(activeTab, newSlot.trim());
    setNewSlot("");
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/doctor/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctor_id, availability }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Availability saved successfully ✅");

        // Auto-reflect saved availability
        if (data.updatedAvailability) {
          setAvailability(
            daysOfWeek.map((day) => {
              const record = data.updatedAvailability.find((d) => d.day_of_week === day);
              return {
                day_of_week: day,
                slots: record?.slot_time || [],
                status: record?.status || "available",
              };
            })
          );
        }
      } else {
        alert("Error: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save availability");
    } finally {
      setLoading(false);
    }
  };

  if(loading) {
    return (
      <Loader/>
    );
  }

  return (
    <div
      className={`min-h-screen pt-20 px-6 transition-colors ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <h1 className="text-3xl font-bold mb-6 text-cyan-500">
        Manage Your Availability
      </h1>
      <p className="mb-4 text-sm opacity-80">
        Select your consulting days and time ranges. Patients will only see the
        slots you mark as{" "}
        <span className="text-cyan-500 font-semibold">available</span>.
      </p>

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

      {/* Active Day Panel */}
      {availability
        .filter((d) => d.day_of_week === activeTab)
        .map((day) => (
          <div
            key={day.day_of_week}
            className={`p-5 rounded-2xl shadow-md ${
              isDarkMode ? "bg-gray-800" : "bg-gray-100"
            }`}
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
              if (isCustom) toggleSlot(day.day_of_week, slot); // only remove custom slots
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
          disabled={loading}
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

export default DoctorManageProfile;
