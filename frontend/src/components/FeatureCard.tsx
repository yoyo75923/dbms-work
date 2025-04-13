
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  icon: LucideIcon;
  path: string;
  bgColor?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  icon: Icon,
  path,
  bgColor = "bg-nss-primary"
}) => {
  const navigate = useNavigate();

  return (
    <Card 
      className="shadow-md hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => navigate(path)}
    >
      <CardContent className="p-0">
        <div className="flex flex-col items-center justify-center p-4">
          <div className={`${bgColor} p-3 rounded-full mb-3`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <span className="text-sm font-medium text-center">{title}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
