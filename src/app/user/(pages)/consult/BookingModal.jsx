"use client";
import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { useAuth } from "@/hooks/useAuth";
import axios from "axios";
import { load } from "@cashfreepayments/cashfree-js";
import { useSelector } from "react-redux";

export default function BookingModal({ doctor, onClose }) {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  const [availability, setAvailability] = useState([]);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    dob: "",
    phone: "",
    gender: "male",
  });

  const { user } = useAuth();
  const [cashfree, setCashfree] = useState(null);
  const [orderId, setOrderId] = useState("");

  // Load Cashfree SDK
  useEffect(() => {
    async function initSDK() {
      const cf = await load({ mode: "production" }); // switch to "production" later
      setCashfree(cf);
    }
    initSDK();
  }, []);

  // Helper: get next date for weekday
  function getNextDateForDay(dayName) {
    const daysMap = {
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

  // Fetch availability
  const fetchAvailability = async () => {
    try {
      const res = await fetch(`/api/doctor/availability/${doctor.doctor_id}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      const processed = data.availability.map((day) => {
        const dateObj = getNextDateForDay(day.day_of_week);
        return {
          ...day,
          actual_date: dateObj.toISOString().split("T")[0],
          display_label: `${day.day_of_week} (${dateObj.toDateString()})`,
        };
      });

      processed.sort(
        (a, b) => new Date(a.actual_date) - new Date(b.actual_date)
      );
      setAvailability(processed);
    } catch (err) {
      console.error("Error fetching availability:", err);
    }
  };

  useEffect(() => {
    if (doctor?.doctor_id) fetchAvailability();
  }, [doctor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // --- Payment + Booking Flow ---
  const handleBooking = async () => {
    const { fullName, dob, phone, gender } = form;
    const email = user?.email;
    const userId = user?.id;
    const doctorId = doctor?.doctor_id;

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
      return alert("All fields and slot selection are required");
    }

    const phoneNumber = Number(phone);
    if (isNaN(phoneNumber)) return alert("Phone number must be valid");

    try {
      // 1️ If doctor has price → initiate payment
      if (doctor.price > 0) {
        const sessionRes = await axios.post("/api/consultation/payment/order", {
          amount: doctor.price,
          customer_name: fullName,
          customer_email: email,
          customer_phone: phone,
        });

        if (!sessionRes.data.payment_session_id)
          throw new Error("Failed to create session");

        setOrderId(sessionRes.data.order_id);

        if (!cashfree) throw new Error("Payment SDK not loaded");

        const checkoutOptions = {
          paymentSessionId: sessionRes.data.payment_session_id,
          redirectTarget: "_modal", // stay inside modal
        };

        cashfree.checkout(checkoutOptions).then(async (result) => {
          if (result.error) {
            alert("Payment failed ❌");
            return;
          }

          // ✅ Verify payment
          const verifyRes = await axios.post("/api/consultation/payment/verify", {
            orderId: sessionRes.data.order_id,
            liveconsultId: doctor.id,   // use the consultation row id (not doctor_id!)
            amount: doctor.price,
            paymentMethod: "CASHFREE",
          });


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
        });
      } else {
        // Free consultation
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
    } catch (err) {
      console.error(err);
      alert("Booking failed: " + err.message);
    }
  };

  async function createBooking(data) {
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
        doctor.service_name || doctor.specialization || "General",
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

    alert("Booking confirmed ✅");
    window.location.href = "/user/consult/booking";
    onClose();
  }

  return (
    <Dialog open={true} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center overflow-auto p-4">
        <div
          className={`rounded-2xl shadow-lg max-w-md w-full p-6 min-h-[80vh] overflow-y-auto space-y-6
            ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}
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
    </Dialog>
  );
}
