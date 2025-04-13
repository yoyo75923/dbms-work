
import React, { useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from '@/contexts/MockAuthContext';
import { Upload, X, FileImage, Film } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Media {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
}

interface MediaSliderProps {
  media: Media[];
  canUpload?: boolean;
  onMediaUpload?: (newMedia: Media) => void;
  onMediaDelete?: (mediaId: string) => void;
}

const MediaSlider: React.FC<MediaSliderProps> = ({ 
  media = [], 
  canUpload = false,
  onMediaUpload,
  onMediaDelete
}) => {
  const { user } = useAuth();
  const [previewMedia, setPreviewMedia] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Check if user has permission to upload media
  const hasUploadPermission = user?.role === 'mentor' || user?.role === 'secretary';

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if file is an image or video
    const fileType = file.type.split('/')[0];
    if (fileType !== 'image' && fileType !== 'video') {
      toast.error("Only images and videos are allowed");
      return;
    }

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewMedia(file);
    setPreviewUrl(url);
  };

  // Handle file upload
  const handleUpload = () => {
    if (!previewMedia || !previewUrl || !onMediaUpload) return;
    
    setIsUploading(true);
    
    // In a real app, you would upload to a server here
    // For now, we'll simulate an upload with a timeout
    setTimeout(() => {
      const fileType = previewMedia.type.split('/')[0] as 'image' | 'video';
      
      const newMedia: Media = {
        id: `media-${Date.now()}`,
        type: fileType,
        url: previewUrl,
        thumbnail: fileType === 'video' ? previewUrl : undefined
      };
      
      onMediaUpload(newMedia);
      setPreviewMedia(null);
      setPreviewUrl(null);
      setIsUploading(false);
      toast.success("Media uploaded successfully");
    }, 1500);
  };

  // Cancel upload
  const handleCancelUpload = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewMedia(null);
    setPreviewUrl(null);
  };

  // Render media item
  const renderMediaItem = (item: Media) => {
    if (item.type === 'image') {
      return (
        <img 
          src={item.url} 
          alt="Media content" 
          className="w-full h-full object-contain"
        />
      );
    } else {
      return (
        <video 
          src={item.url} 
          controls 
          className="w-full h-full object-contain"
          poster={item.thumbnail}
        />
      );
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Media Gallery</h3>
          {canUpload && hasUploadPermission && !previewMedia && (
            <div className="relative">
              <input
                type="file"
                id="media-upload"
                accept="image/*, video/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileChange}
              />
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                <span>Upload Media</span>
              </Button>
            </div>
          )}
        </div>

        {/* Preview section */}
        {previewMedia && previewUrl && (
          <div className="mb-4 border rounded-md p-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium">Preview</h4>
              <Button variant="ghost" size="sm" onClick={handleCancelUpload}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
              {previewMedia.type.startsWith('image/') ? (
                <img src={previewUrl} alt="Preview" className="max-h-full max-w-full object-contain" />
              ) : (
                <video src={previewUrl} controls className="max-h-full max-w-full object-contain" />
              )}
            </div>
            <div className="mt-2 flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={handleCancelUpload}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleUpload} disabled={isUploading}>
                {isUploading ? 'Uploading...' : 'Upload'}
              </Button>
            </div>
          </div>
        )}

        {media.length > 0 ? (
          <Carousel className="w-full">
            <CarouselContent>
              {media.map((item) => (
                <CarouselItem key={item.id}>
                  <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center relative">
                    {renderMediaItem(item)}
                    {canUpload && hasUploadPermission && onMediaDelete && (
                      <Button 
                        variant="destructive" 
                        size="icon" 
                        className="absolute top-2 right-2 h-8 w-8"
                        onClick={() => onMediaDelete(item.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        ) : (
          <div className="aspect-video bg-gray-100 rounded-md flex flex-col items-center justify-center text-gray-500">
            <div className="flex gap-2">
              <FileImage className="h-8 w-8" />
              <Film className="h-8 w-8" />
            </div>
            <p className="mt-2">No media available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MediaSlider;
