"use client";
import { useState, useEffect, useCallback, memo } from "react";
import { useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from 'framer-motion';
import { FaCalendarCheck, FaVideo, FaFileDownload } from 'react-icons/fa';
import Link from "next/link";
import supabase from "@/utils/supabase/client";
import { Users, FileText, Upload, UserPlus, Calendar, Clock, FileUp, UserCheck } from "lucide-react";


const features = [
  { 
    icon: <FaCalendarCheck size={30} />, 
    title: 'Manage Appointments',
    link: '/admin/dashboard', 
    description: 'Manage appointments with top doctors.' 
  },
  { 
    icon: <FaVideo size={30} />, 
    title: 'Upload Documents',
    link: '/admin/upload', 
    description: 'Upload Bills, Reports, and Prescriptions for the patients.' 
  },
  { 
    icon: <FaFileDownload size={30} />, 
    title: 'Manage Doctors',
    link: '/admin/manage', 
    description: 'Manage doctors and their appointments.' 
  },
];

// Memoize the Feature Card component
const FeatureCard = memo(({ feature, isDarkMode }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    whileHover={{ scale: 1.05 }}
  >
    <Link href={feature.link}>
      <Card className={`p-6 h-[200px] text-center shadow-sm ${
        isDarkMode ? "shadow-cyan-400 border-gray-200" : "shadow-gray-400 border-gray-500"
      } hover:shadow-md border border-gray-200 rounded-lg`}>
        <CardHeader>
          <div className="flex justify-center text-[#00A8E8] mb-4">{feature.icon}</div>
          <CardTitle>{feature.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{feature.description}</p>
        </CardContent>
      </Card>
    </Link>
  </motion.div>
));

FeatureCard.displayName = 'FeatureCard';

// Memoize the StatCard component
const StatCard = memo(({ title, value, subtext, icon: Icon, isDarkMode }) => (
  <Card className={`p-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className={`h-4 w-4 ${isDarkMode ? 'text-cyan-400' : 'text-blue-600'}`} />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{subtext}</p>
    </CardContent>
  </Card>
));

StatCard.displayName = 'StatCard';

export default function AdminHome() {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [healthCenterName, setHealthCenterName] = useState('');
  const [isOnline, setIsOnline] = useState(false);

  const fetchHealthCenterDetails = useCallback(async () => {
    const healthCenterId = localStorage.getItem('healthCenterId');
    if (!healthCenterId) {
      console.log('No health center ID found');
      return;
    }

    try {
      console.log('Fetching details for ID:', healthCenterId);
      const { data, error } = await supabase
        .from('health_centers')
        .select('name, current_status')
        .eq('id', healthCenterId)
        .single();

      if (error) {
        console.error('Fetch error:', error);
        throw error;
      }

      if (data) {
        console.log('Fetched data:', data);
        setHealthCenterName(data.name);
        setIsOnline(!!data.current_status); // Convert to boolean explicitly
        console.log('Set online status to:', !!data.current_status);
      }
    } catch (error) {
      console.error('Error fetching health center details:', error.message);
    }
  }, []);

  useEffect(() => {
    fetchHealthCenterDetails();
  }, [fetchHealthCenterDetails]);

  const toggleOnlineStatus = useCallback(async () => {
    const healthCenterId = localStorage.getItem('healthCenterId');
    if (!healthCenterId) {
      console.log('No health center ID found for toggle');
      return;
    }

    try {
      console.log('Current status before toggle:', isOnline);
      const newStatus = !isOnline;
      console.log('Attempting to set status to:', newStatus);

      const { data, error } = await supabase
        .from('health_centers')
        .update({ current_status: newStatus })
        .eq('id', healthCenterId)
        .select()
        .single();

      if (error) {
        console.error('Toggle error:', error);
        throw error;
      }

      if (data) {
        console.log('Toggle response:', data);
        setIsOnline(!!data.current_status); // Convert to boolean explicitly
        console.log('Status updated to:', !!data.current_status);
      }
    } catch (error) {
      console.error('Error updating status:', error.message);
    }
  }, [isOnline]);

  const DashboardContent = useCallback(() => (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center py-12 pt-30 container mx-auto px-4"
      >
        <h1 className="text-2xl sm:text-4xl font-bold">
          Welcome {healthCenterName} to Mediconnection
        </h1>
        <p className="mt-2 text-lg">
          Dear Doctors, from here you can manage your appointments, patients, and more.
        </p>
        <div className="mt-6 flex sm:flex-row flex-col justify-center gap-4">
          <Button className="bg-[#00A8E8] text-white px-6 py-3 hover:bg-[#0077B6] transition-all duration-300">
            See Dashboard
          </Button>
          <Button className="bg-[#0077B6] text-white px-6 py-3 hover:bg-[#00A8E8] transition-all duration-300">
            Live Consult Candidates
          </Button>
          <Button 
            onClick={toggleOnlineStatus}
            className={`px-6 py-3 transition-all duration-300 cursor-pointer ${
              isOnline 
                ? 'bg-[#4CAF50] hover:bg-[#45a049] text-white' 
                : 'bg-[#f44336] hover:bg-[#da190b] text-white'
            }`}
          >
            Status: {isOnline ? 'Online' : 'Offline'}
          </Button>
        </div>
      </motion.div>

      {/* Debug display */}
      <div className="text-sm text-gray-500 text-center">
        Current Status: {String(isOnline)}
      </div>

      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-6 my-12">
          {features.map((feature, index) => (
            <FeatureCard 
              key={feature.link} 
              feature={feature} 
              isDarkMode={isDarkMode} 
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
        <StatCard
          title="Total Appointments"
          value="123"
          subtext="+10% from last month"
          icon={Calendar}
          isDarkMode={isDarkMode}
        
         
        />
        <StatCard
          title="Pending Appointments"
          value="25"
          subtext="12 require attention"
          icon={Clock}
          isDarkMode={isDarkMode}
        />
        <StatCard
          title="Active Doctors"
          value="8"
          subtext="3 currently consulting"
          icon={UserCheck}
          isDarkMode={isDarkMode}
        />
      </div>

      <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
        <CardHeader>
          <div className="flex sm:flex-row flex-col gap-4 items-center justify-between p-4">
            <CardTitle>Recent Appointments</CardTitle>
            <Input 
              placeholder="Search appointments..." 
              className={`w-64 ${isDarkMode ? 'bg-gray-700 border-gray-600' : ''}`}
            />
          </div>
        </CardHeader>
        <CardContent>
         
          <div className="text-center text-muted-foreground">No recent appointments</div>
        </CardContent>
      </Card>
    </div>
  ), [healthCenterName, isOnline, toggleOnlineStatus]);

  return (
    <div className={`min-h-screen p-6 ${
      isDarkMode ? 'bg-[#0A192F] text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <DashboardContent />
    </div>
  );
}
