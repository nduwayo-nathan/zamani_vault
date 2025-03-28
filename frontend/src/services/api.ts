
// This file will serve as a connector to the Django backend when it's set up
// For now, it will use mock data but is structured to easily switch to real API calls

interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

// Base URL that would point to your Django backend
const API_BASE_URL = 'http://localhost:8000/api';

// Function to handle API requests
async function apiRequest<T>(
  endpoint: string, 
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: any
): Promise<ApiResponse<T>> {
  try {
    // This is where we would make the actual fetch request
    // For now, we'll just console log the request details
    console.log(`Making ${method} request to ${API_BASE_URL}${endpoint}`, data);
    
    // Mock a successful response for now
    // In the future, this would be replaced with actual fetch calls
    return {
      data: {} as T,
      status: 200
    };
  } catch (error) {
    console.error('API request failed:', error);
    return {
      error: 'Failed to fetch data from the server',
      status: 500
    };
  }
}

// Content types
export interface HistoricalContent {
  id: string;
  title: string;
  description: string;
  contentType: 'video' | 'book' | 'article' | 'artifact';
  imageUrl: string;
  isPremium: boolean;
  duration?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// API endpoints for future implementation
export const contentApi = {
  getAll: () => apiRequest<HistoricalContent[]>('/content'),
  getById: (id: string) => apiRequest<HistoricalContent>(`/content/${id}`),
  getFeatured: () => apiRequest<HistoricalContent[]>('/content/featured'),
  getByCategory: (category: string) => apiRequest<HistoricalContent[]>(`/content/category/${category}`),
  search: (query: string) => apiRequest<HistoricalContent[]>(`/content/search?q=${query}`)
};

export const userApi = {
  login: (credentials: { email: string; password: string }) => 
    apiRequest<{ token: string }>('/auth/login', 'POST', credentials),
  register: (userData: { name: string; email: string; password: string }) => 
    apiRequest<{ success: boolean }>('/auth/register', 'POST', userData),
  getProfile: () => apiRequest<{ name: string; email: string; plan: string }>('/user/profile'),
  updateProfile: (data: any) => apiRequest('/user/profile', 'PUT', data),
  getSubscription: () => apiRequest<{ plan: string; status: string; nextBilling: string }>('/user/subscription'),
  updateSubscription: (plan: string) => apiRequest('/user/subscription', 'PUT', { plan }),
  getWatchHistory: () => apiRequest<{ contentId: string; progress: number; lastWatched: string }[]>('/user/history')
};

export const adminApi = {
  getUsers: () => apiRequest<any[]>('/admin/users'),
  getAnalytics: () => apiRequest<any>('/admin/analytics'),
  getContentStats: () => apiRequest<any>('/admin/content/stats'),
  updateContent: (id: string, data: any) => apiRequest(`/admin/content/${id}`, 'PUT', data),
  createContent: (data: any) => apiRequest('/admin/content', 'POST', data),
  deleteContent: (id: string) => apiRequest(`/admin/content/${id}`, 'DELETE')
};

export default {
  content: contentApi,
  user: userApi,
  admin: adminApi
};
