
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const FeaturePlaceholder = () => {
  const { feature } = useParams();
  const navigate = useNavigate();
  
  const getFeatureTitle = () => {
    if (!feature) return 'Feature';
    
    // Convert path to a readable title
    return feature
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <Button 
        variant="ghost" 
        size="sm" 
        className="mb-4"
        onClick={() => navigate('/dashboard')}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Button>
      
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
        <h1 className="text-2xl font-bold mb-4">{getFeatureTitle()}</h1>
        <p className="text-gray-600 mb-8">
          This feature is currently under development. Check back soon!
        </p>
        
        <div className="w-16 h-16 border-4 border-nss-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        
        <Button onClick={() => navigate('/dashboard')}>
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default FeaturePlaceholder;
