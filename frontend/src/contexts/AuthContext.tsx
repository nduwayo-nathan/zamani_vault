
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService, { User } from '@/services/authService';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
  updateSubscription: (plan: 'free' | 'premium' | 'scholar') => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Check for existing user session on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  // Login handler
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authService.login(email, password);
      
      if (response.user) {
        setUser(response.user);
        toast({
          title: 'Login successful',
          description: `Welcome back, ${response.user.name}!`,
        });
        return true;
      } else {
        toast({
          title: 'Login failed',
          description: response.error || 'Invalid credentials',
          variant: 'destructive',
        });
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Login error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Register handler
  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authService.register({ name, email, password });
      
      if (response.user) {
        setUser(response.user);
        toast({
          title: 'Registration successful',
          description: `Welcome to ZamaniVault, ${response.user.name}!`,
        });
        return true;
      } else {
        toast({
          title: 'Registration failed',
          description: response.error || 'Could not create account',
          variant: 'destructive',
        });
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: 'Registration error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Logout handler
  const logout = () => {
    authService.logout();
    setUser(null);
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out',
    });
    navigate('/');
  };
  
  // Update profile handler
  const updateProfile = async (userData: Partial<User>) => {
    try {
      setIsLoading(true);
      const updatedUser = await authService.updateProfile(userData);
      
      if (updatedUser) {
        setUser(updatedUser);
        toast({
          title: 'Profile updated',
          description: 'Your profile has been successfully updated',
        });
        return true;
      } else {
        toast({
          title: 'Update failed',
          description: 'Could not update your profile',
          variant: 'destructive',
        });
        return false;
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast({
        title: 'Update error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update subscription handler
  const updateSubscription = async (plan: 'free' | 'premium' | 'scholar') => {
    try {
      setIsLoading(true);
      const updatedUser = await authService.updateSubscription(plan);
      
      if (updatedUser) {
        setUser(updatedUser);
        toast({
          title: 'Subscription updated',
          description: `Your subscription has been changed to ${plan}`,
        });
        return true;
      } else {
        toast({
          title: 'Subscription update failed',
          description: 'Could not update your subscription',
          variant: 'destructive',
        });
        return false;
      }
    } catch (error) {
      console.error('Subscription update error:', error);
      toast({
        title: 'Update error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const contextValue: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: !!user && user.role === 'admin',
    login,
    register,
    logout,
    updateProfile,
    updateSubscription
  };
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
