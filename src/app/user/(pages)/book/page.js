"use client"
import { useState } from "react";
import { useSelector } from "react-redux";
import { format, isValid, parseISO } from "date-fns";
import { supabase } from "@/supabase/client";
import Calendar from "./Calender";
import SeamlessCalendar from "@/components/ui/SeamlessCalendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useForm, Controller } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
const cn = (cls, dark) =>
  Array.isArray(cls) 
    ? cls.map((c) => (typeof c === "function" ? c(dark) : c)).join(" ")
    : typeof cls === "function"
      ? cls(dark)
      : cls;

function BookAppointment() {
  const isDarkMode = useSelector((s) => s.theme.isDarkMode);

  // Search & Centers
  const [pincode, setPincode] = useState("");
  const [healthCenters, setHealthCenters] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [loadingCenters, setLoadingCenters] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedPurpose, setSelectedPurpose] = useState("");
  const { user } = useAuth();


 

  // react-hook-form
  const {
    control,
    handleSubmit,
    reset: formReset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      fullName: "",
      phone: "",
      gender: "",
      dob: null,
    },
  });

  // watch values for form fields
  const personalInfo = watch();

  // Reset all fields including react-hook-form
  const resetAll = () => {
    setPincode("");
    setHealthCenters([]);
    setSelectedCenter(null);
    setAppointmentDate(null);
    setSelectedTime("");
    setSelectedPurpose("");
    setHasSearched(false);
    formReset();
  };

  // Fetch centers by pincode
  const fetchCenters = async () => {
    if (pincode.length !== 6) return alert("Enter valid 6-digit pincode");

    setLoadingCenters(true);
    setHasSearched(true);

    const { data, error } = await supabase
      .from("health_centers_public")
      .select("*")
      .eq("pincode", pincode)
      .eq("approved", true)
      .eq("current_status", true);

    setLoadingCenters(false);
    if (error) return alert("Failed to load centers");

    setHealthCenters(data || []);
    setSelectedCenter(data?.[0] || null);
  };

  // Validate a date (string or Date)
  const isValidDate = (d) => {
    if (!d) return false;
    if (d instanceof Date) return isValid(d);
    if (typeof d === "string") {
      const parsed = parseISO(d);
      return isValid(parsed);
    }
    return false;
  };

  // Book appointment handler (react-hook-form submit)
  const onSubmit = async (data) => {
      if (!user?.id) {
    alert("You must be logged in to book an appointment.");
    return;
  }
    const { fullName, phone, gender, dob } = data;
    if (
      !selectedCenter ||
      !appointmentDate ||
      !selectedTime ||
      !selectedPurpose ||
      !fullName.trim() ||
      !phone.trim() ||
      !gender.trim() ||
      !dob ||
      !isValidDate(dob) ||
      !isValidDate(appointmentDate)
    ) {
      alert("All fields are required");
      return;
    }
 
   
    const { error } = await supabase.from("appointments").insert([
      {
        center_id: selectedCenter.id,
        user_id: user?.id,
        center_name: selectedCenter.name,
        date: format(new Date(appointmentDate), "yyyy-MM-dd"),
        time: selectedTime,
        purpose: selectedPurpose,
        user_name: fullName,
        phone,
        gender,
        dob: format(new Date(dob), "yyyy-MM-dd"),
      },
    ]);

    if (error) alert("Booking failed");
    else {
      alert("Appointment booked!");
      resetAll();
    }
  };

  // Ensure we always have arrays
  const availabilityList = Array.isArray(selectedCenter?.availability)
    ? selectedCenter.availability
    : [];

  const purposesList = Array.isArray(selectedCenter?.purposes)
    ? selectedCenter.purposes
    : [];

  // Get available days for the calendar (for highlighting or selection)
  const availableDaysOfWeek = availabilityList
    .filter((a) => a.status === "available")
    .map((a) => a.day_of_week);

  // Find availability for the selected appointment day
  let slotsForDate = [];
  let statusForDate = "";

  if (appointmentDate) {
    const dayOfWeek = format(appointmentDate, "EEEE");
    const found = availabilityList.find((a) => a.day_of_week === dayOfWeek);

    if (found) {
      statusForDate = found.status;
      slotsForDate = found.slot_time
        .map((s) => s.split(","))
        .flat()
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }

  // Active services
  const activePurposes = purposesList
    .filter((p) => p.status === "active")
    .map((p) => p.service_name);

  return (
    <div
      className={cn(
        [
          (isDark) =>
            `w-full min-h-screen mt-10 px-4 py-5 transition-all ${isDark ? "bg-[#0A192F] text-white" : "bg-white text-black"
            }`,
        ],
        isDarkMode
      )}
    >
      <h1 className="text-2xl sm:text-3xl font-bold text-center mt-20 mb-6">
        Book Your Appointment
      </h1>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Pincode Search */}
        <Card className="p-6 shadow-lg">
          <CardHeader className="flex justify-center">
            <CardTitle>Enter Your Pincode</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Enter 6-digit pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
              maxLength={6}
              className={cn(
                [
                  (isDark) =>
                    `w-full p-3 rounded-lg border ${isDark ? "bg-[#0A192F] text-white" : "bg-white text-black"
                    }`,
                ],
                isDarkMode
              )}
            />
            <Button onClick={fetchCenters} disabled={loadingCenters || pincode.length !== 6}>
              {loadingCenters ? "Searching..." : "Search"}
            </Button>
          </CardContent>
        </Card>

        {/* Health Center List */}
        {hasSearched && (
          <Card className="p-6 shadow-lg">
            <CardHeader className="flex justify-center">
              <CardTitle>Select Health Center</CardTitle>
            </CardHeader>
            <CardContent>
              {healthCenters.length === 0 ? (
                <div className="text-red-500 text-center">No health centers found</div>
              ) : (
                <select
                  className="w-full p-3 rounded-lg border"
                  value={selectedCenter?.id || ""}
                  onChange={(e) => {
                    const center = healthCenters.find((c) => String(c.id) === e.target.value);
                    setSelectedCenter(center || null);
                  }}
                >
                  <option value="" disabled>
                    Select a Health Center
                  </option>
                  {healthCenters.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              )}
            </CardContent>
          </Card>
        )}

        {/* Appointment Flow */}
        {selectedCenter && (
          <>
            {/* Calendar - optionally restrict selectable days */}
            <Calendar
              selectedCenter={selectedCenter}
              selectedDate={appointmentDate}
              handleDateSelect={setAppointmentDate}
              isDarkMode={isDarkMode}
              availableDaysOfWeek={availableDaysOfWeek}
            />

            {/* Time Slots */}
            <Card className="p-6 shadow-lg">
              <CardHeader>
                <CardTitle>Select Time Slot</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {slotsForDate.length > 0 && statusForDate === "available" ? (
                  slotsForDate.map((time) => (
                    <Button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={selectedTime === time ? "bg-cyan-500 text-white" : "bg-white border"}
                    >
                      {time} <span className="ml-2 text-xs">Available</span>
                    </Button>
                  ))
                ) : (
                  <div className="col-span-full text-center text-red-500">
                    No available slots for this day
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Purposes */}
            <Card className="p-6 shadow-lg">
              <CardHeader>
                <CardTitle>Purpose of Visit</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {activePurposes.length > 0 ? (
                  activePurposes.map((service) => (
                    <Button
                      key={service}
                      onClick={() => setSelectedPurpose(service)}
                      className={selectedPurpose === service ? "bg-cyan-500 text-white" : "bg-white border"}
                    >
                      {service}
                    </Button>
                  ))
                ) : (
                  <div className="col-span-full text-center text-red-500">
                    No available services for this center
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Personal Info */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <Card className="p-6 shadow-lg">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Controller
                    name="fullName"
                    control={control}
                    rules={{ required: "Full Name is required" }}
                    render={({ field }) => (
                      <input
                        {...field}
                        placeholder="Full Name"
                        className="w-full p-3 rounded-lg border"
                      />
                    )}
                  />
                  {errors.fullName && (
                    <div className="text-red-500 text-sm">{errors.fullName.message}</div>
                  )}

                  {/* FIXED: DOB - always set as Date object */}
                  <Controller
                    name="dob"
                    control={control}
                    rules={{
                      required: "Date of Birth is required",
                      validate: (v) => isValidDate(v) || "Invalid date",
                    }}
                    render={({ field }) => (
                      <SeamlessCalendar
                        onDateChange={(date) => {
                          // Always set as Date object or null
                          if (date instanceof Date && isValid(date)) {
                            field.onChange(date);
                          } else if (typeof date === "string" && isValid(new Date(date))) {
                            field.onChange(new Date(date));
                          } else {
                            field.onChange(null);
                          }
                        }}
                        selectedDate={field.value}
                      />
                    )}
                  />
                  {errors.dob && (
                    <div className="text-red-500 text-sm">{errors.dob.message}</div>
                  )}

                  <Controller
                    name="phone"
                    control={control}
                    rules={{
                      required: "Phone is required",
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Phone must be 10 digits",
                      },
                    }}
                    render={({ field }) => (
                      <input
                        {...field}
                        placeholder="Phone"
                        className="w-full p-3 rounded-lg border"
                        maxLength={10}
                        onChange={e => field.onChange(e.target.value.replace(/\D/g, ""))}
                      />
                    )}
                  />
                  {errors.phone && (
                    <div className="text-red-500 text-sm">{errors.phone.message}</div>
                  )}

                  <Controller
                    name="gender"
                    control={control}
                    rules={{ required: "Gender is required" }}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="w-full p-3 rounded-lg border"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    )}
                  />
                  {errors.gender && (
                    <div className="text-red-500 text-sm">{errors.gender.message}</div>
                  )}

                  <Button
                    type="submit"
                    disabled={
                      !selectedCenter ||
                      !appointmentDate ||
                      !selectedTime ||
                      !selectedPurpose ||
                      isSubmitting
                    }
                    className="w-full bg-cyan-500 text-white py-3 rounded-lg"
                  >
                    {isSubmitting ? "Booking..." : "Confirm Booking"}
                  </Button>
                </CardContent>
              </Card>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default BookAppointment; 