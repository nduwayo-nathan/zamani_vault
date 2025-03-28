
/**
 * Helper module to connect the React frontend with the Django backend API.
 * This file serves as a bridge between the mock services and the real API.
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import authService from './authService';

// Base URL for the Django backend
const API_BASE_URL = 'http://localhost:8000/api';

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use((config) => {
  const token = authService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is due to an expired token and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Attempt to refresh the token
        const storedRefreshToken = localStorage.getItem('zamaniRefreshToken');
        
        if (storedRefreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
            refresh: storedRefreshToken
          });
          
          const { access } = response.data;
          
          // Update stored token
          localStorage.setItem('zamaniToken', access);
          
          // Update the original request with the new token
          originalRequest.headers.Authorization = `Bearer ${access}`;
          
          // Retry the original request
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // If token refresh fails, log out the user
        console.error('Token refresh failed:', refreshError);
        authService.logout();
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

/**
 * Makes an API request to the Django backend
 * @param endpoint - API endpoint path
 * @param method - HTTP method
 * @param data - Request data (for POST, PUT, etc.)
 * @param config - Additional axios config
 * @returns Promise with API response
 */
export async function apiRequest<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> {
  try {
    let response: AxiosResponse;
    
    switch (method) {
      case 'GET':
        response = await apiClient.get<T>(endpoint, config);
        break;
      case 'POST':
        response = await apiClient.post<T>(endpoint, data, config);
        break;
      case 'PUT':
        response = await apiClient.put<T>(endpoint, data, config);
        break;
      case 'DELETE':
        response = await apiClient.delete<T>(endpoint, config);
        break;
      default:
        throw new Error(`Unsupported method: ${method}`);
    }
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`API ${method} request to ${endpoint} failed:`, error.response?.data || error.message);
      throw error.response?.data || error;
    }
    console.error(`API ${method} request to ${endpoint} failed:`, error);
    throw error;
  }
}

/**
 * Helper function to check if the API is available
 * @returns Promise with API health status
 */
export async function checkApiStatus(): Promise<{ status: string }> {
  try {
    // Try to fetch a simple endpoint to check if the API is up
    // This endpoint should be implemented in your Django backend
    const response = await apiClient.get<{ status: string }>('/health/');
    return response.data;
  } catch (error) {
    console.error('API health check failed:', error);
    return { status: 'offline' };
  }
}

/**
 * Utility to determine if we should use mock data or real API
 * @returns boolean indicating if we should use mock data
 */
export function shouldUseMockData(): boolean {
  // In development, you might want to use mock data if the API is not available
  // You can customize this logic based on your needs
  return process.env.NODE_ENV === 'development' && localStorage.getItem('useMockData') === 'true';
}

export default {
  apiRequest,
  checkApiStatus,
  shouldUseMockData,
  client: apiClient
};
