
import React from 'react';
import { useAuth } from '@/contexts/MockAuthContext';
import VolunteerDashboard from './VolunteerDashboard';
import MentorDashboard from './MentorDashboard';
import SecretaryDashboard from './SecretaryDashboard';

const Dashboard = () => {
  const { user } = useAuth();
  
  // Render the appropriate dashboard based on user role
  if (user?.role === 'secretary') {
    return <SecretaryDashboard />;
  }
  
  if (user?.role === 'mentor') {
    return <MentorDashboard />;
  }
  
  // Default to volunteer dashboard
  return <VolunteerDashboard />;
};

export default Dashboard;
