
import React, { useState, useEffect } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, Clock, MapPin, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import MediaSlider from './MediaSlider';
import { useAuth } from '@/contexts/MockAuthContext';

// Mock events data
const MOCK_EVENTS = [
  {
    id: 1,
    title: 'Campus Cleaning Drive',
    date: '2025-04-20',
    time: '09:00 AM - 12:00 PM',
    location: 'Main Campus',
    image: '/placeholder.svg',
    description: 'Join us for a campus-wide cleaning initiative to maintain our beautiful campus.',
    media: [
      {
        id: 'img1',
        type: 'image' as const,
        url: '/placeholder.svg'
      },
      {
        id: 'img2',
        type: 'image' as const,
        url: '/placeholder.svg'
      }
    ]
  },
  {
    id: 2,
    title: 'Blood Donation Camp',
    date: '2025-04-25',
    time: '10:00 AM - 04:00 PM',
    location: 'Medical Center',
    image: '/placeholder.svg',
    description: 'Donate blood and save lives. Refreshments will be provided to all donors.',
    media: []
  },
  {
    id: 3,
    title: 'Tree Plantation Drive',
    date: '2025-05-05',
    time: '08:00 AM - 11:00 AM',
    location: 'Campus Garden',
    image: '/placeholder.svg',
    description: "Let's make our campus greener by planting more trees.",
    media: []
  },
  {
    id: 4,
    title: 'Career Guidance Workshop',
    date: '2025-05-10',
    time: '02:00 PM - 04:00 PM',
    location: 'Lecture Hall 1',
    image: '/placeholder.svg',
    description: 'Career guidance workshop for high school students from nearby villages.',
    media: []
  }
];

const EventsCarousel = () => {
  const [api, setApi] = useState<any>();
  const [current, setCurrent] = useState(0);
  const [events, setEvents] = useState(MOCK_EVENTS);
  const [selectedEvent, setSelectedEvent] = useState<typeof MOCK_EVENTS[0] | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!api) return;
    
    const intervalId = setInterval(() => {
      api.scrollNext();
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, [api]);

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Update current slide index when the API provides it
  useEffect(() => {
    if (!api) return;
    
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
    
    return () => {
      api.off("select", () => {});
    };
  }, [api]);

  // Handle media upload for an event
  const handleMediaUpload = (newMedia: any) => {
    if (!selectedEvent) return;
    
    // Update the events state with the new media
    setEvents(prev => 
      prev.map(event => 
        event.id === selectedEvent.id 
          ? { ...event, media: [...event.media, newMedia] } 
          : event
      )
    );
    
    // Update the selected event with the new media
    setSelectedEvent(prev => 
      prev ? { ...prev, media: [...prev.media, newMedia] } : null
    );
  };

  // Handle media deletion
  const handleMediaDelete = (mediaId: string) => {
    if (!selectedEvent) return;
    
    // Update the events state by removing the media
    setEvents(prev => 
      prev.map(event => 
        event.id === selectedEvent.id 
          ? { ...event, media: event.media.filter(m => m.id !== mediaId) } 
          : event
      )
    );
    
    // Update the selected event by removing the media
    setSelectedEvent(prev => 
      prev ? { ...prev, media: prev.media.filter(m => m.id !== mediaId) } : null
    );
  };

  return (
    <div className="w-full px-4 py-2">
      <h2 className="text-xl font-semibold mb-3">Upcoming Events</h2>
      <Carousel
        setApi={setApi}
        className="w-full"
      >
        <CarouselContent>
          {events.map((event) => (
            <CarouselItem key={event.id}>
              <Card className="border-none shadow-md">
                <CardContent className="p-0">
                  <div className="relative">
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      className="w-full h-40 object-cover rounded-t-lg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-t-lg flex flex-col justify-end p-4">
                      <h3 className="text-white text-xl font-bold">{event.title}</h3>
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex items-center text-sm">
                      <CalendarDays className="h-4 w-4 mr-2 text-nss-primary" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2 text-nss-primary" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-nss-primary" />
                      <span>{event.location}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{event.description}</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2 w-full flex items-center justify-center gap-2"
                      onClick={() => setSelectedEvent(event)}
                    >
                      <Eye className="h-4 w-4" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex left-2" />
        <CarouselNext className="hidden md:flex right-2" />
        <div className="flex justify-center mt-2">
          <div className="flex gap-1">
            {events.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-all ${
                  current === index ? "bg-nss-primary w-4" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </Carousel>

      {/* Event Details Dialog with Media Gallery */}
      <Dialog open={selectedEvent !== null} onOpenChange={(open) => !open && setSelectedEvent(null)}>
        {selectedEvent && (
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedEvent.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center">
                  <CalendarDays className="h-4 w-4 mr-2 text-nss-primary" />
                  <span>{formatDate(selectedEvent.date)}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-nss-primary" />
                  <span>{selectedEvent.time}</span>
                </div>
                <div className="flex items-center col-span-2">
                  <MapPin className="h-4 w-4 mr-2 text-nss-primary" />
                  <span>{selectedEvent.location}</span>
                </div>
              </div>
              
              <p className="text-sm text-gray-600">{selectedEvent.description}</p>
              
              {/* Media Gallery Section */}
              <MediaSlider 
                media={selectedEvent.media}
                canUpload={user?.role === 'mentor' || user?.role === 'secretary'}
                onMediaUpload={handleMediaUpload}
                onMediaDelete={handleMediaDelete}
              />
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default EventsCarousel;
