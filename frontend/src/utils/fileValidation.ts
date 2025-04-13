
/**
 * Validates if the file is an image or video
 * @param file File to validate
 * @returns Boolean indicating if file is valid
 */
export const isMediaFile = (file: File): boolean => {
  const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
  const validVideoTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'];
  
  return [...validImageTypes, ...validVideoTypes].includes(file.type);
};

/**
 * Checks if the file is an image
 * @param file File to check
 * @returns Boolean indicating if file is an image
 */
export const isImageFile = (file: File): boolean => {
  const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
  return validImageTypes.includes(file.type);
};

/**
 * Checks if the file is a video
 * @param file File to check
 * @returns Boolean indicating if file is a video
 */
export const isVideoFile = (file: File): boolean => {
  const validVideoTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'];
  return validVideoTypes.includes(file.type);
};

/**
 * Gets the file type category
 * @param file File to check
 * @returns String indicating file type
 */
export const getFileType = (file: File): 'image' | 'video' | 'other' => {
  if (isImageFile(file)) return 'image';
  if (isVideoFile(file)) return 'video';
  return 'other';
};

/**
 * Creates a thumbnail for a video file
 * @param videoFile Video file
 * @returns Promise resolving to a data URL
 */
export const createVideoThumbnail = (videoFile: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      video.currentTime = 1; // Set to 1 second
    };
    
    video.oncanplay = () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      resolve(dataUrl);
    };
    
    video.onerror = () => {
      reject(new Error('Error generating video thumbnail'));
    };
    
    video.src = URL.createObjectURL(videoFile);
  });
};
