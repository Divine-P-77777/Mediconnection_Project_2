import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { format, addDays, eachDayOfInterval, isSameDay } from "date-fns";
import { motion } from "framer-motion";
import { healthCentersData } from "@/app/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import supabase from "@/utils/supabaseClient";

// Styled component for dark mode classes
const cn = (classes, isDark) => {
    if (!Array.isArray(classes)) return typeof classes === 'function' ? classes(isDark) : classes;
    return classes.map(c => (typeof c === 'function' ? c(isDark) : c)).join(' ');
};


const Calendar = ({ selectedCenter, selectedDate, handleDateSelect, isDarkMode }) => {
    const today = new Date();
    const daysInRange = eachDayOfInterval({ start: today, end: addDays(today, 4) });
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
        <Card className={cn([isDark => `px-0 py-3 sm:p-6 rounded-xl shadow-lg ${isDark ? "bg-gray-800 text-white" : "bg-white text-black"}`], isDarkMode)}>
            <CardHeader>
                <CardTitle className="mx-auto">Select Date</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-7 sm:gap-2 mb-2 font-semibold text-center">
                    {weekDays.map(day => <div key={day}>{day}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-2 sm:gap-2">
                    {daysInRange.map((day, index) => {
                        const slotStatus = selectedCenter?.SlotStatus?.[index] || "not_available";

                        const isSelected = selectedDate && isSameDay(day, selectedDate);
                        const bgColor = {
                            available: "bg-green-500",
                            not_available: "bg-red-500",
                            off: "bg-yellow-500"
                        }[slotStatus] || "bg-gray-400";

                        return (
                            <motion.div
                                key={day}
                                whileHover={{ scale: slotStatus === "available" ? 1.05 : 1 }}
                                className={cn([
                                    `p-2 text-center transition-all rounded-full sm:rounded-lg md:rounded-md lg:rounded-none`,
                                    isSelected ? "ring-2 ring-white bg-cyan-300 text-black" : `${bgColor} text-white`,
                                    slotStatus === "available" ? "cursor-pointer" : "cursor-not-allowed"
                                ])}
                                onClick={() => slotStatus === "available" && handleDateSelect(day)}
                            >
                                {format(day, "d")}
                            </motion.div>
                        );
                    })}
                </div>
                <div className="mt-10 flex-col flex sm:flex-row justify-center sm:items-center mx-auto gap-3">
                    {["green-400 Available", "red-400 Not Available", "yellow-400 Off Day"].map((item) => (
                        <div key={item} className="flex items-center">
                            <span className={`bg-${item.split(' ')[0]} rounded-full w-4 h-4`} />
                            <span className="ml-2">{item.split(' ').slice(1).join(' ')}</span>
                        </div>
                    ))}

                </div>
            </CardContent>
        </Card>
    );
};

const BookAppointment = () => {
    const isDarkMode = useSelector(state => state.theme.isDarkMode);
    const centers = useMemo(() => healthCentersData, []);
    const [selectedCenter, setSelectedCenter] = useState(centers[0] || null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState("");
    const [selectedPurpose, setSelectedPurpose] = useState("");
    const [personalInfo, setPersonalInfo] = useState({
        fullName: "",
        phone: "",
        gender: ""
    });

    useEffect(() => {
        const maxDate = new Date();
        maxDate.setFullYear(maxDate.getFullYear() - 1);
        setSelectedDate(maxDate);
    }, []);

    const handleInputChange = (e) => {
        setPersonalInfo(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const bookAppointment = async () => {
        if (!selectedCenter || !selectedDate || !selectedTime || !selectedPurpose || !personalInfo.fullName || !personalInfo.phone || !personalInfo.gender) {
            alert("All fields are required.");
            return;
        }
    
        const newAppointment = {
            center_id: selectedCenter.id,
            center_name: selectedCenter.center,
            date: format(selectedDate, "yyyy-MM-dd"),
            time: selectedTime,
            purpose: selectedPurpose,
            user_name: personalInfo.fullName,
            phone: personalInfo.phone,
            gender: personalInfo.gender.toLowerCase(),
        };
    
        const { data, error } = await supabase
            .from("appointment") // ✅ Correct table name
            .insert([newAppointment])
            .select()
            .single();
    
        if (error) {
            console.error("Error booking appointment:", error.message);
            alert("Booking failed. Please try again.");
        } else {
            alert("Appointment booked successfully!");
            console.log("New Appointment:", data);
            setSelectedCenter({ id: "", center: "" });  // Instead of null, set an empty object
            setSelectedDate("");  
            setSelectedTime("");  
            setSelectedPurpose("");  
            setPersonalInfo({
                fullName: "",
                phone: "",
                gender: ""
            });
            
        }
    };
    
    useEffect(() => {
        console.log("BookAppointment component mounted");
        return () => console.log("BookAppointment component unmounted");
    }, []);
    
    



    if (!selectedCenter) return <div className="text-center text-red-500">No Health Centers Available</div>;

    return (
        <div className={cn([isDark => `min-h-screen mt-10 p-6 transition-all duration-300 ${isDark ? "bg-[#0A192F] text-white" : "bg-white text-black"}`], isDarkMode)}>
            <h1 className="text-4xl font-bold text-center my-6">Book Your Appointment</h1>

            <div className="max-w-4xl mx-auto space-y-8">
                {/* Health Center Selection */}
                <Card className="p-6 shadow-lg">
                    <CardHeader><CardTitle>Select Health Center</CardTitle></CardHeader>
                    <CardContent>
                        <select
                            className={cn([isDark => `w-full p-3 rounded-lg border ${isDark ? "bg-[#0A192F] text-white" : "bg-white text-black"}`], isDarkMode)}
                            value={selectedCenter?.id || ""} // Ensure it doesn’t break on empty values
                            onChange={e => {
                                const selectedId = e.target.value; // Get UUID as string
                                const center = centers.find(c => c.id === selectedId); // Compare as string
                                setSelectedCenter(center || null);
                            }}
                        >
                            <option value="" disabled>Select a Health Center</option> {/* Prevents accidental empty selection */}
                            {centers.map(center => (
                                <option key={center.id} value={center.id}>{center.center}</option>
                            ))}
                        </select>
                    </CardContent>

                </Card>

                <Calendar {...{ selectedCenter, selectedDate, handleDateSelect: setSelectedDate, isDarkMode }} />

                {/* Time Slots */}
                <Card className={cn(`p-6 shadow-lg ${isDarkMode ? "bg-gray-800" : "bg-white"}`)}>
                    <CardHeader>
                        <CardTitle>Select Time Slot</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {selectedCenter?.timeSlots?.map(time => (
                            <Button
                                key={time}
                                onClick={() => setSelectedTime(time)}
                                className={cn(
                                    `p-3 rounded-lg text-sm font-medium transition-all ${selectedTime === time
                                        ? "bg-[#00A8E8] text-white"
                                        : isDarkMode
                                            ? "bg-black/25 border border-cyan-400"
                                            : "bg-white border border-black"
                                    }`
                                )}
                            >
                                {time}
                            </Button>
                        ))}
                    </CardContent>
                </Card>


                {/* Purpose Selection */}
                <Card className={cn(`p-6 shadow-lg ${isDarkMode ? "bg-gray-800" : "bg-white"}`)}>
                    <CardHeader>
                        <CardTitle>Purpose of Visit</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {selectedCenter?.purposes?.map(purpose => (
                            <Button
                                key={purpose}
                                onClick={() => setSelectedPurpose(purpose)}
                                className={cn(
                                    `p-3 rounded-lg text-sm font-medium transition-all ${selectedPurpose === purpose
                                        ? "bg-[#00A8E8] text-white"
                                        : isDarkMode
                                            ? "bg-black/25 border border-cyan-400"
                                            : "bg-white border border-black"
                                    }`
                                )}
                            >
                                {purpose}
                            </Button>
                        ))}
                    </CardContent>
                </Card>


                {/* Personal Information */}
                <Card className="p-6 shadow-lg">
                    <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <input
                                    name="fullName"
                                    placeholder="Full Name"
                                    value={personalInfo.fullName}
                                    onChange={handleInputChange}
                                    className={cn([isDark => `p-3 w-full rounded-lg border ${isDark ? "bg-black/25 border-cyan-400" : "bg-white border-black"}`], isDarkMode)}
                                />

                                <div className="w-full h-[42px]">
                                    <DatePicker
                                        value={selectedDate}
                                        onChange={setSelectedDate}
                                        maxDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
                                        format="dd-MM-y"
                                        className={cn([isDark => `w-full h-full ${isDark ? "text-white" : "text-black"}`], isDarkMode)}
                                        calendarClassName={cn([isDark => `shadow-lg rounded-lg ${isDark ? "bg-[#0A192F] border-cyan-500" : "bg-white border-gray-300"}`], isDarkMode)}
                                    />
                                </div>

                                <input
                                    name="phone"
                                    placeholder="Phone Number"
                                    value={personalInfo.phone}
                                    onChange={handleInputChange}
                                    className={cn([isDark => `p-3 w-full rounded-lg border ${isDark ? "bg-black/25 border-cyan-400" : "bg-white border-black"}`], isDarkMode)}
                                />

                                <select
                                    name="gender"
                                    value={personalInfo.gender}
                                    onChange={handleInputChange}
                                    className={cn([isDark => `p-3 w-full rounded-lg border ${isDark ? "bg-black/25 border-cyan-400" : "bg-white border-black"}`], isDarkMode)}
                                >
                                    <option value="">Select Gender</option>
                                    {["Male", "Female", "Other"].map(opt => (
                                        <option key={opt} value={opt.toLowerCase()}>{opt}</option>
                                    ))}
                                </select>
                            </div>
                            <Button
                                onClick={bookAppointment}
                                className="w-full bg-[#00A8E8] text-white py-3 rounded-lg hover:bg-[#0077B6] transition-colors"
                            >
                                Confirm Booking
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div >
    );
};

export default BookAppointment;