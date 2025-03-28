
# ZamaniVault

ZamaniVault is a comprehensive platform for exploring African history through videos, books, artifacts, and other educational content. The platform features both free and premium content, user subscriptions, and AI-powered recommendations.

## Project Structure

This project is organized into two main components:

- **Frontend**: React application with TypeScript, TanStack Query, Tailwind CSS and shadcn/ui
- **Backend**: Django REST API with MongoDB and ML integration

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

7. Start the development server:
   ```
   python manage.py runserver
   ```

The backend API will be available at http://localhost:8000/api/

## Frontend-Backend Integration

The frontend is designed to communicate with the backend API through the services in `src/services/`.

## ML Model Integration

The backend includes machine learning models for:
- Content recommendations based on user viewing history
- User interest analysis
- Content trend analysis
- User segmentation
