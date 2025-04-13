import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/MockAuthContext';
import Header from '@/components/Header';
import { AttendanceRecord, User } from '@/types/user';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Sample events data - in a real app, this would come from an API or database
const SAMPLE_EVENTS = [
  { id: 'event-001', name: 'NSS Weekly Meeting' },
  { id: 'event-002', name: 'Blood Donation Camp' },
  { id: 'event-003', name: 'Tree Plantation Drive' },
  { id: 'event-004', name: 'Community Cleanup' },
  { id: 'event-005', name: 'Awareness Workshop' },
];

const AttendanceManage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [volunteers, setVolunteers] = useState<User[]>([]);
  const [selectedEvent, setSelectedEvent] = useState({
    id: 'event-001',
    name: 'NSS Weekly Meeting',
  });
  const [hours, setHours] = useState(2);
  const [selectedVolunteers, setSelectedVolunteers] = useState<string[]>([]);
  const [volunteerHours, setVolunteerHours] = useState<{[key: string]: number}>({});
  
  useEffect(() => {
    // Get volunteers for the current mentor
    if (user && user.role === 'mentor' && user.volunteerObjects) {
      setVolunteers(user.volunteerObjects);
      
      // Calculate total hours for each volunteer from attendance records
      const savedRecordsStr = sessionStorage.getItem('attendanceRecords');
      if (savedRecordsStr) {
        const savedRecords: AttendanceRecord[] = JSON.parse(savedRecordsStr);
        const hours: {[key: string]: number} = {};
        
        user.volunteerObjects.forEach(volunteer => {
          const volunteerRecords = savedRecords.filter(record => record.volunteerId === volunteer.id);
          hours[volunteer.id] = volunteerRecords.reduce((sum, record) => sum + record.hours, 0);
        });
        
        setVolunteerHours(hours);
      }
    }
  }, [user]);

  const handleMarkAttendance = () => {
    if (!selectedEvent) {
      toast({
        title: "Error",
        description: "Please select an event",
        variant: "destructive"
      });
      return;
    }

    if (selectedVolunteers.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one volunteer",
        variant: "destructive"
      });
      return;
    }

    // Create new attendance records for selected volunteers
    const newRecords: AttendanceRecord[] = selectedVolunteers.map(volunteerId => ({
      id: `${selectedEvent.id}-${volunteerId}-${Date.now()}`,
      eventId: selectedEvent.id,
      eventName: selectedEvent.name,
      date: new Date().toISOString(),
      venue: "NSS Event Venue",
      hours: hours,
      volunteerId: volunteerId,
      attendanceType: "present",
      timestamp: Date.now()
    }));

    // Update session storage for attendance records
    const savedRecordsStr = sessionStorage.getItem('attendanceRecords');
    const savedRecords: AttendanceRecord[] = savedRecordsStr ? JSON.parse(savedRecordsStr) : [];
    const updatedRecords = [...savedRecords, ...newRecords];
    sessionStorage.setItem('attendanceRecords', JSON.stringify(updatedRecords));

    // Update volunteer hours in state
    const updatedHours = { ...volunteerHours };
    selectedVolunteers.forEach(volunteerId => {
      updatedHours[volunteerId] = (updatedHours[volunteerId] || 0) + hours;
    });
    setVolunteerHours(updatedHours);

    // Update each volunteer's data in session storage
    const allUsersStr = sessionStorage.getItem('nssUsers');
    let allUsers: User[] = allUsersStr ? JSON.parse(allUsersStr) : [];
    
    selectedVolunteers.forEach(volunteerId => {
      // Find and update the volunteer's data
      allUsers = allUsers.map(u => {
        if (u.id === volunteerId) {
          return {
            ...u,
            totalHours: (u.totalHours || 0) + hours,
            eventsAttended: (u.eventsAttended || 0) + 1
          };
        }
        return u;
      });

      // If the user is currently logged in, update their session data
      const currentUserStr = sessionStorage.getItem('nssUser');
      if (currentUserStr) {
        const currentUser = JSON.parse(currentUserStr);
        if (currentUser.id === volunteerId) {
          const updatedUser = {
            ...currentUser,
            totalHours: (currentUser.totalHours || 0) + hours,
            eventsAttended: (currentUser.eventsAttended || 0) + 1
          };
          sessionStorage.setItem('nssUser', JSON.stringify(updatedUser));
        }
      }
    });

    // Save updated users data
    sessionStorage.setItem('nssUsers', JSON.stringify(allUsers));

    toast({
      title: "Attendance Marked",
      description: `Successfully marked attendance for ${selectedVolunteers.length} volunteers`,
    });

    // Clear selection
    setSelectedVolunteers([]);
  };

  const toggleSelectAll = () => {
    if (selectedVolunteers.length === volunteers.length) {
      setSelectedVolunteers([]);
    } else {
      setSelectedVolunteers(volunteers.map(v => v.id));
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">Attendance Management</h1>
          <p className="text-gray-500 mb-6">Mark attendance for volunteers</p>
          
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Mark Attendance</CardTitle>
                <CardDescription>
                  Select an event and mark attendance for volunteers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="event">Select Event</Label>
                    <Select 
                      value={selectedEvent.id}
                      onValueChange={(value) => {
                        const event = SAMPLE_EVENTS.find(e => e.id === value);
                        if (event) {
                          setSelectedEvent(event);
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select an event" />
                      </SelectTrigger>
                      <SelectContent>
                        {SAMPLE_EVENTS.map(event => (
                          <SelectItem key={event.id} value={event.id}>
                            {event.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hours">Hours to Award</Label>
                    <Select 
                      value={hours.toString()}
                      onValueChange={(value) => setHours(parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select hours" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(h => (
                          <SelectItem key={h} value={h.toString()}>
                            {h} hour{h > 1 ? 's' : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox
                            checked={selectedVolunteers.length === volunteers.length}
                            onCheckedChange={toggleSelectAll}
                          />
                        </TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Roll Number</TableHead>
                        <TableHead>Wing</TableHead>
                        <TableHead>Total Hours</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {volunteers.map((volunteer) => (
                        <TableRow key={volunteer.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedVolunteers.includes(volunteer.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedVolunteers(prev => [...prev, volunteer.id]);
                                } else {
                                  setSelectedVolunteers(prev => prev.filter(id => id !== volunteer.id));
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell>{volunteer.name}</TableCell>
                          <TableCell>{volunteer.rollNumber}</TableCell>
                          <TableCell>{volunteer.wing}</TableCell>
                          <TableCell>{volunteerHours[volunteer.id] || 0} hours</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex justify-end space-x-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedVolunteers([])}
                  >
                    Clear Selection
                  </Button>
                  <Button 
                    onClick={handleMarkAttendance}
                    disabled={selectedVolunteers.length === 0}
                  >
                    Mark Attendance ({selectedVolunteers.length} selected)
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Volunteer Hours Summary</CardTitle>
                <CardDescription>
                  Overview of total hours for each volunteer
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Roll Number</TableHead>
                      <TableHead>Wing</TableHead>
                      <TableHead>Total Hours</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {volunteers
                      .sort((a, b) => (volunteerHours[b.id] || 0) - (volunteerHours[a.id] || 0))
                      .map((volunteer) => (
                        <TableRow key={volunteer.id}>
                          <TableCell className="font-medium">{volunteer.name}</TableCell>
                          <TableCell>{volunteer.rollNumber}</TableCell>
                          <TableCell>{volunteer.wing}</TableCell>
                          <TableCell>
                            <span className="font-semibold text-green-600">
                              {volunteerHours[volunteer.id] || 0} hours
                            </span>
                          </TableCell>
                        </TableRow>
                    ))}
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

export default AttendanceManage;
