
import React from 'react';
import Header from '@/components/Header';
import EventsCarousel from '@/components/EventsCarousel';
import FeatureCard from '@/components/FeatureCard';
import { CalendarClock, ImagePlus, BookHeart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/MockAuthContext';
import Footer from '@/components/Footer';

const SecretaryDashboard = () => {
  const { user } = useAuth();
  
  const features = [
    {
      title: 'Manage Events',
      icon: CalendarClock,
      path: '/events/manage',
      bgColor: 'bg-blue-600'
    },
    {
      title: 'Upload Gallery',
      icon: ImagePlus,
      path: '/gallery/upload',
      bgColor: 'bg-purple-600'
    },
    {
      title: 'Manage Donations',
      icon: BookHeart,
      path: '/donation/manage',
      bgColor: 'bg-amber-600'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-1 pb-6">
        <EventsCarousel />
        
        <div className="px-4 py-4">
          <Card className="mb-6">
            <CardContent className="p-4">
              <h3 className="text-lg font-medium mb-3">NSS Portal Overview</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Role</p>
                  <p className="text-2xl font-bold text-nss-primary">General Secretary</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Total Volunteers</p>
                  <p className="text-xl font-bold text-green-600">45</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <h2 className="text-xl font-semibold mb-4">Secretary Features</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
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

export default SecretaryDashboard;
