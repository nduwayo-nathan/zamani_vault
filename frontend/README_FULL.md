
# ZamaniVault

ZamaniVault is a comprehensive platform for exploring African history through videos, books, artifacts, and other educational content. The platform features both free and premium content, user subscriptions, and AI-powered recommendations.

![ZamaniVault](public/og-image.png)

## Project Structure

This project is organized into two main components:

- **Frontend**: React application with TypeScript, TanStack Query, Tailwind CSS and shadcn/ui
- **Backend**: Django REST API with MongoDB and ML integration

## Features

### User Features

- User authentication (login/register)
- Content browsing and filtering by type and category
- Search functionality
- Subscription management
- User profile management
- Favorites and watchlist
- Content recommendation based on viewing history
- Personalized user insights

### Admin Features

- User management
- Content management
- Analytics dashboard
- User segments and insights
- Subscription and payment tracking

### Technical Features

- JWT authentication
- RESTful API design
- MongoDB integration
- Machine learning recommendations
- Responsive design
- Modern React patterns

## Getting Started

### Frontend

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

The frontend will be available at http://localhost:3000

### Backend

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   ```

3. Activate the virtual environment:
   - On Windows: `venv\Scripts\activate`
   - On macOS/Linux: `source venv/bin/activate`

4. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

5. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in the required environment variables

6. Run migrations:
   ```
   python manage.py migrate
   ```

7. Create test data (optional):
   ```
   python create_test_data.py
   ```

8. Start the development server:
   ```
   python manage.py runserver
   ```

The backend API will be available at http://localhost:8000/api/

## API Documentation

When the backend is running, API documentation is available at:
http://localhost:8000/api/docs/

## Frontend-Backend Integration

The frontend is designed to communicate with the backend API. Key integration points:

1. Authentication: JWT tokens are stored in local storage
2. API Services: Located in `frontend/src/services/*.ts`
3. ML Integration: Recommendations and insights are fetched from the backend

## ML Model Integration

The project includes machine learning models for:

1. Content recommendations based on user viewing history
2. User interest analysis
3. Content trend analysis
4. User segmentation for targeted marketing
5. Prediction of content performance

## Deployment

For production deployment:

1. Frontend:
   - Build with `npm run build`
   - Deploy on a static hosting service (Vercel, Netlify, or AWS S3)

2. Backend:
   - Set DEBUG=False in .env
   - Configure a production database
   - Use Gunicorn or uWSGI
   - Deploy on a cloud service (Heroku, AWS, DigitalOcean)

## Development Workflow

1. Fork and clone the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

[MIT License](LICENSE)

## Credits

- Frontend UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Charts from [Recharts](https://recharts.org/)

