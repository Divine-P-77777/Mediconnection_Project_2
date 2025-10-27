"use client";
import { useState } from "react";
import { useSelector } from "react-redux";
import { format, isValid } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import { useForm, Controller } from "react-hook-form";
import Calendar from "./Calender";
import SeamlessCalendar from "@/components/ui/SeamlessCalendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader } from "lucide-react";

function BookAppointment() {
  const isDarkMode = useSelector((s) => s.theme.isDarkMode);
  const { user } = useAuth();
  const { Success, errorToast } = useToast();

  const [step, setStep] = useState(1);
  const [healthCenters, setHealthCenters] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedPurpose, setSelectedPurpose] = useState("");
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [loadingCenters, setLoadingCenters] = useState(false);
  const [pincode, setPincode] = useState("");
  const [error, setError] = useState("");

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      fullName: user?.name || "",
      phone: user?.phone || "",
      gender: "",
      dob: null,
    },
  });

  const personalInfo = watch();

  // 🔍 Search health centers
  const searchCenters = async (pin) => {
    if (!pin || pin.length !== 6) return;
    setLoadingCenters(true);
    setError("");
    try {
      const res = await fetch(`/api/healthcenter/search?pincode=${pin}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.centers)) {
        setHealthCenters(data.centers);
        setStep(2);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setError("No health centers found.");
        errorToast("No health centers found.");
      }
    } catch {
      setError("Failed to fetch centers.");
      errorToast("Failed to fetch centers.");
    } finally {
      setLoadingCenters(false);
    }
  };

  const handleSearchNearby = () => {
    if (user?.pincode) searchCenters(user.pincode);
    else errorToast("Pincode not found in your profile.");
  };

  // Availability and purpose lists
  const availabilityList = Array.isArray(selectedCenter?.availability)
    ? selectedCenter.availability
    : [];

  const purposesList = Array.isArray(selectedCenter?.purposes)
    ? selectedCenter.purposes
    : [];

  const availableDaysOfWeek = availabilityList
    .filter((a) => a.status === "available")
    .map((a) => a.day_of_week);

  const slotsForDate = appointmentDate
    ? (() => {
        const dayOfWeek = format(appointmentDate, "EEEE");
        const found = availabilityList.find((a) => a.day_of_week === dayOfWeek);
        return found && found.status === "available"
          ? (found.slot_time || [])
              .flatMap((s) =>
                s.split(",").map((val) => val.trim()).filter(Boolean)
              )
          : [];
      })()
    : [];

  const activePurposes = purposesList
    .filter((p) => p.status === "active")
    .map((p) => p.service_name);

  // 🧾 Appointment booking (creates appointment and triggers payment only if price > 0)
  const bookAppointment = async (data) => {
    setError("");

    if (!selectedCenter || !appointmentDate || !selectedTime || !selectedPurpose) {
      errorToast("Please complete all selections.");
      return;
    }

    const appointmentPayload = {
      center_id: selectedCenter.id,
      user_id: user?.id,
      center_name: selectedCenter.name,
      date: format(new Date(appointmentDate), "yyyy-MM-dd"),
      time: selectedTime,
      purpose: selectedPurpose,
      user_name: data.fullName,
      phone: data.phone,
      gender: data.gender,
      dob: format(new Date(data.dob), "yyyy-MM-dd"),
    };

    try {
      const res = await fetch("/api/appointments/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appointmentPayload),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to book appointment.");

      const appointmentId = json.appointment_id;
      Success("Appointment booked successfully!");

      // 💳 Only start payment flow if paid service
      if (selectedPrice > 0) {
        await startPaymentFlow({
          appointment_id: appointmentId,
          amount: selectedPrice,
          customer_id: user?.id,
          customer_name: data.fullName,
          customer_email: user?.email,
          customer_phone: data.phone,
        });
      } else {
        Success("Free appointment booked successfully!");
      }
    } catch (err) {
      errorToast("Booking failed: " + err.message);
      setError("Booking failed: " + err.message);
    }
  };

  // 💰 Payment order creation
  const startPaymentFlow = async (paymentData) => {
    try {
      const res = await fetch("/api/appointments/payment/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentData),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Payment order failed.");

      const { payment_session_id } = json;
      if (!payment_session_id) throw new Error("Payment session missing.");

      if (typeof window !== "undefined" && window.Cashfree) {
        const cashfree = new window.Cashfree({ mode: "sandbox" });
        cashfree.checkout({
          paymentSessionId: payment_session_id,
          redirectTarget: "_self",
        });
      } else {
        errorToast("Cashfree SDK not loaded.");
      }
    } catch (err) {
      console.error("Payment error:", err);
      errorToast("Payment failed: " + err.message);
    }
  };

  // Styling
  const inputClass = `w-full p-3 rounded-lg border focus:outline-none ${
    isDarkMode
      ? "bg-[#112240] border-gray-600 text-white"
      : "bg-white border-gray-300 text-black"
  }`;
  const cardClass = `${
    isDarkMode
      ? "bg-[#0A192F] text-white border border-gray-700"
      : "bg-white text-black"
  }`;



  return (
    <div
      className={`w-full min-h-screen mt-10 px-4 py-5 ${
        isDarkMode ? "bg-[#020c1b] text-white" : "bg-gray-50 text-black"
      }`}
    >
      <h1 className="text-3xl font-bold text-center mt-20 mb-6 text-cyan-500">
        Book Your Appointment
      </h1>
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Step 1 */}
        {step === 1 && (
          <form onSubmit={handleSubmit(() => { setStep(2); window.scrollTo({top:0,behavior:"smooth"});})}>
            <Card className={`p-6 shadow-lg ${cardClass}`}>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <label>Full Name</label>
                <Controller
                  name="fullName"
                  control={control}
                  rules={{ required: "Full Name is required" }}
                  render={({ field }) => (
                    <input {...field} placeholder="Full Name" className={inputClass} />
                  )}
                />
                {errors.fullName && <div className="text-red-400">{errors.fullName.message}</div>}

                <label>Date of Birth</label>
                <Controller
                  name="dob"
                  control={control}
                  rules={{ required: "Date of Birth is required", validate: (v) => isValid(v) || "Invalid date" }}
                  render={({ field }) => (
                    <SeamlessCalendar onDateChange={field.onChange} selectedDate={field.value} darkMode={isDarkMode}/>
                  )}
                />
                {errors.dob && <div className="text-red-400">{errors.dob.message}</div>}

                <label>Phone</label>
                <Controller
                  name="phone"
                  control={control}
                  rules={{ required: "Phone is required", pattern: { value: /^[0-9]{10}$/, message: "Phone must be 10 digits" } }}
                  render={({ field }) => (
                    <input {...field} placeholder="Phone" maxLength={10} onChange={(e)=>field.onChange(e.target.value.replace(/\D/g,''))} className={inputClass}/>
                  )}
                />
                {errors.phone && <div className="text-red-400">{errors.phone.message}</div>}

                <label>Gender</label>
                <Controller
                  name="gender"
                  control={control}
                  rules={{ required: "Gender is required" }}
                  render={({ field }) => (
                    <select {...field} className={inputClass}>
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  )}
                />
                {errors.gender && <div className="text-red-400">{errors.gender.message}</div>}

                <Button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-lg">
                  Continue
                </Button>
              </CardContent>
            </Card>
          </form>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <Card className={`p-6 shadow-lg ${cardClass}`}>
            <CardHeader>
              <CardTitle>Find Health Center</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter 6-digit pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                  maxLength={6}
                  className={inputClass}
                />
                <Button onClick={() => searchCenters(pincode)} disabled={loadingCenters || pincode.length !== 6}>
                  {loadingCenters ? <Loader className="animate-spin w-7 h-7" /> : "Search"}
                </Button>
                <Button variant="outline" onClick={handleSearchNearby} disabled={loadingCenters}>
                  Nearby
                </Button>
              </div>
              {error && <div className="text-red-400 text-center">{error}</div>}
              {healthCenters.length > 0 && (
                <select
                  className={inputClass}
                  value={selectedCenter?.id || ""}
                  onChange={(e) => {
                    const center = healthCenters.find((c) => String(c.id) === e.target.value);
                    setSelectedCenter(center || null);
                  }}
                >
                  <option value="" disabled>Select a Health Center</option>
                  {healthCenters.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              )}
              {selectedCenter && (
                <Button className="w-full mt-4 bg-cyan-500 text-white" onClick={() => {setStep(3); window.scrollTo({top:0,behavior:"smooth"});}}>
                  Continue
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 3 */}
{step === 3 && selectedCenter && (
  <>
    {/* 📅 Date Selection */}
    <Calendar
      selectedCenter={selectedCenter}
      selectedDate={appointmentDate}
      handleDateSelect={setAppointmentDate}
      isDarkMode={isDarkMode}
      availableDaysOfWeek={availableDaysOfWeek}
    />

    {/* 🕒 Time Slots */}
    <Card className={`p-6 shadow-lg mt-6 ${cardClass}`}>
      <CardHeader>
        <CardTitle>Select Time Slot</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {slotsForDate.length > 0 ? (
          slotsForDate.map((time) => (
            <Button
              key={time}
              onClick={() => setSelectedTime(time)}
              className={`${
                selectedTime === time
                  ? "bg-cyan-500 text-white"
                  : isDarkMode
                  ? "bg-[#112240] text-white border"
                  : "bg-white border"
              }`}
            >
              {time}
            </Button>
          ))
        ) : (
          <div className="col-span-full text-center text-red-400">
            No slots available for this date.
          </div>
        )}
      </CardContent>
    </Card>

    {/* 🩺 Purpose of Visit */}
    <Card className={`p-6 shadow-lg mt-6 ${cardClass}`}>
      <CardHeader>
        <CardTitle>Purpose of Visit</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {activePurposes.length > 0 ? (
          selectedCenter.purposes
            .filter((p) => p.status === "active")
            .map((p) => (
              <Button
                key={p.service_name}
                onClick={() => {
                  setSelectedPurpose(p.service_name);
                  setSelectedPrice(Number(p.price) || 0);
                }}
                className={`${
                  selectedPurpose === p.service_name
                    ? "bg-cyan-500 text-white"
                    : isDarkMode
                    ? "bg-[#112240] text-white border"
                    : "bg-white border"
                }`}
              >
                {p.service_name}
                {p.price > 0 && (
                  <span className="ml-2 text-sm text-gray-400">
                    ₹{p.price}
                  </span>
                )}
              </Button>
            ))
        ) : (
          <div className="col-span-full text-center text-red-400">
            No services available at this center.
          </div>
        )}
      </CardContent>
    </Card>

    {/* ✅ Final Action Button */}
    <Button
      className="w-full mt-6 bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-lg"
      disabled={
        !selectedCenter ||
        !appointmentDate ||
        !selectedTime ||
        !selectedPurpose ||
        isSubmitting
      }
      onClick={handleSubmit(async (data) => {
        try {
          // Step 1️⃣ - Always create the appointment first
          const appointmentRes = await bookAppointment(data);

          // Step 2️⃣ - Only start payment flow if price > 0
          if (selectedPrice > 0 && appointmentRes?.appointment_id) {
            await startPaymentFlow({
              appointment_id: appointmentRes.appointment_id,
              amount: selectedPrice,
              customer_id: user?.id,
              customer_name: data.fullName,
              customer_email: user?.email,
              customer_phone: data.phone,
            });
          }
        } catch (err) {
          console.error("Booking or payment failed:", err);
          errorToast("Something went wrong: " + err.message);
        }
      })}
    >
      {isSubmitting ? (
        <Loader className="animate-spin" />
      ) : selectedPrice > 0 ? (
        `Pay ₹${selectedPrice} & Confirm`
      ) : (
        "Book Appointment (Free)"
      )}
    </Button>

    {/* 🟢 Booking Info */}
    {selectedPurpose && selectedPrice === 0 && (
      <div className="text-green-400 text-center mt-3">
        ✅ This appointment is free of charge.
      </div>
    )}

    {error && (
      <div className="text-red-400 text-center mt-4">{error}</div>
    )}
  </>
)}


      </div>
    </div>
  );
}
export default BookAppointment;
