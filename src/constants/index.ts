export const healthCentersData = [
  {
    id: "a1b2c3d4-e5f6-7890-ab12-cd34ef567890",
    center: "City Health Clinic",
    pincode: "781034",
    SlotStatus: ["available", "available", "off", "available", "available"],
    availableDates: ["2025-03-09", "2025-03-10", "2025-03-11", "2025-03-12", "2025-03-13"],
    timeSlots: ["09:00 AM", "10:00 AM", "02:00 PM", "03:30 PM"],
    purposes: ["Consultation", "Vaccination", "Checkup", "Lab Test"],
  },
  {
    id: "b2c3d4e5-f678-9012-ab34-cd56ef789012",
    center: "Downtown Medical Center",
    pincode: "781038",
    SlotStatus: ["not_available", "available", "off", "available", "not_available"],
    availableDates: ["2025-03-09", "2025-03-10", "2025-03-11", "2025-03-12", "2025-03-13"],
    timeSlots: ["08:00 AM", "11:00 AM", "01:00 PM", "04:00 PM"],
    purposes: ["Dental", "Pediatrics", "Cardiology", "ENT"],
  },
  {
    id: "c3d4e5f6-a789-0123-bc45-de67f8901234",
    center: "Jyotikuchi Wellness Center",
    pincode: "781034",
    SlotStatus: ["available", "off", "available", "off", "available"],
    availableDates: ["2025-03-09", "2025-03-10", "2025-03-11", "2025-03-12", "2025-03-13"],
    timeSlots: ["10:00 AM", "12:00 PM", "03:00 PM"],
    purposes: ["General Checkup", "Physiotherapy", "Vaccination"],
  },
  {
    id: "d4e5f6a7-b890-1234-cd56-ef7890123456",
    center: "Lakhtokia Diagnostic Lab",
    pincode: "781001",
    SlotStatus: ["available", "available", "available", "available", "available"],
    availableDates: ["2025-03-09", "2025-03-10", "2025-03-11", "2025-03-12", "2025-03-13"],
    timeSlots: ["07:30 AM", "09:00 AM", "10:30 AM", "01:00 PM"],
    purposes: ["Blood Test", "X-Ray", "MRI", "Ultrasound"],
  },
  {
    id: "e5f6a7b8-c901-2345-de67-f89012345678",
    center: "Bamunimaidan Care Hub",
    pincode: "781021",
    SlotStatus: ["off", "available", "available", "available", "off"],
    availableDates: ["2025-03-09", "2025-03-10", "2025-03-11", "2025-03-12", "2025-03-13"],
    timeSlots: ["08:30 AM", "10:00 AM", "11:30 AM"],
    purposes: ["Vaccination", "Consultation", "Pediatrics"],
  },
  {
    id: "f6a7b8c9-d012-3456-ef78-901234567890",
    center: "Dispur Health Point",
    pincode: "781006",
    SlotStatus: ["not_available", "available", "available", "not_available", "available"],
    availableDates: ["2025-03-09", "2025-03-10", "2025-03-11", "2025-03-12", "2025-03-13"],
    timeSlots: ["09:00 AM", "12:00 PM", "03:00 PM"],
    purposes: ["ENT", "Eye Checkup", "Orthopedic"],
  },
];






export const sampleData = {
  prescriptions: [
    { id: 1, name: "Dynamic Phillic",phone: "9876543210", doctor: "Dr. Mahi", center: "City Health Clinic", date: "2025-03-20" },
    { id: 2, name: "Mohan Kumar",phone: "9876543640", doctor: "Dr. Clark", center: "Metro Clinic", date: "2025-03-18" }
  ],
  bills: [
    { id: 3, name: "Aman Sharma",phone: "9876543610", doctor: "Dr. Arman", center: "City Hospital", date: "2025-03-19" }
  ],
  reports: [
    { id: 4, name: "Rohit Kumar",phone: "9876543410", doctor: "Dr. Harish", center: "Metro Clinic", date: "2025-03-17" }
  ]
};