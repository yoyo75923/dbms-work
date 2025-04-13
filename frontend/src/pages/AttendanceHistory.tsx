
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/MockAuthContext';
import Header from '@/components/Header';
import { AttendanceRecord } from '@/types/user';
import Footer from '@/components/Footer';

const AttendanceHistory = () => {
  const { user } = useAuth();
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);

  // Load saved attendance records from session storage
  useEffect(() => {
    if (user) {
      const savedRecords = sessionStorage.getItem('attendanceRecords');
      if (savedRecords) {
        const parsedRecords: AttendanceRecord[] = JSON.parse(savedRecords);
        // Filter records for the current user
        const userRecords = parsedRecords.filter(record => record.volunteerId === user.id);
        // Sort by date (newest first)
        userRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setAttendanceRecords(userRecords);
      }
    }
  }, [user]);
  
  // Calculate total hours
  const totalHours = attendanceRecords.reduce((sum, record) => sum + record.hours, 0);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">Attendance History</h1>
          <p className="text-gray-500 mb-6">View your attendance records and total service hours</p>
          
          <div className="grid gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Total Events</p>
                    <p className="text-2xl font-bold text-nss-primary">{attendanceRecords.length}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Total Hours</p>
                    <p className="text-2xl font-bold text-green-600">{totalHours}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Attendance Records</CardTitle>
                <CardDescription>
                  Your participation in NSS activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                {attendanceRecords.length > 0 ? (
                  <div className="space-y-4">
                    {attendanceRecords.map((record) => (
                      <div key={record.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">{record.eventName}</h3>
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                            +{record.hours} hours
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>Date: {new Date(record.date).toLocaleDateString()}</p>
                          <p>Venue: {record.venue}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No attendance records yet</p>
                    <p className="text-sm">Attend events to view your history here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AttendanceHistory;
