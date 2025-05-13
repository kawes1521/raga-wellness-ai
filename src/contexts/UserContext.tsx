
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";

export type User = {
  id: string;
  name: string;
  email: string;
  history: {
    date: Date;
    stressLevel: number;
    energyLevel: number;
    gender: 'M' | 'F';
    ragaCluster: number;
    ragaName: string;
    feedback?: 'positive' | 'neutral' | 'negative';
  }[];
};

type UserContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  saveAssessment: (assessment: { stressLevel: number; energyLevel: number; gender: 'M' | 'F' }) => void;
  saveFeedback: (feedback: 'positive' | 'neutral' | 'negative') => void;
  lastAssessment: { stressLevel: number; energyLevel: number; gender: 'M' | 'F' } | null;
  lastRecommendation: { cluster: number; ragaName: string } | null;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

// Mock user data for demonstration
const MOCK_USERS = [
  {
    id: '1',
    name: 'Demo User',
    email: 'demo@example.com',
    password: 'password', // In a real app, this would be hashed
    history: []
  }
];

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastAssessment, setLastAssessment] = useState<{ stressLevel: number; energyLevel: number; gender: 'M' | 'F' } | null>(null);
  const [lastRecommendation, setLastRecommendation] = useState<{ cluster: number; ragaName: string } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check localStorage for saved session
    const savedUser = localStorage.getItem('ragaUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Find user with matching credentials
      const foundUser = MOCK_USERS.find(u => u.email === email && u.password === password);
      
      if (foundUser) {
        const userData: User = {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          history: foundUser.history
        };
        
        setUser(userData);
        localStorage.setItem('ragaUser', JSON.stringify(userData));
        toast({
          title: "Welcome back!",
          description: `Logged in as ${userData.name}`,
        });
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check if email is already in use
      if (MOCK_USERS.some(u => u.email === email)) {
        toast({
          title: "Signup failed",
          description: "Email already in use",
          variant: "destructive",
        });
        return;
      }
      
      // Create new user
      const newUser: User = {
        id: String(MOCK_USERS.length + 1),
        name,
        email,
        history: []
      };
      
      // In a real app, we would add the user to the database here
      // For demo purposes, we're just setting the user state
      
      setUser(newUser);
      localStorage.setItem('ragaUser', JSON.stringify(newUser));
      toast({
        title: "Account created!",
        description: "Welcome to Raga Wellness",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setLastAssessment(null);
    setLastRecommendation(null);
    localStorage.removeItem('ragaUser');
    toast({
      title: "Logged out",
      description: "Come back soon!",
    });
  };

  const saveAssessment = (assessment: { stressLevel: number; energyLevel: number; gender: 'M' | 'F' }) => {
    setLastAssessment(assessment);
  };

  const saveFeedback = (feedback: 'positive' | 'neutral' | 'negative') => {
    if (!user || !lastAssessment || !lastRecommendation) return;
    
    const updatedHistory = [...user.history, {
      date: new Date(),
      stressLevel: lastAssessment.stressLevel,
      energyLevel: lastAssessment.energyLevel,
      gender: lastAssessment.gender,
      ragaCluster: lastRecommendation.cluster,
      ragaName: lastRecommendation.ragaName,
      feedback
    }];
    
    const updatedUser = {
      ...user,
      history: updatedHistory
    };
    
    setUser(updatedUser);
    localStorage.setItem('ragaUser', JSON.stringify(updatedUser));
    
    toast({
      title: "Feedback saved",
      description: "Thank you for helping us improve your recommendations!",
    });
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      signup, 
      logout, 
      saveAssessment, 
      saveFeedback,
      lastAssessment,
      lastRecommendation: lastRecommendation
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
