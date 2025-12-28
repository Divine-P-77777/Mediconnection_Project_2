"use client";

import { useState } from "react";

// You can expand this later based on API response
export interface HealthCenter {
  id: string;
  name: string;
  address?: string;
  price?: number;
}

export function useAppointmentLogic() {
  const [step, setStep] = useState<number>(1);

  const [healthCenters, setHealthCenters] = useState<HealthCenter[]>([]);
  const [selectedCenter, setSelectedCenter] = useState<HealthCenter | null>(null);

  const [appointmentDate, setAppointmentDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");

  const [selectedPurpose, setSelectedPurpose] = useState<string>("");
  const [selectedPrice, setSelectedPrice] = useState<number>(0);

  const [error, setError] = useState<string>("");

  return {
    step,
    setStep,
    healthCenters,
    setHealthCenters,
    selectedCenter,
    setSelectedCenter,
    appointmentDate,
    setAppointmentDate,
    selectedTime,
    setSelectedTime,
    selectedPurpose,
    setSelectedPurpose,
    selectedPrice,
    setSelectedPrice,
    error,
    setError,
  };
}
