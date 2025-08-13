"use client";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { sampleData } from "@/constants";
import { healthCentersData } from "@/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Styled component for dark mode classes
const cn = (classes, isDark) => {
    if (!Array.isArray(classes)) return typeof classes === 'function' ? classes(isDark) : classes;
    return classes.map(c => (typeof c === 'function' ? c(isDark) : c)).join(' ');
};

const DownloadPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [phone, setPhone] = useState("+91 ");
    const [pincode, setPincode] = useState("");
    const [selectedCenter, setSelectedCenter] = useState("");
    const [searched, setSearched] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [filteredCenters, setFilteredCenters] = useState([]);
    const isDarkMode = useSelector((state) => state.theme.isDarkMode);

    useEffect(() => {
        if (pincode.length === 6) {
            const filtered = healthCentersData.filter(center => center.pincode === pincode);
            setFilteredCenters(filtered);
        } else {
            setFilteredCenters([]);
        }
    }, [pincode]);

    const handleSearch = () => {
        if (pincode.length !== 6) {
            alert("Please enter a valid 6-digit pincode");
            return;
        }
        if (phone.length < 13) { // +91 + 10 digits
            alert("Please enter a valid 10-digit phone number");
            return;
        }
        if (!selectedCenter) {
            alert("Please select a health center");
            return;
        }
        if (!searchTerm) {
            alert("Please enter a name or ID to search");
            return;
        }

        setIsLoading(true);
        setSearched(true);
        // Simulate API call delay
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value;
        if (value.startsWith("+91 ")) {
            // Only allow numbers after +91
            const numbers = value.substring(4).replace(/\D/g, '');
            if (numbers.length <= 10) {
                setPhone("+91 " + numbers);
            }
        } else if (value === "") {
            setPhone("+91 ");
        }
    };

    const filteredData = (data) =>
        data.filter(
            (item) =>
                (item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.id.toString().includes(searchTerm)) &&
                (selectedCenter === "" || item.center === selectedCenter)
        );

    const renderTable = (title, data) => {
        const filtered = filteredData(data);
        if (filtered.length === 0) return <p className="text-center text-gray-500 dark:text-gray-400 mb-6">{title}: Not Found</p>;

        return (
            <div className="mb-8">
                <h2 className="text-lg font-bold mb-4">{title}</h2>
                <div className="overflow-x-auto">
                    <table className={`w-full border-collapse border text-sm ${isDarkMode ? "border-gray-600 bg-gray-800 text-white" : "border-gray-300 bg-white text-black"}`}>
                        <thead className={`${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                            <tr>
                                <th className="p-2 border">Doctor</th>
                                <th className="p-2 border">Health Center</th>
                                <th className="p-2 border">Date</th>
                                <th className="p-2 border">Download</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((item) => (
                                <tr key={item.id} className={`hover:bg-cyan-200 dark:hover:bg-gray-600 transition`}>
                                    <td className="p-2 border">{item.doctor}</td>
                                    <td className="p-2 border">{item.center}</td>
                                    <td className="p-2 border">{item.date}</td>
                                    <td className="p-2 border text-center">
                                        <button className="px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 text-xs cursor-pointer">
                                            Download
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    return (
        <div className={`mt-20 ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"} min-h-screen p-6 md:p-8`}>
            <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">Download Page</h1>

            {/* Search Inputs */}
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Pincode Input */}
                <Card className="p-6 shadow-lg">
                    <CardHeader className="flex justify-center">
                        <CardTitle>Enter Your Pincode</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="text"
                            placeholder="Enter 6-digit pincode"
                            value={pincode}
                            onChange={(e) => setPincode(e.target.value)}
                            maxLength={6}
                            minLength={6}
                            className={cn([isDark => `w-full p-3 rounded-lg border ${isDark ? "bg-[#0A192F] text-white" : "bg-white text-black"}`], isDarkMode)}
                        />
                    </CardContent>
                </Card>

                {/* Health Center Selection */}
                <Card className="p-6 shadow-lg">
                    <CardHeader className="flex justify-center">
                        <CardTitle>Select Health Center</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {pincode.length === 6 ? (
                            <select
                                className={cn([isDark => `w-full p-3 rounded-lg border ${isDark ? "bg-[#0A192F] text-white" : "bg-white text-black"}`], isDarkMode)}
                                value={selectedCenter}
                                onChange={(e) => setSelectedCenter(e.target.value)}
                            >
                                <option value="" disabled>Select a Health Center</option>
                                {filteredCenters.map(center => (
                                    <option key={center.id} value={center.center}>{center.center}</option>
                                ))}
                            </select>
                        ) : (
                            <div className="text-gray-500 text-center">Please enter a valid pincode first</div>
                        )}
                    </CardContent>
                </Card>

                {/* Name/ID and Phone Input */}
                <Card className="p-6 shadow-lg">
                    <CardHeader className="flex justify-center">
                        <CardTitle>Enter Your Details</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="text"
                            placeholder="Enter Name or ID"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={cn([isDark => `w-full p-3 rounded-lg border ${isDark ? "bg-[#0A192F] text-white" : "bg-white text-black"}`], isDarkMode)}
                        />
                        <input
                            type="text"
                            placeholder="Enter Phone Number"
                            value={phone}
                            onChange={handlePhoneChange}
                            className={cn([isDark => `w-full p-3 rounded-lg border ${isDark ? "bg-[#0A192F] text-white" : "bg-white text-black"}`], isDarkMode)}
                        />
                        <Button
                            onClick={handleSearch}
                            className="bg-[#00A8E8] text-white hover:bg-[#0077B6] transition-colors"
                        >
                            Search
                        </Button>
                    </CardContent>
                </Card>

                {/* Show Loading or Data */}
                {isLoading ? (
                    <div className="flex justify-center py-4">
                        <div className="w-6 h-6 border-4 border-blue-400 border-t-transparent animate-spin rounded-full"></div>
                    </div>
                ) : searched && (
                    <>
                        {renderTable("Prescriptions", sampleData.prescriptions)}
                        {renderTable("Bills", sampleData.bills)}
                        {renderTable("Reports", sampleData.reports)}
                    </>
                )}
            </div>
        </div>
    );
};

export default DownloadPage;
