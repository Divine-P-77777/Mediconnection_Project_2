"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { format } from "date-fns";

import { useSelector } from "react-redux";
import { load } from "@cashfreepayments/cashfree-js";
import { useToast } from "@/hooks/use-toast";

import { useAuth } from "@/hooks/useAuth";
import Stepper from "./components/Stepper";
import PersonalInfoStep from "./components/PersonalInfoStep";
import CenterSearchStep from "./components/CenterSearchStep";
import ScheduleStep from "./components/ScheduleStep";

import BookingSuccessModal from "./components/BookingSuccessModal";

export default function BookAppointmentPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { errorToast, Success } = useToast();
  const isDarkMode = useSelector((s) => s.theme.isDarkMode);

  const [step, setStep] = useState(1);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [cashfree, setCashfree] = useState(null);
  const [isBooking, setIsBooking] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [lastAppointment, setLastAppointment] = useState(null);

  useEffect(() => {
    (async () => {
      const cf = await load({ mode: "sandbox" });
      setCashfree(cf);
    })();
  }, []);

  const form = useForm({
    defaultValues: {
      fullName: user?.name || "",
      phone: user?.phone || "",
      gender: "",
      dob: null,
    },
  });

  useEffect(() => {
    if (!user) router.push("/auth");
  }, [user, router]);

  const handleBooking = async ({ date, time, purpose }) => {
    if (!user) return;
    setIsBooking(true);

    // 1. Prepare Data
    const bookingData = {
      center_id: selectedCenter._id || selectedCenter.id,
      user_id: user._id || user.id,
      center_name: selectedCenter.name,
      // Ensure date is formatted as YYYY-MM-DD
      date: format(new Date(date), "yyyy-MM-dd"),
      time,
      purpose: purpose.service_name,
      user_name: form.getValues("fullName"),
      phone: form.getValues("phone"),
      gender: form.getValues("gender"),
      // Ensure dob is formatted as YYYY-MM-DD
      dob: format(new Date(form.getValues("dob")), "yyyy-MM-dd"),
      price: purpose.price,
      customer_email: user.email,
    };

    console.log("Booking Payload:", bookingData);

    try {
      // 2. Create Appointment FIRST
      const res = await fetch("/api/appointments/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      const json = await res.json();
      if (!json.success) {
        errorToast(json.error || "Booking failed");
        return;
      }

      const appointmentId = json.appointment_id;
      // Object for modal/PDF
      const confirmedAppointment = { ...bookingData, id: appointmentId, status: "confirmed" };

      if (purpose.price > 0) {
        // 3. PAID APPOINTMENT - Trigger Payment with Real ID
        const payRes = await fetch("/api/appointments/payment/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: purpose.price,
            customer_id: user._id || "cust_temp",
            customer_name: bookingData.user_name,
            customer_email: bookingData.customer_email,
            customer_phone: bookingData.phone,
            appointment_id: appointmentId,
          }),
        });
        const payData = await payRes.json();

        if (!payData.payment_session_id) {
          errorToast("Failed to initiate payment");
          return;
        }

        const checkoutOptions = {
          paymentSessionId: payData.payment_session_id,
          redirectTarget: "_self",
          onSuccess: async (paymentResponse) => {
            // Optional: Verify payment here if relying on client-side callback
            // But usually server webhook or return URL handles final status
            // For now, redirect to my bookings
            // Success("Payment initiated successfully!");
            // router.push("/user/book/mybooking");
            setLastAppointment(confirmedAppointment);
            setSuccessModalOpen(true);
          },
          onFailure: () => errorToast("Payment failed"),
        };

        if (cashfree) cashfree.checkout(checkoutOptions);

      } else {
        // 4. FREE APPOINTMENT
        // Success("Appointment booked successfully!");
        // router.push("/user/book/mybooking");
        setLastAppointment(confirmedAppointment);
        setSuccessModalOpen(true);
      }
    } catch (err) {
      console.error(err);
      errorToast("Something went wrong: " + err.message);
    } finally {
      // Small delay to prevent flickering if redirect happens fast or keep showing spinner until redirect?
      // Actually usually better to keep spinning if redirecting, but users might get stuck.
      // Safe to set false unless redirecting.
      // But router.push doesn't stop execution. 
      // Let's set false just in case of error. If success, page changes anyway.
      setIsBooking(false);
    }
  };

  return (
    <div className={`flex flex-col w-full  min-h-screen ${isDarkMode ? "bg-slate-900" : "bg-white"}`}>
      <div className={`max-w-3xl py-32 mx-auto p-4 min-h-screen ${isDarkMode ? "bg-slate-900" : "bg-white"}`}>
        <h1 className="text-3xl font-bold text-center text-cyan-500 mb-6">
          Book Appointment
        </h1>

        <Stepper step={step} />

        {step === 1 && (
          <PersonalInfoStep
            form={form}
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <CenterSearchStep
            onSelectCenter={setSelectedCenter}
            onNext={() => setStep(3)}
          />
        )}

        {step === 3 && selectedCenter && (
          <ScheduleStep
            center={selectedCenter}
            form={form}
            onConfirm={handleBooking}
            isBooking={isBooking}
          />
        )}

        <BookingSuccessModal
          isOpen={successModalOpen}
          onClose={() => router.push("/user/book/mybooking")}
          appointment={lastAppointment}
        />
      </div>
    </div>
  );
}
