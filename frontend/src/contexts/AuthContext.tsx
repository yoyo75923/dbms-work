
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "sonner";

// Define user types
export type UserRole = 'volunteer' | 'mentor' | 'secretary';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  wing?: string;
  rollNumber?: string;
  mentor?: string;
  volunteers?: User[];
}

// Mock database of users
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Aditya Singh',
    email: 'volunteer@iitp.ac.in',
    role: 'volunteer',
    wing: 'Environmental',
    rollNumber: '2101CS01',
    mentor: 'Dr. Rajesh Kumar'
  },
  {
    id: '2',
    name: 'Dr. Rajesh Kumar',
    email: 'mentor@iitp.ac.in',
    role: 'mentor',
    wing: 'Environmental',
    volunteers: []
  },
  {
    id: '3',
    name: 'Priya Sharma',
    email: 'priya@iitp.ac.in',
    role: 'volunteer',
    wing: 'Education',
    rollNumber: '2101CS34',
    mentor: 'Dr. Anjali Gupta'
  },
  {
    id: '4',
    name: 'Rahul Verma',
    email: 'secretary@iitp.ac.in',
    role: 'secretary',
    wing: 'All Wings',
  }
];

// Define the context type
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is already logged in (from session storage)
  useEffect(() => {
    const storedUser = sessionStorage.getItem('nssUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    // For demo purposes, we're just checking if the email exists in our mock database
    // In a real app, you would check credentials against a real database
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const foundUser = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (foundUser) {
        // If user is a mentor, attach their volunteers
        if (foundUser.role === 'mentor') {
          foundUser.volunteers = MOCK_USERS.filter(u => 
            u.role === 'volunteer' && u.mentor === foundUser.name
          );
        }
        
        setUser(foundUser);
        setIsAuthenticated(true);
        
        // Store in session storage
        sessionStorage.setItem('nssUser', JSON.stringify(foundUser));
        
        toast.success(`Welcome back, ${foundUser.name}!`);
        return true;
      } else {
        // For demo purposes, create a new user with the provided email
        const newUser: User = {
          id: Math.random().toString(36).substr(2, 9),
          name: email.split('@')[0], // Use part of email as name
          email: email,
          role: 'volunteer', // Default role for new users
          wing: 'General',
          rollNumber: 'N/A',
          mentor: 'Not Assigned'
        };
        
        setUser(newUser);
        setIsAuthenticated(true);
        
        // Store in session storage
        sessionStorage.setItem('nssUser', JSON.stringify(newUser));
        
        toast.success(`Welcome, ${newUser.name}!`);
        return true;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
      return false;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    sessionStorage.removeItem('nssUser');
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
