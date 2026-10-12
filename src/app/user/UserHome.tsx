"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/supabase/client";
import {
  CalendarCheck,
  Video,
  FileDown,
  Hospital,
  Stethoscope,
  ShieldCheck,
  ArrowRight,
  Search,
  MapPin,
  Clock,
  Sparkles,
  HeartPulse,
  Bot,
  PhoneCall,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Users,
  Building2,
  Lock,
  Flame,
  AlertCircle,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselItem } from "@/components/ui/carousel";

/* -------------------- TYPES -------------------- */
interface HealthCenterRecord {
  id: string;
  name: string;
  address: string;
  phone?: string;
  pincode: string | number;
  approved?: boolean;
  image_url?: string;
}

interface DoctorRecord {
  id: string;
  name: string;
  specialization: string;
  experience?: string | number;
  phone?: string;
  image_url?: string;
}

interface UserAppointment {
  id: string;
  center_name: string;
  date: string;
  time: string;
  purpose: string;
  status?: string;
  user_name?: string;
}

/* -------------------- FALLBACK CURATED DATA -------------------- */
const defaultHealthCenters: HealthCenterRecord[] = [
  {
    id: "hc-1",
    name: "Apollo Care Clinic",
    address: "Metro Sector 14, Central Block",
    pincode: "110001",
    phone: "+91 98765 43210",
    image_url: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "hc-2",
    name: "Max Super Specialty OPD",
    address: "Green Park Avenue, South Wing",
    pincode: "110016",
    phone: "+91 98111 22334",
    image_url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "hc-3",
    name: "Fortis Community Wellness Center",
    address: "Oakridge Complex, Sector 45",
    pincode: "122003",
    phone: "+91 99223 34455",
    image_url: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80",
  },
];

const defaultDoctors: DoctorRecord[] = [
  {
    id: "doc-1",
    name: "Dr. Ananya Sengupta",
    specialization: "Senior Cardiologist",
    experience: "12+ Yrs",
    image_url: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "doc-2",
    name: "Dr. Vikram Malhotra",
    specialization: "Orthopedic Surgeon",
    experience: "15+ Yrs",
    image_url: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "doc-3",
    name: "Dr. Priya Deshmukh",
    specialization: "General Physician & Diabetologist",
    experience: "9+ Yrs",
    image_url: "https://images.unsplash.com/photo-1594824813583-b54131df33eb?auto=format&fit=crop&w=600&q=80",
  },
];

const specialtiesList = [
  "All Specialties",
  "General Medicine",
  "Cardiology",
  "Pediatrics",
  "Orthopedics",
  "Dermatology",
  "Gynecology",
  "ENT Specialist",
  "Dental Care",
];

