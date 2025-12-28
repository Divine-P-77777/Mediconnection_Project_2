"use client";

import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import axios from "axios";
import { load, Cashfree } from "@cashfreepayments/cashfree-js";
import { useAuth } from "@/hooks/useAuth";
import { useAppSelector } from "@/store/hooks";
import BookingSuccessModal from "../book/components/BookingSuccessModal";

interface AvailabilityItem {
  day_of_week: string;
  slot_time: string[];
  actual_date?: string;
  display_label?: string;
}

interface Doctor {
  service_name: string;
  price: number;
  doctors?: {
    id: string;
    name: string;
    specialization?: string;
  };
  // Fallback for older interface if needed or just remove
  specialization?: string;
}

interface BookingForm {
  fullName: string;
  dob: string;
  phone: string;
  gender: "male" | "female" | "other";
}

interface BookingModalProps {
  doctor: Doctor;
  onClose: () => void;
}

interface AppointmentForSuccess {
  id?: string;
  appointment_id?: string;
  user_name: string;
  doctor_name?: string;
  center_name?: string;
  date: string;
  time: string;
  purpose: string;
  status: string;
  phone: string;
  price: number;
}

export default function BookingModal({
  doctor,
  onClose,
}: BookingModalProps) {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  const { user } = useAuth();

  const [availability, setAvailability] = useState<AvailabilityItem[]>([]);
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<string>("");

  const [form, setForm] = useState<BookingForm>({
    fullName: "",
    dob: "",
    phone: "",
    gender: "male",
  });

  const [cashfree, setCashfree] = useState<Cashfree | null>(null);
  const [orderId, setOrderId] = useState<string>("");
  const [successModalOpen, setSuccessModalOpen] =
    useState<boolean>(false);
  const [lastAppointment, setLastAppointment] =
    useState<AppointmentForSuccess | null>(null);

  useEffect(() => {
    async function initSDK() {
      const cf = await load({ mode: "production" });
      setCashfree(cf);
    }
    initSDK();
  }, []);

  function getNextDateForDay(dayName: string): Date {
    const daysMap: Record<string, number> = {
      sunday: 0,
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
      saturday: 6,
    };

    const today = new Date();
    const todayDay = today.getDay();
    const targetDay = daysMap[dayName.toLowerCase()];
    let daysUntil = targetDay - todayDay;
    if (daysUntil < 0) daysUntil += 7;

    const nextDate = new Date();
    nextDate.setDate(today.getDate() + daysUntil);
    return nextDate;
  }

  const fetchAvailability = async (): Promise<void> => {
    try {
      const res = await fetch(
        `/api/doctor/availability/${doctor.doctors?.id}`
      );
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      const processed: AvailabilityItem[] = data.availability.map(
        (day: AvailabilityItem) => {
          const dateObj = getNextDateForDay(day.day_of_week);
          return {
            ...day,
            actual_date: dateObj.toISOString().split("T")[0],
            display_label: `${day.day_of_week} (${dateObj.toDateString()})`,
          };
        }
      );

      processed.sort(
        (a, b) =>
          new Date(a.actual_date!).getTime() -
          new Date(b.actual_date!).getTime()
      );

      setAvailability(processed);
    } catch (err) {
      console.error("Error fetching availability:", err);
    }
  };

  useEffect(() => {
    if (doctor.doctors?.id) fetchAvailability();
  }, [doctor]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBooking = async (): Promise<void> => {
    const { fullName, dob, phone, gender } = form;
    const email = user?.email;
    const userId = user?.id;
    const doctorId = doctor.doctors?.id;

    if (
      !userId ||
      !doctorId ||
      !fullName ||
      !dob ||
      !phone ||
      !gender ||
      !email ||
      !selectedDay ||
      !selectedSlot
    ) {
      alert("All fields and slot selection are required");
      return;
    }

    const phoneNumber = Number(phone);
    if (Number.isNaN(phoneNumber)) {
      alert("Phone number must be valid");
      return;
    }

    try {
      if (doctor.price > 0) {
        const sessionRes = await axios.post(
          "/api/consultation/payment/order",
          {
            amount: doctor.price,
            customer_name: fullName,
            customer_email: email,
            customer_phone: phone,
          }
        );

        if (!sessionRes.data.payment_session_id) {
          throw new Error("Failed to create session");
        }

        setOrderId(sessionRes.data.order_id);

        if (!cashfree) {
          throw new Error("Payment SDK not loaded");
        }

        await cashfree.checkout({
          paymentSessionId: sessionRes.data.payment_session_id,
          redirectTarget: "_modal",
        });

        const verifyRes = await axios.post(
          "/api/consultation/payment/verify",
          {
            orderId: sessionRes.data.order_id,
            doctorId,
            amount: doctor.price,
            paymentMethod: "CASHFREE",
          }
        );

        if (verifyRes.data?.order_status === "PAID") {
          await createBooking({
            fullName,
            dob,
            phoneNumber,
            gender,
            email,
            userId,
            doctorId,
          });
        } else {
          alert("Payment not completed!");
        }
      } else {
        await createBooking({
          fullName,
          dob,
          phoneNumber,
          gender,
          email,
          userId,
          doctorId,
        });
      }
    } catch (err: any) {
      console.error(err);
      alert("Booking failed: " + err.message);
    }
  };

  async function createBooking(data: {
    fullName: string;
    dob: string;
    phoneNumber: number;
    gender: string;
    email: string;
    userId: string;
    doctorId: string;
  }): Promise<void> {
    const payload = {
      userId: data.userId,
      doctorId: data.doctorId,
      fullName: data.fullName,
      dob: data.dob,
      phone: data.phoneNumber,
      gender: data.gender,
      email: data.email,
      consultationDate: selectedDay,
      consultationTime: selectedSlot,
      speciality:
        doctor.doctors?.specialization ||
        doctor.specialization ||
        "General",
      orderId,
      amount: doctor.price,
    };

    const res = await fetch("/api/liveconsult", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    if (!result.success) throw new Error(result.error);

    const confirmedAppt: AppointmentForSuccess = {
      id: result.data?.id,
      appointment_id: result.data?.id,
      user_name: payload.fullName,
      doctor_name: doctor.doctors?.name,
      center_name: doctor.doctors?.name || "Online Consult",
      date: payload.consultationDate,
      time: payload.consultationTime,
      purpose: payload.speciality,
      status: "confirmed",
      phone: String(payload.phone),
      price: payload.amount,
    };

    setLastAppointment(confirmedAppt);
    setSuccessModalOpen(true);

    window.dispatchEvent(new Event("consult-booked"));
  }
  return (
    <Dialog open={true} onClose={() => !successModalOpen && onClose()} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center overflow-auto p-4">
        {/* Hide form if success modal is open? Or overlay? BookingSuccessModal has fixed overlay. */}
        {/* If we render BookingSuccessModal, it takes over screen properly. */}

        <div
          className={`rounded-2xl shadow-lg max-w-md w-full p-6 min-h-[80vh] overflow-y-auto space-y-6
            ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}
          style={{ display: successModalOpen ? 'none' : 'block' }} // Hide form when success modal is active
        >
          <Dialog.Title className="text-xl font-bold mb-4">
            Book Appointment with {doctor?.doctors?.name}
          </Dialog.Title>

          {/* Form */}
          <div className="space-y-4">
            {["fullName", "phone", "dob"].map((field) => (
              <div key={field}>
                <label className="block mb-1 font-medium">
                  {field === "fullName"
                    ? "Full Name"
                    : field === "dob"
                      ? "Date of Birth"
                      : field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type={field === "dob" ? "date" : "text"}
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  className={`w-full p-2 rounded-lg border
                    ${isDarkMode
                      ? "bg-gray-700 text-white"
                      : "bg-gray-50 text-black"
                    }`}
                />
              </div>
            ))}

            {/* Gender */}
            <div>
              <label className="block mb-1 font-medium">Gender</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className={`w-full p-2 rounded-lg border
                  ${isDarkMode
                    ? "bg-gray-700 text-white"
                    : "bg-gray-50 text-black"
                  }`}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Day */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Select Day
              </label>
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                className={`w-full p-2 rounded
                  ${isDarkMode
                    ? "bg-gray-700 text-white"
                    : "bg-gray-50 text-black"
                  }`}
              >
                <option value="">-- Select a day --</option>
                {availability.map((d) => (
                  <option key={d.actual_date} value={d.actual_date}>
                    {d.display_label}
                  </option>
                ))}
              </select>
            </div>

            {/* Slot */}
            {selectedDay && (
              <div className="mt-3">
                <label className="block text-sm font-medium mb-1">
                  Select Slot
                </label>
                <select
                  value={selectedSlot}
                  onChange={(e) => setSelectedSlot(e.target.value)}
                  className={`w-full p-2 rounded
                    ${isDarkMode
                      ? "bg-gray-700 text-white"
                      : "bg-gray-50 text-black"
                    }`}
                >
                  <option value="">-- Select a slot --</option>
                  {availability
                    .find((d) => d.actual_date === selectedDay)
                    ?.slot_time?.map((slot, i) => (
                      <option key={i} value={slot}>
                        {slot}
                      </option>
                    ))}
                </select>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="space-y-2">
            <button
              onClick={handleBooking}
              disabled={!selectedDay || !selectedSlot}
              className={`w-full px-4 py-2 rounded-lg font-medium transition-colors duration-200
                disabled:bg-gray-400
                ${isDarkMode
                  ? "bg-cyan-600 hover:bg-cyan-700 text-white"
                  : "bg-cyan-500 hover:bg-cyan-600 text-white"
                }`}
            >
              {doctor.price > 0
                ? `Pay & Book (₹${doctor.price})`
                : "Book"}
            </button>

            <button
              onClick={onClose}
              className={`w-full px-4 py-2 rounded-lg transition-colors duration-200
                ${isDarkMode
                  ? "bg-gray-700 text-white hover:bg-gray-600"
                  : "bg-gray-200 text-black hover:bg-gray-300"
                }`}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <BookingSuccessModal
        isOpen={successModalOpen}
        onClose={onClose}
        appointment={lastAppointment}
      />
    </Dialog>
  );
}


