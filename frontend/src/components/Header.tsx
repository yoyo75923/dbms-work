
import React from 'react';
import { useAuth } from '@/contexts/MockAuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Get first letter of name for avatar fallback
  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <header className="flex justify-between items-center p-4 bg-white shadow-sm z-10">
      <div className="flex items-center">
        <h2 className="text-lg font-medium">Hi, {user?.name}</h2>
      </div>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="relative rounded-full h-10 w-10 p-0">
            <Avatar>
              <AvatarImage src="/placeholder.svg" alt={user?.name || "User"} />
              <AvatarFallback className="bg-nss-primary text-white">
                {user ? getInitials(user.name) : "?"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="/placeholder.svg" alt={user?.name || "User"} />
                <AvatarFallback className="bg-nss-primary text-white text-lg">
                  {user ? getInitials(user.name) : "?"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium text-lg">{user?.name}</h3>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                <p className="text-xs font-medium text-nss-primary mt-1 capitalize">{user?.role}</p>
              </div>
            </div>
            
            <div className="border-t pt-3 space-y-2">
              {user?.role === 'volunteer' && (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Roll Number:</span>
                    <span className="text-sm font-medium">{user.rollNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">NSS Wing:</span>
                    <span className="text-sm font-medium">{user.wing}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Mentor:</span>
                    <span className="text-sm font-medium">{user.mentor}</span>
                  </div>
                </>
              )}
              
              {user?.role === 'mentor' && (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">NSS Wing:</span>
                    <span className="text-sm font-medium">{user.wing}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Volunteers:</span>
                    <span className="text-sm font-medium">{user.volunteers?.length || 0}</span>
                  </div>
                </>
              )}
              
              {user?.role === 'secretary' && (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Position:</span>
                    <span className="text-sm font-medium">NSS General Secretary</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Wings Managed:</span>
                    <span className="text-sm font-medium">All Wings</span>
                  </div>
                </>
              )}
            </div>
            
            <div className="border-t pt-3">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-destructive" 
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </header>
  );
};

export default Header;