export default function UserHome() {
  const router = useRouter();
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  const { user } = useAuth();

  // Search state
  const [searchPincode, setSearchPincode] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties");
  const [activePortalTab, setActivePortalTab] = useState<"patients" | "doctors" | "healthcenters">("patients");

  // Dynamic data states
  const [liveHealthCenters, setLiveHealthCenters] = useState<HealthCenterRecord[]>([]);
  const [liveDoctors, setLiveDoctors] = useState<DoctorRecord[]>([]);
  const [userAppointments, setUserAppointments] = useState<UserAppointment[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);

  // Theme-aware styles
  const pageBg = isDarkMode ? "bg-[#071226] text-white" : "bg-slate-50 text-slate-900";
  const cardBg = isDarkMode
    ? "bg-[#0B1E38]/80 border-slate-800/80 backdrop-blur-xl"
    : "bg-white/90 border-slate-200/90 backdrop-blur-xl shadow-sm";
  const innerCardBg = isDarkMode ? "bg-[#102A4E]/60 border-slate-700/50" : "bg-slate-50 border-slate-200";

  // Fetch live health centers & doctors
  useEffect(() => {
    async function fetchPublicProviders() {
      try {
        // Fetch approved health centers
        const { data: hcData } = await supabase
          .from("health_centers")
          .select("id, name, address, phone, pincode, image_url")
          .eq("approved", true)
          .limit(6);

        if (hcData && hcData.length > 0) {
          setLiveHealthCenters(hcData);
        } else {
          setLiveHealthCenters(defaultHealthCenters);
        }

        // Fetch approved doctors
        const { data: docData } = await supabase
          .from("doctors")
          .select("id, name, specialization, experience, image_url, phone")
          .eq("approved", true)
          .limit(6);

        if (docData && docData.length > 0) {
          setLiveDoctors(docData);
        } else {
          setLiveDoctors(defaultDoctors);
        }
      } catch (err) {
        console.warn("Could not load dynamic providers, using curated fallback:", err);
        setLiveHealthCenters(defaultHealthCenters);
        setLiveDoctors(defaultDoctors);
      }
    }

    fetchPublicProviders();
  }, []);

  // Fetch logged in user's upcoming appointments
  useEffect(() => {
    if (!user?.id) return;

    async function fetchMyAppointments() {
      setLoadingAppointments(true);
      try {
        const res = await fetch(`/api/appointments/my?user_id=${user?.id}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.appointments)) {
            // Take upcoming or latest 2
            setUserAppointments(json.appointments.slice(0, 2));
          }
        }
      } catch (err) {
        console.error("Failed to load user appointments", err);
      } finally {
        setLoadingAppointments(false);
      }
    }

    fetchMyAppointments();
  }, [user?.id]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (searchPincode.trim()) query.set("pincode", searchPincode.trim());
    if (selectedSpecialty !== "All Specialties") query.set("specialty", selectedSpecialty);
    router.push(`/user/book?${query.toString()}`);
  };

  return (
    <div className={`w-full min-h-screen transition-colors duration-300 ${pageBg} pt-16`}>
      {/* ===================== HERO SECTION ===================== */}
      <section className="relative overflow-hidden py-12 md:py-20 px-4 sm:px-6 lg:px-8">
        {/* Ambient Glowing Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/15 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/3 left-10 w-[300px] h-[300px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-6xl mx-auto text-center">
          {/* Trust Pill */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs sm:text-sm font-semibold mb-6 shadow-sm"
          >
            <Sparkles size={16} className="text-cyan-400 animate-pulse" />
            <span>Digital Health Revolution &bull; Verified Centers Across India</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15]"
          >
            Care Within Reach. <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 bg-clip-text text-transparent">
              Nearby Health Centers &amp; Top Doctors.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl max-w-3xl mx-auto opacity-80 leading-relaxed font-normal"
          >
            Search by pincode to book zero-wait clinic slots, meet specialists through HD live video consultations,
            and store all your medical records in one secure vault.
          </motion.p>

          {/* Unified Pincode & Specialty Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-8 sm:mt-10 max-w-4xl mx-auto"
          >
            <form
              onSubmit={handleSearchSubmit}
              className={`p-2.5 sm:p-3 rounded-2xl sm:rounded-full border shadow-xl flex flex-col sm:flex-row items-center gap-2.5 ${cardBg}`}
            >
              {/* Pincode Input */}
              <div className="flex items-center gap-2.5 px-4 py-2 w-full sm:w-2/5">
                <MapPin size={22} className="text-cyan-500 shrink-0" />
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit Pincode (e.g. 110001)"
                  value={searchPincode}
                  onChange={(e) => setSearchPincode(e.target.value.replace(/\D/g, ""))}
                  className="w-full bg-transparent border-0 outline-none text-sm sm:text-base font-medium placeholder:text-slate-400"
                />
              </div>

              <div className="hidden sm:block w-[1px] h-8 bg-slate-200 dark:bg-slate-700" />

              {/* Specialty Selector */}
              <div className="flex items-center gap-2.5 px-4 py-2 w-full sm:w-2/5">
                <Stethoscope size={22} className="text-cyan-500 shrink-0" />
                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="w-full bg-transparent border-0 outline-none text-sm sm:text-base font-medium text-slate-700 dark:text-slate-200 cursor-pointer"
                >
                  {specialtiesList.map((s) => (
                    <option key={s} value={s} className="dark:bg-[#0A192F] dark:text-white text-slate-800">
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit CTA */}
              <Button
                type="submit"
                className="w-full sm:w-auto px-8 py-6 rounded-xl sm:rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-base shadow-lg hover:shadow-cyan-500/25 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <Search size={18} />
                <span>Find Care</span>
              </Button>
            </form>

            {/* Quick Keyword Tags */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs opacity-75">
              <span className="font-semibold text-cyan-500">Popular:</span>
              {["General OPD", "Cardiologist", "Pediatrics", "Dental", "Lab Tests"].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => router.push(`/user/book?specialty=${encodeURIComponent(tag)}`)}
                  className="px-2.5 py-1 rounded-md bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Quick Metrics Banner */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { val: "500+", label: "Verified Centers", icon: Building2 },
              { val: "10,000+", label: "Slots Booked", icon: CalendarCheck },
              { val: "99.8%", label: "On-time Consults", icon: Clock },
              { val: "100%", label: "Encrypted Records", icon: Lock },
            ].map((m, idx) => (
              <div key={idx} className={`p-4 rounded-2xl border text-center ${innerCardBg}`}>
                <div className="flex items-center justify-center gap-1.5 text-cyan-500 font-extrabold text-xl sm:text-2xl">
                  <m.icon size={20} />
                  <span>{m.val}</span>
                </div>
                <p className="text-xs sm:text-sm opacity-70 mt-1 font-medium">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== LOGGED-IN PATIENT APPOINTMENTS HUB ===================== */}
      {user && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-14">
          <div className={`p-6 sm:p-8 rounded-3xl border shadow-lg ${cardBg}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 text-cyan-500 text-sm font-semibold uppercase tracking-wider">
                  <Flame size={18} />
                  <span>Your Live Patient Hub</span>
                </div>
                <h2 className="text-2xl font-bold mt-1">Upcoming Appointments &amp; Prescriptions</h2>
              </div>
              <Link href="/user/download">
                <Button variant="outline" className="rounded-full text-xs font-semibold gap-1.5 border-cyan-500/30 text-cyan-600 dark:text-cyan-400">
                  <FileDown size={15} />
                  <span>All Medical Documents</span>
                </Button>
              </Link>
            </div>

            {loadingAppointments ? (
              <div className="py-8 text-center text-sm opacity-70 animate-pulse">
                Fetching your latest appointment records...
              </div>
            ) : userAppointments.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {userAppointments.map((appt) => (
                  <div key={appt.id} className={`p-5 rounded-2xl border flex flex-col justify-between ${innerCardBg}`}>
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                          {appt.status || "Confirmed"}
                        </span>
                        <span className="text-xs opacity-70 font-mono">{appt.date} &bull; {appt.time}</span>
                      </div>
                      <h3 className="font-bold text-lg">{appt.center_name || "Health Center"}</h3>
                      <p className="text-sm opacity-80 mt-0.5">Purpose: {appt.purpose || "General Consultation"}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                      <span className="text-xs opacity-60">Patient: {appt.user_name || "You"}</span>
                      <Link href="/user/download" className="text-xs font-semibold text-cyan-500 hover:underline flex items-center gap-1">
                        <span>View Slip &amp; Docs</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-2xl border border-dashed border-cyan-500/30 text-center flex flex-col items-center justify-center">
                <CalendarCheck size={36} className="text-cyan-500/60 mb-2" />
                <p className="font-semibold text-base">No active upcoming appointments</p>
                <p className="text-sm opacity-75 max-w-md mt-1 mb-4">
                  Need a specialist checkup or lab test? Pick a verified health center slot near you now.
                </p>
                <Link href="/user/book">
                  <Button className="rounded-full px-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm">
                    Book an OPD Slot
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ===================== 3-PORTAL SELECTOR SHOWCASE ===================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold">One Unified Health Ecosystem</h2>
          <p className="text-sm sm:text-base opacity-75 mt-2">
            Engineered for Patients, Registered Doctors, and Municipal Health Centers.
          </p>

          {/* Portal Switcher Tabs */}
          <div className="inline-flex p-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 mt-6 shadow-sm">
            {[
              { id: "patients", label: "For Patients", icon: Users },
              { id: "doctors", label: "For Doctors", icon: Stethoscope },
              { id: "healthcenters", label: "For Health Centers", icon: Building2 },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActivePortalTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                  activePortalTab === tab.id
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md"
                    : "opacity-75 hover:opacity-100"
                }`}
              >
                <tab.icon size={16} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Portal Card */}
        <AnimatePresence mode="wait">
          {activePortalTab === "patients" && (
            <motion.div
              key="patients"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-6 sm:p-10 rounded-3xl border shadow-xl grid md:grid-cols-2 gap-8 items-center ${cardBg}`}
            >
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
                  Citizen &amp; Patient Portal
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold mt-3">
                  Skip the clinic queue. Book &amp; consult in minutes.
                </h3>
                <p className="text-sm sm:text-base opacity-80 mt-3 leading-relaxed">
                  Search health centers by pincode, choose available morning or evening slots, and consult certified doctors directly from your smartphone or laptop.
                </p>
                <ul className="mt-5 space-y-2.5 text-sm">
                  {[
                    "Zero-wait OPD slot scheduling with real-time token tracking",
                    "HD Encrypted video consultations with specialist doctors",
                    "Lifetime vault for prescriptions, lab results, and invoices",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2.5 font-medium">
                      <CheckCircle2 size={18} className="text-cyan-500 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/user/book">
                    <Button className="rounded-full px-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-md">
                      Book Slot Now
                    </Button>
                  </Link>
                  <Link href="/user/consult">
                    <Button variant="outline" className="rounded-full px-6 border-cyan-500/30 font-semibold text-cyan-600 dark:text-cyan-400">
                      Join Live Video Consult
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80"
                  alt="Patient care"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
                  <div className="text-white">
                    <p className="text-xs uppercase font-semibold text-cyan-300">Fast OPD Access</p>
                    <p className="font-bold text-lg">Instant Appointments Across 15+ Medical Specialties</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activePortalTab === "doctors" && (
            <motion.div
              key="doctors"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-6 sm:p-10 rounded-3xl border shadow-xl grid md:grid-cols-2 gap-8 items-center ${cardBg}`}
            >
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/10 text-blue-500 border border-blue-500/20">
                  Doctor Clinical Suite
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold mt-3">
                  Expand your clinical reach with integrated telemedicine.
                </h3>
                <p className="text-sm sm:text-base opacity-80 mt-3 leading-relaxed">
                  Provide live video consultations, manage your daily patient queues, and digitally issue signed prescriptions directly to patients' profiles.
                </p>
                <ul className="mt-5 space-y-2.5 text-sm">
                  {[
                    "Verified clinical credentials & public doctor profile",
                    "Integrated WebRTC live teleconsult room with screen sharing",
                    "Automated document issuance for prescriptions and referrals",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2.5 font-medium">
                      <CheckCircle2 size={18} className="text-blue-500 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/auth/doctor">
                    <Button className="rounded-full px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md">
                      Doctor Login / Workspace
                    </Button>
                  </Link>
                  <Link href="/auth/doctor">
                    <Button variant="outline" className="rounded-full px-6 border-blue-500/30 font-semibold text-blue-600 dark:text-blue-400">
                      Register as Doctor
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80"
                  alt="Doctor consultation"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
                  <div className="text-white">
                    <p className="text-xs uppercase font-semibold text-blue-300">Telemedicine Workspace</p>
                    <p className="font-bold text-lg">Integrated Video &amp; Digital Prescription Delivery</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activePortalTab === "healthcenters" && (
            <motion.div
              key="healthcenters"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-6 sm:p-10 rounded-3xl border shadow-xl grid md:grid-cols-2 gap-8 items-center ${cardBg}`}
            >
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                  Health Center &amp; OPD Management
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold mt-3">
                  Digitize your clinic OPD and reduce walk-in congestion.
                </h3>
                <p className="text-sm sm:text-base opacity-80 mt-3 leading-relaxed">
                  Health centers and community dispensaries can manage doctor rosters, configure daily booking slots, and upload lab test reports securely to Cloudinary.
                </p>
                <ul className="mt-5 space-y-2.5 text-sm">
                  {[
                    "Automated daily slot capacity & token generation",
                    "Instant lab report and diagnostic document distribution",
                    "Role-protected administrator and staff oversight",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2.5 font-medium">
                      <CheckCircle2 size={18} className="text-indigo-500 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/auth/healthcenter">
                    <Button className="rounded-full px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-md">
                      Health Center Portal
                    </Button>
                  </Link>
                  <Link href="/auth/healthcenter">
                    <Button variant="outline" className="rounded-full px-6 border-indigo-500/30 font-semibold text-indigo-600 dark:text-indigo-400">
                      Onboard New Facility
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80"
                  alt="Modern Clinic"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
                  <div className="text-white">
                    <p className="text-xs uppercase font-semibold text-indigo-300">OPD Automation</p>
                    <p className="font-bold text-lg">Smart Slot Allotment &amp; Paperless Records</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ===================== CORE HEALTHCARE SERVICES ===================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold">Complete Healthcare at Your Fingertips</h2>
          <p className="text-sm sm:text-base opacity-75 mt-2">
            Everything you need from preliminary checkups to post-consultation documents.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Book Clinic Slot",
              desc: "Instant booking at verified health centers near your pincode.",
              icon: CalendarCheck,
              href: "/user/book",
              gradient: "from-cyan-500 to-blue-500",
            },
            {
              title: "Live Video Consult",
              desc: "Connect face-to-face with certified medical specialists online.",
              icon: Video,
              href: "/user/consult",
              gradient: "from-blue-500 to-indigo-600",
            },
            {
              title: "Encrypted Records",
              desc: "Download prescriptions, diagnostic reports and bills on demand.",
              icon: FileDown,
              href: "/user/download",
              gradient: "from-indigo-600 to-violet-600",
            },
            {
              title: "AI Symptom Triage",
              desc: "Check symptoms 24/7 and get instant healthcare guidance.",
              icon: Bot,
              href: "/user/chat",
              gradient: "from-violet-600 to-pink-500",
            },
          ].map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.2 }}
              >
                <Link href={card.href} className="block h-full">
                  <div className={`p-6 rounded-3xl border h-full flex flex-col justify-between transition-all duration-300 hover:shadow-xl ${cardBg}`}>
                    <div>
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center text-white mb-5 shadow-lg shadow-cyan-500/20`}>
                        <Icon size={26} />
                      </div>
                      <h3 className="font-bold text-lg mb-2">{card.title}</h3>
                      <p className="text-sm opacity-75 leading-relaxed">{card.desc}</p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-cyan-500">
                      <span>Explore Service</span>
                      <ArrowRight size={15} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ===================== LIVE APPROVED HEALTH CENTERS ===================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-cyan-500 text-sm font-semibold uppercase tracking-wider">
              <Hospital size={18} />
              <span>Verified Network</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mt-1">Health Centers Near You</h2>
          </div>
          <Link href="/user/book">
            <Button variant="outline" className="rounded-full text-xs font-semibold gap-1.5 border-cyan-500/30 text-cyan-600 dark:text-cyan-400">
              <span>View All Centers</span>
              <ChevronRight size={15} />
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {liveHealthCenters.map((hc) => (
            <div key={hc.id} className={`rounded-3xl border overflow-hidden transition-all duration-300 hover:shadow-xl ${cardBg}`}>
              <div className="relative h-44 w-full bg-slate-200 dark:bg-slate-800">
                <img
                  src={hc.image_url || "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80"}
                  alt={hc.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1">
                  <MapPin size={12} className="text-cyan-400" />
                  <span>PIN: {hc.pincode}</span>
                </div>
              </div>

              <div className="p-6">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-500 mb-1">
                  <ShieldCheck size={14} />
                  <span>Government / Admin Verified</span>
                </div>
                <h3 className="font-bold text-lg">{hc.name}</h3>
                <p className="text-xs opacity-75 mt-1 line-clamp-2">{hc.address}</p>

                {hc.phone && (
                  <p className="text-xs opacity-60 mt-2 font-mono flex items-center gap-1">
                    <PhoneCall size={12} />
                    <span>{hc.phone}</span>
                  </p>
                )}

                <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <Link href={`/user/book?pincode=${hc.pincode}`}>
                    <Button className="w-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-xs py-2 shadow-sm">
                      Book Slot at This Center
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== LIVE VERIFIED DOCTORS ===================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-cyan-500 text-sm font-semibold uppercase tracking-wider">
              <Stethoscope size={18} />
              <span>Certified Clinicians</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mt-1">Specialist Doctors Available</h2>
          </div>
          <Link href="/user/consult">
            <Button variant="outline" className="rounded-full text-xs font-semibold gap-1.5 border-cyan-500/30 text-cyan-600 dark:text-cyan-400">
              <span>All Doctors</span>
              <ChevronRight size={15} />
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {liveDoctors.map((doc) => (
            <div key={doc.id} className={`p-6 rounded-3xl border flex items-center gap-4 transition-all duration-300 hover:shadow-xl ${cardBg}`}>
              <div className="relative shrink-0">
                <img
                  src={doc.image_url || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80"}
                  alt={doc.name}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-cyan-500/40 shadow-md"
                />
                <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-emerald-500 text-white" title="Verified">
                  <CheckCircle2 size={12} />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-base truncate">{doc.name}</h3>
                <p className="text-xs font-semibold text-cyan-500 mt-0.5">{doc.specialization}</p>
                {doc.experience && (
                  <p className="text-xs opacity-70 mt-0.5">{doc.experience} Experience</p>
                )}

                <div className="mt-3">
                  <Link href="/user/consult">
                    <Button className="rounded-full px-4 py-1.5 text-xs font-semibold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                      Consult Specialist
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== HOW MEDICONNECTION WORKS ===================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className={`p-8 sm:p-12 rounded-3xl border text-center ${innerCardBg}`}>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">How MediConnection Works</h2>
          <p className="text-sm sm:text-base opacity-75 max-w-2xl mx-auto mb-10">
            Four simple steps to seamless healthcare from your local clinic to your pocket.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {[
              {
                step: "01",
                title: "Search by Pincode",
                desc: "Enter your 6-digit postal code to discover approved community health centers.",
              },
              {
                step: "02",
                title: "Choose Time or Video",
                desc: "Select morning/evening OPD slots or request an immediate live video appointment.",
              },
              {
                step: "03",
                title: "Meet Your Doctor",
                desc: "Consult without waiting in lines. Receive expert medical diagnosis and guidance.",
              },
              {
                step: "04",
                title: "Access Cloud Records",
                desc: "Download verified prescriptions, diagnostic reports, and payment slips 24/7.",
              },
            ].map((s) => (
              <div key={s.step} className={`p-6 rounded-2xl border ${cardBg}`}>
                <div className="text-2xl font-black text-cyan-500 font-mono mb-2">{s.step}</div>
                <h4 className="font-bold text-base mb-1.5">{s.title}</h4>
                <p className="text-xs sm:text-sm opacity-75 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== 24/7 NATIONAL EMERGENCY HELPLINES ===================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="p-6 rounded-3xl border border-red-500/30 bg-red-500/5 backdrop-blur-md">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-red-500 text-white shrink-0">
                <AlertCircle size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-red-500">24/7 National Emergency Helplines</h3>
                <p className="text-xs sm:text-sm opacity-75">
                  Immediate assistance available nationwide across India. Tap to dial directly.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {[
                { name: "Ambulance", num: "108" },
                { name: "National Emergency", num: "112" },
                { name: "Health Helpline", num: "1075" },
                { name: "Women Helpline", num: "1091" },
              ].map((h) => (
                <a
                  key={h.name}
                  href={`tel:${h.num}`}
                  className="px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 font-semibold text-xs border border-red-500/20 transition-all flex items-center gap-1.5"
                >
                  <PhoneCall size={13} />
                  <span>{h.name}: <strong>{h.num}</strong></span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===================== TESTIMONIALS ===================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold">Loved by Patients &amp; Doctors</h2>
          <p className="text-sm sm:text-base opacity-75 mt-2">
            Real feedback from citizens using MediConnection every single day.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              name: "Nitesh Bhagat",
              role: "Patient &bull; Delhi",
              feedback: "Booking an OPD appointment by pincode saved me over 2 hours of standing in queue. The system sent my digital slip instantly.",
              rating: 5,
            },
            {
              name: "Dr. Rashmika Agarwal",
              role: "Physician &bull; Pune",
              feedback: "The telemedicine suite is phenomenal. Screen sharing lab tests and issuing digital prescriptions directly to patients is completely seamless.",
              rating: 5,
            },
            {
              name: "Emily Sharma",
              role: "Patient &bull; Bangalore",
              feedback: "Live video consult with the doctor was crystal clear. All my prescriptions and bills were saved in my account vault ready to download.",
              rating: 5,
            },
          ].map((t, idx) => (
            <div key={idx} className={`p-6 rounded-3xl border flex flex-col justify-between ${cardBg}`}>
              <div>
                <div className="flex gap-1 text-amber-400 mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <span key={i}>&#9733;</span>
                  ))}
                </div>
                <p className="text-sm opacity-85 italic leading-relaxed">"{t.feedback}"</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
                <p className="font-bold text-sm">{t.name}</p>
                <p className="text-xs opacity-60" dangerouslySetInnerHTML={{ __html: t.role }} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
