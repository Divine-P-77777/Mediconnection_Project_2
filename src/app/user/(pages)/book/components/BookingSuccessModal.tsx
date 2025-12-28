"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ArrowRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateAppointmentPDF } from "@/utils/pdfGenerator";
import { useAuth } from "@/hooks/useAuth";
import { useAppSelector } from "@/store/hooks";
import type { Appointment } from "@/utils/pdfGenerator";


interface BookingSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    appointment: Appointment | null;
    onDownload?: () => void;
}


export default function BookingSuccessModal({
    isOpen,
    onClose,
    appointment,
    onDownload,
}: BookingSuccessModalProps) {
    const { user } = useAuth();
    const isDarkMode = useAppSelector((s) => s.theme.isDarkMode);

    if (!isOpen) return null;

    const handleDownload = (): void => {
        if (!appointment) return;
        const success = generateAppointmentPDF(appointment, user as any);
        if (success && onDownload) onDownload();
    };

    const theme = {
        overlay: "bg-black/60",
        cardBg: isDarkMode ? "bg-[#0b1220]" : "bg-white",
        border: isDarkMode ? "border border-slate-700" : "border border-gray-200",
        title: isDarkMode ? "text-white" : "text-gray-900",
        text: isDarkMode ? "text-slate-300" : "text-gray-600",
        subtle: isDarkMode ? "text-slate-400" : "text-gray-500",
        secondaryBtn: isDarkMode
            ? "border-slate-600 bg-[#0b1220] hover:bg-slate-800 text-white"
            : "border-gray-300 bg-white hover:bg-gray-100 text-gray-900",
        successBg: isDarkMode ? "bg-green-900/30" : "bg-green-100",
        successIcon: "text-green-500",
    };

    return (
        <AnimatePresence>
            <motion.div
                className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm px-4 ${theme.overlay}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    transition={{ type: "spring", damping: 18 }}
                    className={`relative w-full max-w-md overflow-hidden rounded-2xl shadow-2xl ${theme.cardBg} ${theme.border}`}
                >
                    <div className="h-1.5 w-full bg-gradient-to-r from-green-400 via-emerald-400 to-cyan-500" />

                    <div className="p-8 text-center">
                        <div
                            className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full ${theme.successBg}`}
                        >
                            <CheckCircle2
                                className={`h-10 w-10 ${theme.successIcon}`}
                                strokeWidth={2.2}
                            />
                        </div>

                        <h2 className={`text-2xl font-semibold mb-2 ${theme.title}`}>
                            Appointment Confirmed
                        </h2>

                        <p className={`text-sm leading-relaxed mb-8 ${theme.text}`}>
                            Your visit has been successfully scheduled.
                            <br />
                            Download your appointment letter for reference.
                        </p>

                        <div className="flex flex-col gap-3">
                            <Button
                                onClick={handleDownload}
                                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white text-base font-medium shadow-lg shadow-cyan-500/20 flex items-center justify-center"
                            >
                                <FileText className="mr-2 h-5 w-5" />
                                <div>Download Appointment Letter</div>
                            </Button>

                            <Button
                                variant="outline"
                                onClick={onClose}
                                className={`w-full py-1 text-sm font-medium transition ${theme.secondaryBtn} flex items-center justify-center`}
                            >
                                <div>Go to My Appointments</div>
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>

                        <p className={`mt-6 text-xs ${theme.subtle}`}>
                            You can view or download this appointment anytime from your
                            dashboard.
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
