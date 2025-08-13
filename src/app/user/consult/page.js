"use client";

import { useState } from "react";
import { format, addDays } from "date-fns";
import supabase from "@/supabase/client"
; 
import { useSelector } from "react-redux";
import SeamlessCalendar from "@/components/ui/SeamlessCalendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BooKLiveConsult() {
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    phone: "",
    email: "",
    gender: "male",
    consultationDate: "",
    consultationTime: "",
    speciality: "General Medicine",
  });

  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle DOB change from SeamlessCalendar
  const handleDOBChange = (date) => {
    setFormData({ ...formData, dob: format(date, "yyyy-MM-dd") });
  };

  // Handle Consultation Date change with restrictions
  const handleConsultationDateChange = (date) => {
    setFormData({ ...formData, consultationDate: format(date, "yyyy-MM-dd") });
  };

  const bookLiveConsult = async () => {
    const { fullName, dob, phone, gender, consultationDate, consultationTime, speciality } = formData;

    if (!fullName || !dob || !phone || !email || !gender || !consultationDate || !consultationTime || !speciality) {
      alert("All fields are required.");
      return;
    }

    const newConsultation = {
      full_name: fullName,
      dob: format(new Date(dob), "yyyy-MM-dd"),
      phone,
      email,
      gender: gender.toLowerCase(),
      consultation_date: format(new Date(consultationDate), "yyyy-MM-dd"),
      consultation_time: consultationTime,
      speciality,
      created_at: new Date(),
    };

    const { data, error } = await supabase.from("liveconsult").insert([newConsultation]).select().single();

    if (error) {
      console.error("Error booking consultation:", error.message);
      alert("Booking failed. Please try again.");
    } else {
      alert("Live Consultation booked successfully!");
      console.log("New Consultation:", data);
      setFormData({
        fullName: "",
        dob: "",
        phone: "",
        email: "",
        gender: "male",
        consultationDate: "",
        consultationTime: "",
        speciality: "General Medicine",
      });
    }
  };

  const inputClasses = `w-full p-3 rounded-lg border transition-all duration-300 focus:ring-2 focus:ring-blue-500 ${
    isDarkMode 
      ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400" 
      : "bg-white border-gray-300 text-black placeholder-gray-500"
  }`;

  const labelClasses = `block text-lg mb-2 ${
    isDarkMode ? "text-gray-200" : "text-gray-700"
  }`;

  // ... previous imports and state management code remains same ...

return (
  <div className={`py-2 min-h-screen w-full pt-24 px-4 transition-all duration-300 
    ${isDarkMode ? "bg-[#0A192F] text-white" : "bg-gray-50 text-gray-900"}`}>
    <Card className={`max-w-6xl px-3 py-3 mx-auto shadow-xl ${
      isDarkMode ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"
    }`}>
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold">Live Consultation Booking</CardTitle>
      </CardHeader>
      <CardContent>
        {/* PC: Side by side, Mobile: Stacked */}
        <div className="flex flex-col md:flex-row md:gap-6">
          {/* Left Side - Personal Information */}
          <div className="flex-1 space-y-6">
            <div className="space-y-4">
              <h2 className={`text-xl font-semibold ${isDarkMode ? "text-cyan-400" : "text-blue-600"}`}>
                Personal Information
              </h2>
              
              {/* Full Name */}
              <div className="form-group">
                <label htmlFor="fullName" className={labelClasses}>Full Name</label>
                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>

              {/* Date of Birth */}
              <div className="form-group">
                <label className={labelClasses}>Date of Birth</label>
                <div className="relative">
                  <SeamlessCalendar 
                    onDateChange={handleDOBChange}
                    maxDate={new Date()}
                  />
                </div>
              </div>

               {/* Date of Birth */}
              <div className="form-group">
                <label className={labelClasses}>Email</label>
                <input
                  id="email"
                  type="text"
                  name="email"
                  placeholder="abc@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>

              {/* Phone Number */}
              <div className="form-group">
                <label htmlFor="phone" className={labelClasses}>Phone Number</label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  placeholder="+91 1234567890"
                  value={formData.phone}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>

              {/* Gender */}
              <div className="form-group">
                <label htmlFor="gender" className={labelClasses}>Gender</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={inputClasses}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Divider for mobile view */}
          <div className="my-6 md:hidden border-t border-gray-200 dark:border-gray-700"></div>

          {/* Vertical divider for PC view */}
          <div className="hidden md:block w-px bg-gray-200 dark:bg-gray-700"></div>

          {/* Right Side - Consultation Details */}
          <div className="flex-1 space-y-6">
            <div className="space-y-4">
              <h2 className={`text-xl font-semibold ${isDarkMode ? "text-cyan-400" : "text-blue-600"}`}>
                Consultation Details
              </h2>

              {/* Consultation Date */}
              <div className="form-group">
                <label className={labelClasses}>Consultation Date</label>
                <div className="relative">
                  <SeamlessCalendar 
                    onDateChange={handleConsultationDateChange}
                    minDate={new Date()}
                    maxDate={addDays(new Date(), 7)}
                  />
                </div>
              </div>

              {/* Consultation Time */}
              <div className="form-group">
                <label htmlFor="consultationTime" className={labelClasses}>
                  Preferred Time (click on the clock icon)
                </label>
                <input
                  id="consultationTime"
                  type="time"
                  name="consultationTime"
                  value={formData.consultationTime}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>

              {/* Speciality */}
              <div className="form-group">
                <label htmlFor="speciality" className={labelClasses}>Speciality</label>
                <select
                  id="speciality"
                  name="speciality"
                  value={formData.speciality}
                  onChange={handleChange}
                  className={inputClasses}
                >
                  <option value="General Medicine">General Medicine</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Dermatology">Dermatology</option>
                  <option value="Orthopedics">Orthopedics</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button - Full width at bottom */}
        <div className="mt-8">
          <button
            type="button"
            onClick={bookLiveConsult}
            className={`w-full py-4 rounded-lg text-white font-semibold transition-all duration-300 
              ${isDarkMode 
                ? "bg-cyan-600 hover:bg-cyan-700" 
                : "bg-blue-600 hover:bg-blue-700"
              } hover:shadow-lg transform hover:scale-[1.02]`}
          >
            Book Consultation
          </button>
        </div>
      </CardContent>
    </Card>
  </div>
);
}