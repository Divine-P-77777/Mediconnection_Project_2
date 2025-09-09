// "use client";

// import { useEffect, useState } from "react";
// import { supabase } from "@/supabase/client";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent } from "@/components/ui/card";
// import Select from "@/components/ui/select"; 
// import { useToast } from "@/hooks/use-toast";

// const DAYS = [
//   "Monday",
//   "Tuesday",
//   "Wednesday",
//   "Thursday",
//   "Friday",
//   "Saturday",
//   "Sunday",
// ];
// const STATUS = ["available", "unavailable"];

// export default function ManageHealthCenter() {
//   const [services, setServices] = useState([]);
//   const [availability, setAvailability] = useState([]);
//   const [newService, setNewService] = useState("");
//   const [newSlot, setNewSlot] = useState("");
//   const [selectedDay, setSelectedDay] = useState("Monday");
//   const [status, setStatus] = useState("available");
//   const [centerId, setCenterId] = useState(null);

//   const { Success, errorToast } = useToast();

//   // Load center & data
//   useEffect(() => {
//     const loadCenter = async () => {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();

//       if (!user) return errorToast("Not logged in");

//       // fetch health_center_id for this user
//       const { data, error } = await supabase
//         .from("health_centers")
//         .select("id")
//         .eq("id", user.id)
//         .single();

//       if (error) return errorToast(error.message);
//       setCenterId(data.id);

//       // fetch linked services and availability
//       fetchServices(data.id);
//       fetchAvailability(data.id);
//     };

//     loadCenter();
//   }, []);

//   const fetchServices = async (hcId) => {
//     const { data, error } = await supabase
//       .from("health_center_services")
//       .select("*")
//       .eq("health_center_id", hcId);

//     if (error) errorToast(error.message);
//     else setServices(data);
//   };

//   const fetchAvailability = async (hcId) => {
//     const { data, error } = await supabase
//       .from("health_center_availability")
//       .select("*")
//       .eq("health_center_id", hcId);

//     if (error) errorToast(error.message);
//     else setAvailability(data);
//   };

//   // Add Service
//   const addService = async () => {
//     if (!newService.trim() || !centerId) return;

//     const { error } = await supabase
//       .from("health_center_services")
//       .insert([{ service_name: newService, health_center_id: centerId }]);

//     if (error) return errorToast(error.message);

//     Success("Service added");
//     setNewService("");
//     fetchServices(centerId);
//   };

//   // Add Availability Slot
//   const addAvailability = async () => {
//     if (!newSlot.trim() || !centerId) return;

//     const { error } = await supabase.from("health_center_availability").insert([
//       {
//         health_center_id: centerId,
//         day_of_week: selectedDay,
//         status,
//         slot_time: [newSlot],
//       },
//     ]);

//     if (error) return errorToast(error.message);

//     Success("Slot added");
//     setNewSlot("");
//     fetchAvailability(centerId);
//   };

//   return (
//     <div className="p-6 space-y-6">
//       <h1 className="text-2xl font-bold text-cyan-700">
//         Manage Health Center
//       </h1>

//       {/* Manage Services */}
//       <Card className="border-cyan-200 shadow-md">
//         <CardContent className="p-4 space-y-4">
//           <h2 className="text-xl font-semibold text-cyan-600">Services</h2>
//           <div className="flex gap-2">
//             <Input
//               placeholder="Enter service name"
//               value={newService}
//               onChange={(e) => setNewService(e.target.value)}
//               className="focus:ring-cyan-400 focus:border-cyan-500"
//             />
//             <Button
//               onClick={addService}
//               className="bg-cyan-600 hover:bg-cyan-700"
//             >
//               Add
//             </Button>
//           </div>
//           <ul className="list-disc list-inside text-gray-700">
//             {services.map((s) => (
//               <li key={s.id}>{s.service_name}</li>
//             ))}
//           </ul>
//         </CardContent>
//       </Card>

//       {/* Manage Availability */}
//       <Card className="border-cyan-200 shadow-md">
//         <CardContent className="p-4 space-y-4">
//           <h2 className="text-xl font-semibold text-cyan-600">Availability</h2>
//           <div className="flex gap-2">
//             {/* Day Select */}
//             <Select
//               value={selectedDay}
//               onChange={setSelectedDay}
//               options={DAYS}
//               label="Day"
//             />

//             {/* Status Select */}
//             <Select
//               value={status}
//               onChange={setStatus}
//               options={STATUS}
//               label="Status"
//             />

//             {/* Time Slot Input */}
//             <Input
//               placeholder="09:00-12:00"
//               value={newSlot}
//               onChange={(e) => setNewSlot(e.target.value)}
//               className="focus:ring-cyan-400 focus:border-cyan-500"
//             />
//             <Button
//               onClick={addAvailability}
//               className="bg-cyan-600 hover:bg-cyan-700"
//             >
//               Add
//             </Button>
//           </div>

//           <div>
//             {availability.map((a) => (
//               <div
//                 key={a.id}
//                 className="border border-cyan-200 p-2 rounded mb-2 bg-cyan-50"
//               >
//                 <strong className="text-cyan-700">{a.day_of_week}</strong> —{" "}
//                 {a.status}
//                 <div className="text-sm text-gray-600">
//                   Slots: {a.slot_time.join(", ")}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }


"use client"
import React from 'react'
import ManageTime from './ManageTime'
import ServiceManage from './ServiceManage'
const ManageCenterPage = () => {
  return (
    <div>
      <ManageTime />
      <ServiceManage />
    </div>
  )
}

export default ManageCenterPage
