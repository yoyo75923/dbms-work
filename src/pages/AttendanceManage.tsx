const handleMarkAttendance = async () => {
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

  try {
    // Create attendance records through API
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/attendance/mark`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      },
      body: JSON.stringify({
        eventId: selectedEvent.id,
        eventName: selectedEvent.name,
        hours: hours,
        volunteers: selectedVolunteers,
        venue: "NSS Event Venue"
      })
    });

    if (!response.ok) {
      throw new Error('Failed to mark attendance');
    }

    const data = await response.json();

    // Update volunteer hours in state
    const updatedHours = { ...volunteerHours };
    selectedVolunteers.forEach(volunteerId => {
      updatedHours[volunteerId] = (updatedHours[volunteerId] || 0) + hours;
    });
    setVolunteerHours(updatedHours);

    toast({
      title: "Attendance Marked",
      description: `Successfully marked attendance for ${selectedVolunteers.length} volunteers`,
    });

    // Clear selection
    setSelectedVolunteers([]);

  } catch (error) {
    console.error('Error marking attendance:', error);
    toast({
      title: "Error",
      description: "Failed to mark attendance. Please try again.",
      variant: "destructive"
    });
  }
}; 