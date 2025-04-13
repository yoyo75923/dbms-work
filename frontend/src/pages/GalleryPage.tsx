
import React, { useState } from 'react';
import Header from '@/components/Header';
import MediaSlider from '@/components/MediaSlider';
import { useAuth } from '@/contexts/MockAuthContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';

// Example mock gallery items
const MOCK_GALLERY = [
  {
    id: 'gallery1',
    title: 'Campus Cleaning Drive 2024',
    description: 'Students participated in cleaning the campus surroundings',
    media: [
      { id: 'g1-img1', type: 'image' as const, url: '/placeholder.svg' },
      { id: 'g1-img2', type: 'image' as const, url: '/placeholder.svg' },
    ]
  },
  {
    id: 'gallery2',
    title: 'Tree Plantation 2024',
    description: 'Our annual tree plantation event',
    media: [
      { id: 'g2-img1', type: 'image' as const, url: '/placeholder.svg' },
    ]
  },
  {
    id: 'gallery3',
    title: 'Village Outreach Program',
    description: 'Teaching and community service in nearby villages',
    media: []
  }
];

const GalleryPage = () => {
  const { user } = useAuth();
  const [galleries, setGalleries] = useState(MOCK_GALLERY);
  const [selectedGallery, setSelectedGallery] = useState<any>(null);
  const [newGalleryDialog, setNewGalleryDialog] = useState(false);
  const [newGalleryTitle, setNewGalleryTitle] = useState('');
  const [newGalleryDescription, setNewGalleryDescription] = useState('');

  // Check if user has permission to upload
  const hasUploadPermission = user?.role === 'mentor' || user?.role === 'secretary';

  // Handle media upload for a gallery
  const handleMediaUpload = (newMedia: any) => {
    if (!selectedGallery) return;
    
    // Update the galleries state with the new media
    setGalleries(prev => 
      prev.map(gallery => 
        gallery.id === selectedGallery.id 
          ? { ...gallery, media: [...gallery.media, newMedia] } 
          : gallery
      )
    );
    
    // Update the selected gallery with the new media
    setSelectedGallery(prev => 
      prev ? { ...prev, media: [...prev.media, newMedia] } : null
    );
  };

  // Handle media deletion
  const handleMediaDelete = (mediaId: string) => {
    if (!selectedGallery) return;
    
    // Update the galleries state by removing the media
    setGalleries(prev => 
      prev.map(gallery => 
        gallery.id === selectedGallery.id 
          ? { ...gallery, media: gallery.media.filter(m => m.id !== mediaId) } 
          : gallery
      )
    );
    
    // Update the selected gallery by removing the media
    setSelectedGallery(prev => 
      prev ? { ...prev, media: prev.media.filter(m => m.id !== mediaId) } : null
    );
  };

  // Create a new gallery
  const handleCreateGallery = () => {
    if (!newGalleryTitle.trim()) return;
    
    const newGallery = {
      id: `gallery-${Date.now()}`,
      title: newGalleryTitle,
      description: newGalleryDescription,
      media: []
    };
    
    setGalleries(prev => [...prev, newGallery]);
    setNewGalleryTitle('');
    setNewGalleryDescription('');
    setNewGalleryDialog(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-1 container py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">NSS Gallery</h1>
          
          {hasUploadPermission && (
            <Dialog open={newGalleryDialog} onOpenChange={setNewGalleryDialog}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  New Album
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Album</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium">
                      Album Title
                    </label>
                    <input
                      id="title"
                      value={newGalleryTitle}
                      onChange={(e) => setNewGalleryTitle(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="Enter album title"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium">
                      Description
                    </label>
                    <textarea
                      id="description"
                      value={newGalleryDescription}
                      onChange={(e) => setNewGalleryDescription(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md min-h-[100px]"
                      placeholder="Enter album description"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button variant="outline" onClick={() => setNewGalleryDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateGallery}>
                      Create Album
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleries.map(gallery => (
            <div 
              key={gallery.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedGallery(gallery)}
            >
              <div className="aspect-video bg-gray-100 flex items-center justify-center">
                {gallery.media.length > 0 ? (
                  <img src={gallery.media[0].url} alt={gallery.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-gray-400">No images yet</div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg">{gallery.title}</h3>
                <p className="text-gray-600 text-sm mt-1">{gallery.description}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-500">{gallery.media.length} items</span>
                  <Button variant="link" size="sm" className="p-0 h-auto">
                    View Gallery
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Gallery Detail Dialog */}
      <Dialog open={selectedGallery !== null} onOpenChange={(open) => !open && setSelectedGallery(null)}>
        {selectedGallery && (
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{selectedGallery.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">{selectedGallery.description}</p>
              
              {/* Media Gallery */}
              <MediaSlider 
                media={selectedGallery.media}
                canUpload={hasUploadPermission}
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

export default GalleryPage;
