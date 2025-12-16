"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Download, Calendar, Clock, MapPin, Filter, ChevronLeft, ChevronRight, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export default function MyBookingsPage() {
    const { user } = useAuth();
    const { errorToast, Success } = useToast();
    const isDarkMode = useSelector((state) => state.theme.isDarkMode);

    const [appointments, setAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        if (user) {
            fetchAppointments();
        }
    }, [user]);

    useEffect(() => {
        filterData();
    }, [appointments, statusFilter]);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            // Handle both user.id and user._id just in case
            const userId = user._id || user.id;
            const res = await fetch(`/api/appointments/my?user_id=${userId}`);
            const data = await res.json();

            if (data.success) {
                setAppointments(data.appointments);
            } else {
                errorToast(data.error || "Failed to fetch appointments");
            }
        } catch (error) {
            errorToast("Something went wrong while fetching appointments");
        } finally {
            setLoading(false);
        }
    };

    const filterData = () => {
        let data = [...appointments];
        if (statusFilter !== "All") {
            // Typically statuses are lowercase in DB, handle case insensitivity
            data = data.filter(
                (app) => app.status?.toLowerCase() === statusFilter.toLowerCase()
            );
        }
        setFilteredAppointments(data);
        setCurrentPage(1); // Reset to first page on filter change
    };

    // Pagination Logic
    const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
    const paginatedData = filteredAppointments.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleDownloadPDF = (appointment) => {
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

            const details = [
                ["Appointment ID", appointment.id || "N/A"],
                ["Patient Name", appointment.user_name || user?.name || "N/A"],
                ["Health Center", appointment.center_name || "N/A"],
                ["Date", format(new Date(appointment.date), "PPP")],
                ["Time", appointment.time],
                ["Purpose", appointment.purpose],
                ["Status", appointment.status?.toUpperCase() || "N/A"],
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

            doc.save(`Appointment_${appointment.id || "details"}.pdf`);
            Success("PDF downloaded successfully!");
        } catch (error) {
            console.error(error);
            errorToast("Failed to generate PDF. Make sure jspdf is installed.");
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "confirmed": return "text-green-500 bg-green-100 dark:bg-green-900/20";
            case "pending": return "text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20";
            case "cancelled": return "text-red-500 bg-red-100 dark:bg-red-900/20";
            case "completed": return "text-blue-500 bg-blue-100 dark:bg-blue-900/20";
            default: return "text-gray-500 bg-gray-100 dark:bg-gray-800";
        }
    };

    // Styles
    const pageBg = isDarkMode ? "bg-slate-900 text-white" : "bg-gray-50 text-gray-900";
    const cardBg = isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200";
    const tableHeadBg = isDarkMode ? "bg-slate-900 text-gray-300" : "bg-gray-100 text-gray-700";
    const tableRowHover = isDarkMode ? "hover:bg-slate-700/50" : "hover:bg-gray-50";

    if (loading) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${pageBg}`}>
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen py-32 px-4 sm:px-8 ${pageBg}`}>
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                        My Appointments
                    </h1>

                    <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-gray-400" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className={`p-2 rounded-lg border outline-none focus:ring-2 focus:ring-cyan-500 transition-all ${isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-gray-300 text-gray-800"
                                }`}
                        >
                            <option value="All">All Status</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>

                {appointments.length === 0 ? (
                    <Card className={`text-center py-12 ${cardBg}`}>
                        <CardContent>
                            <Calendar className="w-16 h-16 mx-auto mb-4 text-cyan-500/50" />
                            <h2 className="text-xl font-semibold mb-2">No appointments found</h2>
                            <p className="text-gray-500">You haven't booked any appointments yet.</p>
                            <Button
                                onClick={() => window.location.href = "/user/book"}
                                className="mt-6 bg-cyan-600 hover:bg-cyan-700 text-white"
                            >
                                Book Now
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        <div className={`rounded-xl border overflow-hidden shadow-lg transition-all duration-300 ${cardBg}`}>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className={`uppercase text-sm font-semibold tracking-wider ${tableHeadBg}`}>
                                            <th className="p-4">Date & Time</th>
                                            <th className="p-4">Health Center</th>
                                            <th className="p-4">Patient</th>
                                            <th className="p-4">Purpose</th>
                                            <th className="p-4">Status</th>
                                            <th className="p-4 text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                                        {paginatedData.map((app) => (
                                            <tr key={app.id} className={`transition-colors ${tableRowHover}`}>
                                                <td className="p-4 whitespace-nowrap">
                                                    <div className="flex flex-col">
                                                        <span className="font-medium flex items-center gap-1">
                                                            <Calendar className="w-3 h-3 text-cyan-500" />
                                                            {format(new Date(app.date), "MMM d, yyyy")}
                                                        </span>
                                                        <span className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {app.time}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                                                        <span className="line-clamp-1">{app.center_name}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 font-medium">{app.user_name}</td>
                                                <td className="p-4 text-sm text-gray-500">{app.purpose}</td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(app.status)}`}>
                                                        {app.status}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDownloadPDF(app)}
                                                        title="Download Receipt"
                                                        className="text-cyan-500 hover:text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-900/20"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className={`p-4 border-t flex items-center justify-between ${isDarkMode ? "border-slate-700 bg-slate-800" : "border-gray-200 bg-white"}`}>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className={isDarkMode ? "bg-slate-700 border-slate-600 hover:bg-slate-600 text-white" : ""}
                                    >
                                        <ChevronLeft className="w-4 h-4 mr-1" /> Prev
                                    </Button>
                                    <span className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className={isDarkMode ? "bg-slate-700 border-slate-600 hover:bg-slate-600 text-white" : ""}
                                    >
                                        Next <ChevronRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </div>
                            )}
                        </div>

                        {filteredAppointments.length === 0 && (
                            <div className="text-center py-10 text-gray-500">
                                No bookings found for the selected status.
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
