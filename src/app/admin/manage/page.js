"use client"
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Upload, UserPlus } from 'lucide-react';
import { healthCentersData } from '@/app/constants';

const ManageDoctors = () => {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isOnline, setIsOnline] = useState(true);
  const [healthCenterName, setHealthCenterName] = useState('');
  

  const toggleOnlineStatus = () => {
    setIsOnline(!isOnline);
  };

  const DashboardContent = () => (
    <div className="text-center text-muted-foreground">Dashboard content goes here</div>
  );

  const UploadDocumentsContent = () => (
    <div className="text-center text-muted-foreground">Upload documents section</div>
  );

  const ManageDoctorsContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Input 
          placeholder="Search doctors..." 
          className={`w-64 ${isDarkMode ? 'bg-gray-700 border-gray-600' : ''}`}
        />
        <Button className={isDarkMode ? 'bg-cyan-600 hover:bg-cyan-700' : 'bg-blue-600 hover:bg-blue-700'}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add New Doctor
        </Button>
      </div>

      <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
        <CardHeader>
          <CardTitle>Doctors List</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Add your doctors list/table here */}
          <div className="text-center text-muted-foreground">No doctors added yet</div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className={`min-h-screen p-6 ${isDarkMode ? 'bg-[#0A192F] text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Tabs */}
        <div className="flex space-x-4">
          <Button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 ${
              activeTab === 'dashboard'
                ? isDarkMode 
                  ? 'bg-cyan-600 hover:bg-cyan-700' 
                  : 'bg-blue-600 hover:bg-blue-700'
                : isDarkMode
                  ? 'bg-gray-800 hover:bg-gray-700'
                  : 'bg-white hover:bg-gray-100'
            }`}
          >
            <Users className="h-4 w-4" />
            Dashboard
          </Button>
          <Button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 ${
              activeTab === 'upload'
                ? isDarkMode 
                  ? 'bg-cyan-600 hover:bg-cyan-700' 
                  : 'bg-blue-600 hover:bg-blue-700'
                : isDarkMode
                  ? 'bg-gray-800 hover:bg-gray-700'
                  : 'bg-white hover:bg-gray-100'
            }`}
          >
            <Upload className="h-4 w-4" />
            Upload Documents
          </Button>
          <Button
            onClick={() => setActiveTab('doctors')}
            className={`flex items-center gap-2 ${
              activeTab === 'doctors'
                ? isDarkMode 
                  ? 'bg-cyan-600 hover:bg-cyan-700' 
                  : 'bg-blue-600 hover:bg-blue-700'
                : isDarkMode
                  ? 'bg-gray-800 hover:bg-gray-700'
                  : 'bg-white hover:bg-gray-100'
            }`}
          >
            <UserPlus className="h-4 w-4" />
            Manage Doctors
          </Button>
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && <DashboardContent />}
        {activeTab === 'upload' && <UploadDocumentsContent />}
        {activeTab === 'doctors' && <ManageDoctorsContent />}
      </div>

      {/* Status Section */}
      <div className="mt-4 space-y-2">
        <h2 className="text-lg font-semibold">Health Center: {healthCenterName}</h2>
        <button 
          onClick={toggleOnlineStatus}
          className={`px-4 py-2 rounded-md text-white ${
            isOnline ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          {isOnline ? 'Online' : 'Offline'}
        </button>
      </div>
    </div>
  );
};

export default ManageDoctors;
