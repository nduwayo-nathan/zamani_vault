
// This file will connect to Django backend for authentication
// For now, it uses mock data but is structured to easily connect to real API

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  subscription: 'free' | 'premium' | 'scholar';
  avatar?: string;
  createdAt: string;
}

interface AuthResponse {
  user: User | null;
  token?: string;
  error?: string;
}

// Mock user data for development
const mockUsers = [
  {
    id: '1',
    name: 'Test User',
    email: 'user@example.com',
    role: 'user',
    subscription: 'free',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop',
    createdAt: '2023-01-15'
  },
  {
    id: '2',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    subscription: 'premium',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop',
    createdAt: '2022-10-05'
  }
] as User[];

// Mock token storage (would be JWT in real implementation)
let currentUser: User | null = null;
let authToken: string | null = null;

const authService = {
  // Login function
  login: async (email: string, password: string): Promise<AuthResponse> => {
    console.log(`Attempting login for ${email}`);
    
    // Mock authentication logic
    // In real implementation, this would make a POST request to Django
    const user = mockUsers.find(u => u.email === email);
    
    if (user) {
      // Mock successful login
      currentUser = user;
      authToken = `mock-token-${user.id}`;
      
      // Save to localStorage for persistence
      localStorage.setItem('zamaniUser', JSON.stringify(user));
      localStorage.setItem('zamaniToken', authToken);
      
      return {
        user,
        token: authToken
      };
    }
    
    return {
      user: null,
      error: 'Invalid email or password'
    };
  },
  
  // Register function
  register: async (userData: { name: string; email: string; password: string }): Promise<AuthResponse> => {
    console.log('Registering new user', userData);
    
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === userData.email);
    if (existingUser) {
      return {
        user: null,
        error: 'Email already in use'
      };
    }
    
    // Create new user
    const newUser: User = {
      id: `user-${mockUsers.length + 1}`,
      name: userData.name,
      email: userData.email,
      role: 'user',
      subscription: 'free',
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    mockUsers.push(newUser);
    
    // Mock successful registration
    currentUser = newUser;
    authToken = `mock-token-${newUser.id}`;
    
    // Save to localStorage for persistence
    localStorage.setItem('zamaniUser', JSON.stringify(newUser));
    localStorage.setItem('zamaniToken', authToken);
    
    return {
      user: newUser,
      token: authToken
    };
  },
  
  // Logout function
  logout: () => {
    currentUser = null;
    authToken = null;
    localStorage.removeItem('zamaniUser');
    localStorage.removeItem('zamaniToken');
  },
  
  // Get current user
  getCurrentUser: (): User | null => {
    if (currentUser) return currentUser;
    
    // Try to get from localStorage
    const storedUser = localStorage.getItem('zamaniUser');
    if (storedUser) {
      currentUser = JSON.parse(storedUser);
      return currentUser;
    }
    
    return null;
  },
  
  // Get auth token
  getToken: (): string | null => {
    if (authToken) return authToken;
    
    // Try to get from localStorage
    const storedToken = localStorage.getItem('zamaniToken');
    if (storedToken) {
      authToken = storedToken;
      return authToken;
    }
    
    return null;
  },
  
  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!authService.getCurrentUser() && !!authService.getToken();
  },
  
  // Check if user is admin
  isAdmin: (): boolean => {
    const user = authService.getCurrentUser();
    return !!user && user.role === 'admin';
  },
  
  // Update user profile
  updateProfile: async (userData: Partial<User>): Promise<User | null> => {
    const user = authService.getCurrentUser();
    if (!user) return null;
    
    // Update user data
    const updatedUser = { ...user, ...userData };
    
    // Update in mock users array
    const index = mockUsers.findIndex(u => u.id === user.id);
    if (index !== -1) {
      mockUsers[index] = updatedUser;
    }
    
    // Update current user
    currentUser = updatedUser;
    localStorage.setItem('zamaniUser', JSON.stringify(updatedUser));
    
    return updatedUser;
  },
  
  // Update subscription
  updateSubscription: async (plan: 'free' | 'premium' | 'scholar'): Promise<User | null> => {
    return authService.updateProfile({ subscription: plan });
  }
};

export default authService;
export type { User, AuthResponse };
