import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "sonner";
import { User, UserRole, VolunteerData, MentorData } from '@/types/user';

// Define the context type
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

// MOCK_USERS based on the provided Excel data
const MOCK_USERS: User[] = [
  // Volunteers
  {
    id: '1',
    name: 'Aarav Mehta',
    email: 'aaravmehta@iitp.ac.in',
    role: 'volunteer',
    rollNumber: '2101CS01',
    wing: 'Computer Science',
    mentor: 'Kavya Bansal',
    totalHours: 0,
    eventsAttended: 0
  },
  {
    id: '2',
    name: 'Siya Sharma',
    email: 'siyasharma@iitp.ac.in',
    role: 'volunteer',
    rollNumber: '2101ME02',
    wing: 'Mechanical',
    mentor: 'Aditya Pillai',
    totalHours: 0,
    eventsAttended: 0
  },
  {
    id: '3',
    name: 'Rohan Verma',
    email: 'rohanverma@iitp.ac.in',
    role: 'volunteer',
    rollNumber: '2101CE03',
    wing: 'Civil',
    mentor: 'Kavya Bansal',
    totalHours: 0,
    eventsAttended: 0
  },
  {
    id: '4',
    name: 'Ishita Patel',
    email: 'ishitapatel@iitp.ac.in',
    role: 'volunteer',
    rollNumber: '2101EE04',
    wing: 'Electrical',
    mentor: 'Yash Mittal',
    totalHours: 0,
    eventsAttended: 0
  },
  {
    id: '5',
    name: 'Krish Nair',
    email: 'krishnair@iitp.ac.in',
    role: 'volunteer',
    rollNumber: '2101CH05',
    wing: 'Chemical',
    mentor: 'Kavya Bansal',
    totalHours: 0,
    eventsAttended: 0
  },
  {
    id: '6',
    name: 'Anaya Singh',
    email: 'anayasingh@iitp.ac.in',
    role: 'volunteer',
    rollNumber: '2101BT06',
    wing: 'Biotechnology',
    mentor: 'Sneha Deshmukh',
    totalHours: 0,
    eventsAttended: 0
  },
  {
    id: '7',
    name: 'Dhruv Reddy',
    email: 'dhruvreddy@iitp.ac.in',
    role: 'volunteer',
    rollNumber: '2101CS07',
    wing: 'Computer Science',
    mentor: 'Pranav Iyer',
    totalHours: 0,
    eventsAttended: 0
  },
  {
    id: '8',
    name: 'Meher Khan',
    email: 'meherkhan@iitp.ac.in',
    role: 'volunteer',
    rollNumber: '2101ME08',
    wing: 'Mechanical',
    mentor: 'Pranav Iyer',
    totalHours: 0,
    eventsAttended: 0
  },
  {
    id: '9',
    name: 'Vivaan Joshi',
    email: 'vivaanjoshi@iitp.ac.in',
    role: 'volunteer',
    rollNumber: '2101CE09',
    wing: 'Civil',
    mentor: 'Aditya Pillai',
    totalHours: 0,
    eventsAttended: 0
  },
  {
    id: '10',
    name: 'Tanvi Das',
    email: 'tanvidas@iitp.ac.in',
    role: 'volunteer',
    rollNumber: '2101EE10',
    wing: 'Electrical',
    mentor: 'Kavya Bansal',
    totalHours: 0,
    eventsAttended: 0
  },
  
  // Mentors
  {
    id: '11',
    name: 'Pranav Iyer',
    email: 'pranaviyer@iitp.ac.in',
    role: 'mentor',
    rollNumber: '2001CS11',
    wing: 'Computer Science',
    volunteers: ['7', '8'] // IDs of volunteers
  },
  {
    id: '12',
    name: 'Kavya Bansal',
    email: 'kavyabansal@iitp.ac.in',
    role: 'mentor',
    rollNumber: '2001ME12',
    wing: 'Mechanical',
    volunteers: ['1', '3', '5', '10'] // IDs of volunteers
  },
  {
    id: '13',
    name: 'Aditya Pillai',
    email: 'adityapillai@iitp.ac.in',
    role: 'mentor',
    rollNumber: '2001CE13',
    wing: 'Civil',
    volunteers: ['2', '9'] // IDs of volunteers
  },
  {
    id: '14',
    name: 'Sneha Deshmukh',
    email: 'snehadeshmukh@iitp.ac.in',
    role: 'mentor',
    rollNumber: '2001EE14',
    wing: 'Electrical',
    volunteers: ['6'] // IDs of volunteers
  },
  {
    id: '15',
    name: 'Yash Mittal',
    email: 'yashmittal@iitp.ac.in',
    role: 'mentor',
    rollNumber: '2001CH15',
    wing: 'Chemical',
    volunteers: ['4'] // IDs of volunteers
  },
  
  // General Secretaries
  {
    id: '16',
    name: 'Riya Kapoor',
    email: 'riyakapoor@iitp.ac.in',
    role: 'secretary',
    rollNumber: '1901ME16',
    wing: 'Mechanical'
  },
  {
    id: '17',
    name: 'Arjun Malhotra',
    email: 'arjunmalhotra@iitp.ac.in',
    role: 'secretary',
    rollNumber: '1901CS17',
    wing: 'Computer Science'
  }
];

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

  // Login function - only allow login with emails from the mock database
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const foundUser = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (foundUser) {
        // Verify password matches roll number
        if (password !== foundUser.rollNumber) {
          toast.error("Invalid password. Please use your roll number as password.");
          return false;
        }

        // If user is a mentor, attach their volunteer objects
        if (foundUser.role === 'mentor' && foundUser.volunteers) {
          const volunteerObjects = foundUser.volunteers.map(volId => 
            MOCK_USERS.find(u => u.id === volId)
          ).filter(vol => vol !== undefined);
          
          foundUser.volunteerObjects = volunteerObjects as User[];
        }
        
        setUser(foundUser);
        setIsAuthenticated(true);
        
        // Store in session storage
        sessionStorage.setItem('nssUser', JSON.stringify(foundUser));
        
        toast.success(`Welcome back, ${foundUser.name}!`);
        return true;
      } else {
        toast.error("Invalid credentials. Please use an authorized email.");
        return false;
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

export default AuthProvider;
