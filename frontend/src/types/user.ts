
export type UserRole = 'volunteer' | 'mentor' | 'secretary';

export type AttendanceType = 'present' | 'absent' | 'late';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  rollNumber?: string;
  wing?: string;
  mentor?: string;
  volunteers?: string[];
  volunteerObjects?: User[];
  totalHours?: number;
  eventsAttended?: number;
}

export interface VolunteerData {
  id: string;
  userId: string;
  mentorId: string;
  totalHours: number;
  eventsAttended: number;
}

export interface MentorData {
  id: string;
  userId: string;
  menteeCount: number;
}

export interface AttendanceRecord {
  id: string;
  eventId: string;
  eventName: string;
  date: string;
  venue: string;
  hours: number;
  volunteerId: string;
  volunteerName?: string;
  attendanceType: AttendanceType;
  timestamp: number;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image: string;
  durationHours: number;
  isActive: boolean;
  createdBy?: string;
}

export interface QRCodeData {
  eventId: string;
  eventName: string;
  timestamp: number;
  hours: number;
  randomStr?: string;
}

export interface Gallery {
  id: string;
  eventId: string;
  title: string;
  photos: Photo[];
}

export interface Photo {
  id: string;
  galleryId: string;
  uploadedBy: string;
  imagePath: string;
  uploadDate: string;
}
