import React from 'react';
import Header from '@/components/Header';
import EventsCarousel from '@/components/EventsCarousel';
import FeatureCard from '@/components/FeatureCard';
import { CalendarCheck, ImageIcon, BookHeart } from 'lucide-react';
import Footer from '@/components/Footer';

const VolunteerDashboard = () => {
  const features = [
    {
      title: 'Attendance History',
      icon: CalendarCheck,
      path: '/attendance/history',
      bgColor: 'bg-blue-600'
    },
    {
      title: 'Gallery',
      icon: ImageIcon,
      path: '/gallery',
      bgColor: 'bg-purple-600'
    },
    {
      title: 'Donation',
      icon: BookHeart,
      path: '/donation',
      bgColor: 'bg-amber-600'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-1 pb-6">
        <EventsCarousel />
        
        <div className="px-4 py-6">
          <h2 className="text-xl font-semibold mb-4">Features</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                title={feature.title}
                icon={feature.icon}
                path={feature.path}
                bgColor={feature.bgColor}
              />
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default VolunteerDashboard;
