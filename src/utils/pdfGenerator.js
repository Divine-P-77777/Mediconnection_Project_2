import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";

export const generateAppointmentPDF = (appointment, user = null) => {
    try {
        const doc = new jsPDF();

        // Header
        doc.setFontSize(20);
        doc.setTextColor(40, 40, 40);
        doc.text("Mediconnection Appointment Receipt", 105, 20, { align: "center" });

        // Line separator
        doc.setLineWidth(0.5);
        doc.line(20, 30, 190, 30);

        // Patient & Center Details
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);

        // Handle data structure differences between immediate booking result and fetched appointment
        const dateObj = new Date(appointment.date);
        const dateStr = !isNaN(dateObj) ? format(dateObj, "PPP") : appointment.date;

        const details = [
            ["Appointment ID", appointment.id || appointment.appointment_id || "N/A"],
            ["Patient Name", appointment.user_name || user?.name || "N/A"],
            ["Health Center", appointment.center_name || "N/A"],
            ["Date", dateStr],
            ["Time", appointment.time],
            ["Purpose", appointment.purpose],
            ["Status", (appointment.status || "Confirmed").toUpperCase()],
            ["Phone", appointment.phone || "N/A"],
            ["Price", appointment.price > 0 ? `Rs. ${appointment.price}` : "Free"],
        ];

        autoTable(doc, {
            startY: 40,
            head: [["Field", "Details"]],
            body: details,
            theme: "grid",
            headStyles: { fillColor: [0, 150, 136] }, // Cyan/Teal color
            styles: { fontSize: 12, cellPadding: 3 },
        });

        // Footer
        const finalY = doc.lastAutoTable.finalY || 150;
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text("Thank you for choosing Mediconnection.", 105, finalY + 20, { align: "center" });

        doc.save(`Appointment_${appointment.id || appointment.appointment_id || "details"}.pdf`);
        return true;
    } catch (error) {
        console.error("PDF Generation Error:", error);
        return false;
    }
};
