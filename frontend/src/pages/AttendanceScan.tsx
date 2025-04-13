import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/MockAuthContext';
import { useToast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import { AttendanceRecord } from '@/types/user';
import Footer from '@/components/Footer';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const AttendanceScan = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);

  // Load saved attendance records from session storage
  useEffect(() => {
    const savedRecords = sessionStorage.getItem('attendanceRecords');
    if (savedRecords && user) {
      const parsedRecords: AttendanceRecord[] = JSON.parse(savedRecords);
      // Filter records for the current user
      const userRecords = parsedRecords.filter(record => record.volunteerId === user.id);
      setAttendanceRecords(userRecords);
    }
  }, [user]);

  // Calculate total hours
  const totalHours = attendanceRecords.reduce((sum, record) => sum + record.hours, 0);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">My Attendance</h1>
          <p className="text-gray-500 mb-6">View your attendance records and total hours</p>
          
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
                <CardTitle>Attendance History</CardTitle>
                <CardDescription>
                  Your attendance records for all events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Hours</TableHead>
                      <TableHead>Venue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendanceRecords.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground">
                          No attendance records found
                        </TableCell>
                      </TableRow>
                    ) : (
                      attendanceRecords
                        .sort((a, b) => b.timestamp - a.timestamp)
                        .map((record) => (
                          <TableRow key={record.id}>
                            <TableCell>{record.eventName}</TableCell>
                            <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                            <TableCell>{record.hours}</TableCell>
                            <TableCell>{record.venue}</TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AttendanceScan;
