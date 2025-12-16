"use client";
import { useState } from "react";
import { format } from "date-fns";

export function useAppointmentLogic() {
  const [step, setStep] = useState(1);
  const [healthCenters, setHealthCenters] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedPurpose, setSelectedPurpose] = useState("");
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [error, setError] = useState("");

  return {
    step, setStep,
    healthCenters, setHealthCenters,
    selectedCenter, setSelectedCenter,
    appointmentDate, setAppointmentDate,
    selectedTime, setSelectedTime,
    selectedPurpose, setSelectedPurpose,
    selectedPrice, setSelectedPrice,
    error, setError,
  };
}
