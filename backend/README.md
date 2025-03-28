
# ZamaniVault Backend

This is the backend service for ZamaniVault, built with Django REST Framework and MongoDB.

## Features

- User authentication and authorization with JWT
- Content management (videos, books, articles, artifacts)
- Categories and tagging
- User activity tracking
- Favorites and watchlist functionality
- Subscription management
- ML-powered content recommendations and insights
- Admin dashboard API endpoints

## Setup

1. Create a virtual environment:
   ```
   python -m venv venv
   ```

2. Activate the virtual environment:
   - On Windows: `venv\Scripts\activate`
   - On macOS/Linux: `source venv/bin/activate`

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in the required environment variables

5. Run migrations:
   ```
   python manage.py migrate
   ```

6. Create test data (optional):
   ```
   python create_test_data.py
   ```

7. Start the development server:
   ```
   python manage.py runserver
   ```

## API Documentation

API documentation will be available at `/api/docs/` when the server is running.

## Main Endpoints

### Authentication
- POST /api/auth/register/
- POST /api/auth/login/
- POST /api/auth/logout/
- POST /api/auth/token/refresh/

### User Management
- GET/PUT /api/auth/profile/
- GET/PUT /api/auth/subscription/
- GET /api/auth/history/

### Content
- GET /api/content/content/
- GET /api/content/content/{id}/
- GET /api/content/content/featured/
- GET /api/content/content/by_type/?type={type}
- GET /api/content/content/by_category/?category_id={id}
- GET /api/content/content/search/?q={query}

### Favorites & Watchlist
- GET /api/content/favorites/
- POST /api/content/favorites/toggle/
- GET /api/content/watchlist/
- POST /api/content/watchlist/toggle/

### ML Integration
- GET /api/ml/recommendations/
- GET /api/ml/insights/
- GET /api/ml/trends/ (admin only)
- GET /api/ml/segments/ (admin only)
- POST /api/ml/predict/ (admin only)

### Subscriptions
- GET /api/subscriptions/plans/
- GET /api/subscriptions/subscriptions/current/
- POST /api/subscriptions/subscriptions/subscribe/
- POST /api/subscriptions/subscriptions/cancel/
- GET /api/subscriptions/transactions/

## ML Model Integration

The backend includes an ML service that provides:

1. Content recommendations based on user viewing history
2. User interest analysis
3. Content trend analysis
4. User segmentation for targeted marketing
5. Prediction of content performance

ML models are stored in the `ml_service/models/` directory.

## Testing

Run tests with:

```
pytest
```

For specific tests:

```
pytest path/to/test_file.py
```

## Deployment

For production deployment:

1. Set DEBUG=False in your .env file
2. Configure a production database
3. Set up a proper web server (e.g., Gunicorn)
4. Use HTTPS
5. Configure proper security settings

## Integration with Frontend

The frontend is built with React. API calls from the frontend should include:

1. Authentication headers for protected endpoints:
   ```
   Authorization: Bearer <token>
   ```

2. CORS is configured to allow requests from the frontend origin.
