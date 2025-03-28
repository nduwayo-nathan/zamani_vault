
# Backend Integration Guide

This document explains how to connect the ZamaniVault frontend to the Django backend and ML model once they're developed.

## Django Backend Setup

1. Create a new Django project:
   ```bash
   django-admin startproject zamani_backend
   ```

2. Set up Django Rest Framework and required apps:
   ```bash
   pip install djangorestframework django-cors-headers pymongo djongo
   ```

3. Configure MongoDB in settings.py:
   ```python
   DATABASES = {
       'default': {
           'ENGINE': 'djongo',
           'NAME': 'zamaniVault',
           'CLIENT': {
               'host': 'mongodb://localhost:27017'
           }
       }
   }
   ```

4. Create the necessary Django apps:
   ```bash
   python manage.py startapp accounts
   python manage.py startapp content
   python manage.py startapp subscriptions
   python manage.py startapp ml_service
   ```

5. Implement models, views, serializers, and urls for each app

## ML Model Integration

1. Set up a separate ML service or integrate it directly with Django
2. Use libraries like scikit-learn, TensorFlow, or PyTorch for model development
3. Create API endpoints in Django to serve ML predictions
4. Connect the frontend to these endpoints

## Frontend Integration

To connect the frontend to the Django backend:

1. Update API service files to use real endpoints:

```typescript
// src/services/api.ts
const API_BASE_URL = 'http://localhost:8000/api';

async function apiRequest<T>(
  endpoint: string, 
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: any
): Promise<ApiResponse<T>> {
  try {
    const token = localStorage.getItem('zamaniToken');
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: data ? JSON.stringify(data) : undefined,
    });
    
    const result = await response.json();
    
    return {
      data: result.data,
      status: response.status,
      error: result.error,
    };
  } catch (error) {
    console.error('API request failed:', error);
    return {
      error: 'Failed to fetch data from the server',
      status: 500
    };
  }
}

// Continue with the same API endpoints structure
```

2. Update auth service to use real endpoints:

```typescript
// src/services/authService.ts
import api from './api';

const authService = {
  login: async (email: string, password: string) => {
    const response = await api.user.login({ email, password });
    
    if (response.data) {
      localStorage.setItem('zamaniUser', JSON.stringify(response.data.user));
      localStorage.setItem('zamaniToken', response.data.token);
      return response.data;
    }
    
    return { user: null, error: response.error };
  },
  
  // Update other methods similarly
};
```

3. Update ML service to use real endpoints:

```typescript
// src/services/mlService.ts
import api from './api';

export const mlService = {
  getUserRecommendations: async (userId: string) => {
    const response = await api.ml.getUserRecommendations(userId);
    return response.data || [];
  },
  
  // Update other methods similarly
};
```

## API Endpoints Reference

Here's a list of the expected API endpoints from the Django backend:

### Authentication
- POST /api/auth/login
- POST /api/auth/register
- POST /api/auth/logout
- GET /api/auth/user

### Content
- GET /api/content
- GET /api/content/:id
- GET /api/content/featured
- GET /api/content/category/:category
- GET /api/content/search?q=:query

### User
- GET /api/user/profile
- PUT /api/user/profile
- GET /api/user/subscription
- PUT /api/user/subscription
- GET /api/user/history

### Admin
- GET /api/admin/users
- GET /api/admin/analytics
- GET /api/admin/content/stats
- PUT /api/admin/content/:id
- POST /api/admin/content
- DELETE /api/admin/content/:id

### ML Service
- GET /api/ml/recommendations/:userId
- GET /api/ml/insights/:userId
- GET /api/ml/trends
- GET /api/ml/segments

## Deployment

For deployment:

1. Set up separate hosting for:
   - React frontend (Vercel, Netlify, or AWS S3)
   - Django backend (Heroku, AWS EC2, or DigitalOcean)
   - MongoDB database (MongoDB Atlas or self-hosted)

2. Configure CORS settings in Django to allow requests from the frontend domain

3. Set environment variables for API URLs, database credentials, and other sensitive information
