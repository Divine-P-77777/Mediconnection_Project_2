"use client"
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FileUp, FileText, Upload } from 'lucide-react'; // or wherever your icons come from

export const UploadDocumentsContent = ({ isDarkMode }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileUp className={isDarkMode ? 'text-cyan-400' : 'text-blue-600'} />
            Upload Prescription
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`border-2 border-dashed rounded-lg p-6 text-center 
            ${isDarkMode ? 'border-gray-700 hover:border-gray-600' : 'border-gray-300 hover:border-gray-400'}`}>
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2">Drag and drop or click to upload</p>
            <input type="file" className="hidden" />
          </div>
        </CardContent>
      </Card>

      <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className={isDarkMode ? 'text-cyan-400' : 'text-blue-600'} />
            Upload Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`border-2 border-dashed rounded-lg p-6 text-center 
            ${isDarkMode ? 'border-gray-700 hover:border-gray-600' : 'border-gray-300 hover:border-gray-400'}`}>
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2">Drag and drop or click to upload</p>
            <input type="file" className="hidden" />
          </div>
        </CardContent>
      </Card>

      <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className={isDarkMode ? 'text-cyan-400' : 'text-blue-600'} />
            Upload Bills
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`border-2 border-dashed rounded-lg p-6 text-center 
            ${isDarkMode ? 'border-gray-700 hover:border-gray-600' : 'border-gray-300 hover:border-gray-400'}`}>
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2">Drag and drop or click to upload</p>
            <input type="file" className="hidden" />
          </div>
        </CardContent>
      </Card>
    </div>

    <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
      <CardHeader>
        <CardTitle>Recent Uploads</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Add your recent uploads list here */}
        <div className="text-center text-muted-foreground">No recent uploads</div>
      </CardContent>
    </Card>
  </div>
);

export default UploadDocumentsContent;
