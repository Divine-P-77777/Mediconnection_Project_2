"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { format } from "date-fns";

import { useAppSelector } from "@/store/hooks";
import { load } from "@cashfreepayments/cashfree-js";
import { useToast } from "@/hooks/use-toast";

import { useAuth } from "@/hooks/useAuth";
import Stepper from "./components/Stepper";
import PersonalInfoStep from "./components/PersonalInfoStep";
import CenterSearchStep from "./components/CenterSearchStep";
import ScheduleStep from "./components/ScheduleStep";

/* -------------------- TYPES -------------------- */
interface CashfreeData {
  checkout: (options: any) => void;
}

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
  _id?: string;
  id?: string;
  name: string;
  address?: string;
  availability?: SlotAvailability[];
  purposes?: Purpose[];
}

interface User {
  _id?: string;
  id?: string;
  name?: string;
  phone?: string;
  email?: string;
}

// Match PersonalInfoStep's expected types exactly
interface BookingFormValues {
  fullName: string;
  phone: string;
  gender: "male" | "female" | "other" | "";
  dob: Date | null;
}

interface HandleBookingParams {
  date: Date;
  time: string;
  purpose: {
    service_name: string;
    price: number;
  };
}

export default function BookAppointmentPage() {
  const router = useRouter();
  const { user } = useAuth() as { user: User | null };
  const { errorToast, success: Success } = useToast();
  const isDarkMode = useAppSelector((s) => s.theme.isDarkMode);

  const [step, setStep] = useState<number>(1);
  const [selectedCenter, setSelectedCenter] = useState<Center | null>(null);
  const [cashfree, setCashfree] = useState<CashfreeData | null>(null);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    (async () => {
      const cf = await load({ mode: "sandbox" });
      setCashfree(cf as CashfreeData);
    })();
  }, []);

  const form = useForm<BookingFormValues>({
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

  const handleBooking = async ({ date, time, purpose }: HandleBookingParams) => {
    if (!user || !selectedCenter) return;
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
      dob: form.getValues("dob") ? format(new Date(form.getValues("dob")!), "yyyy-MM-dd") : null,
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
        setIsBooking(false);
        return;
      }

      const appointmentId = json.appointment_id;

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
          setIsBooking(false);
          return;
        }

        const checkoutOptions = {
          paymentSessionId: payData.payment_session_id,
          redirectTarget: "_self",
          onSuccess: async (paymentResponse: any) => {
            Success("Payment initiated successfully!");
            router.push("/user/book/mybooking");
          },
          onFailure: () => {
            errorToast("Payment failed");
            setIsBooking(false);
          },
        };

        if (cashfree) cashfree.checkout(checkoutOptions);

      } else {
        // 4. FREE APPOINTMENT
        Success("Appointment booked successfully!");
        router.push("/user/book/mybooking");
      }
    } catch (err: any) {
      console.error(err);
      errorToast("Something went wrong: " + err.message);
      setIsBooking(false);
    }
  };

  return (
    <div className={`flex flex-col w-full min-h-screen ${isDarkMode ? "bg-slate-900" : "bg-white"}`}>
      <div className={`max-w-3xl py-32 mx-auto p-4 min-h-screen ${isDarkMode ? "bg-slate-900" : "bg-white"}`}>

        {/* Header with Title and Blinking Button */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-cyan-500 mb-4 md:mb-0">
            Book Appointment
          </h1>
          <button
            onClick={() => router.push("/user/book/mybooking")}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full font-semibold shadow-lg hover:shadow-cyan-500/50 hover:scale-105"
          >
            My Bookings
          </button>
        </div>

        <Stepper step={step} />

        {step === 1 && (
          <PersonalInfoStep
            form={form}
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <CenterSearchStep
            onSelectCenter={(center) => setSelectedCenter(center as Center)}
            onNext={() => setStep(3)}
          />
        )}

        {step === 3 && selectedCenter && (
          <ScheduleStep
            center={selectedCenter}
            onConfirm={handleBooking}
            isBooking={isBooking}
          />
        )}

      </div>
    </div>
  );
}