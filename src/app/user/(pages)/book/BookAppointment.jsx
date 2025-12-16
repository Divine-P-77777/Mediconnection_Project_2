"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

import { useAuth } from "@/hooks/useAuth";
import Stepper from "./components/Stepper";
import PersonalInfoStep from "./components/PersonalInfoStep";
import CenterSearchStep from "./components/CenterSearchStep";
import ScheduleStep from "./components/ScheduleStep";

export default function BookAppointmentPage() {
  const router = useRouter();
  const { user } = useAuth();
  const isDarkMode = useSelector((s) => s.theme.isDarkMode);

  const [step, setStep] = useState(1);
  const [selectedCenter, setSelectedCenter] = useState(null);

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
          />
        )}
      </div>
    </div>
  );
}
