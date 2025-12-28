import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export interface Appointment {

    id?: string;
    appointment_id?: string;
    user_name?: string;
    doctor_name?: string;
    center_name?: string;
    date: string | Date;
    time: string;
    purpose: string;
    status?: string;
    phone?: string;
    price?: number;
}

type PdfUser =
    | { name?: string }
    | SupabaseUser
    | null;

export const generateAppointmentPDF = (
    appointment: Appointment,
    user: PdfUser = null
): boolean => {
    try {
        const doc = new jsPDF();

        doc.setFontSize(20);
        doc.setTextColor(40, 40, 40);
        doc.text("Mediconnection Appointment Receipt", 105, 20, {
            align: "center",
        });

        doc.setLineWidth(0.5);
        doc.line(20, 30, 190, 30);

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);

        const dateObj = new Date(appointment.date);
        const dateStr = !isNaN(dateObj.getTime())
            ? format(dateObj, "PPP")
            : String(appointment.date);

        const patientName =
            appointment.user_name ||
            (user && "user_metadata" in user
                ? (user.user_metadata as { full_name?: string })?.full_name
                : (user as { name?: string })?.name) ||
            "N/A";

        const details: Array<[string, string]> = [
            ["Appointment ID", appointment.id || appointment.appointment_id || "N/A"],
            ["Patient Name", patientName],
            [
                appointment.doctor_name ? "Doctor" : "Health Center",
                appointment.doctor_name || appointment.center_name || "N/A",
            ],
            ["Date", dateStr],
            ["Time", appointment.time],
            ["Purpose", appointment.purpose],
            ["Status", (appointment.status || "Confirmed").toUpperCase()],
            ["Phone", appointment.phone || "N/A"],
            [
                "Price",
                (appointment.price ?? 0) > 0 ? `Rs. ${appointment.price}` : "Free",
            ],
        ];

        autoTable(doc, {
            startY: 40,
            head: [["Field", "Details"]],
            body: details,
            theme: "grid",
            headStyles: { fillColor: [0, 150, 136] },
            styles: { fontSize: 12, cellPadding: 3 },
        });

        const finalY =
            (doc as jsPDF & { lastAutoTable?: { finalY: number } })
                .lastAutoTable?.finalY ?? 150;

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(
            "Thank you for choosing Mediconnection.",
            105,
            finalY + 20,
            { align: "center" }
        );

        doc.save(
            `Appointment_${appointment.id || appointment.appointment_id || "details"}.pdf`
        );

        return true;
    } catch (error) {
        console.error("PDF Generation Error:", error);
        return false;
    }
};
