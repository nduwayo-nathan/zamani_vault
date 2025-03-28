
# ZamaniVault

ZamaniVault is a platform for exploring African history through videos, books, artifacts, and other educational content. The platform features both free and premium content, user subscriptions, and AI-powered recommendations.

## Project Structure

This project is structured into two main parts:

1. **Frontend**: React application with TypeScript
2. **Backend**: Django REST API (planned) with MongoDB and ML integration (planned)

## Frontend

The frontend is built with:

- React with TypeScript
- React Router for navigation
- TanStack Query for data fetching
- Tailwind CSS and shadcn/ui for styling
- Recharts for data visualization

### Key Features

- User authentication (login/register)
- Content browsing and filtering
- Subscription management
- User profile management
- Admin dashboard for content and user management
- AI-powered recommendations and insights

### Development Setup

1. Clone the repository
2. Navigate to the frontend directory
3. Install dependencies:
   ```
   npm install
   ```
4. Start the development server:
   ```
   npm run dev
   ```

## Backend (Planned)

The backend will be built with:

- Django REST Framework
- MongoDB for data storage
- ML model integration for content recommendations and user insights
- Authentication and authorization
- Content management
- Subscription handling

### Planned Backend Features

- RESTful API endpoints for all frontend functionality
- User authentication with JWT
- Content CRUD operations
- Subscription management
- Integration with payment processors
- ML model for content recommendations
- Analytics and reporting for admin dashboard

## ML Integration (Planned)

The ML component will provide:

- Content recommendations based on user viewing history
- User interest analysis
- Content trend analysis
- User segmentation for targeted marketing
- Prediction of content performance

## Project Roadmap

1. Complete frontend implementation
2. Set up Django project structure
3. Implement MongoDB integration
4. Create basic API endpoints
5. Implement authentication and authorization
6. Develop content management API
7. Set up subscription management
8. Integrate ML model
9. Connect frontend to backend
10. Testing and deployment

## GitHub Repository Structure

The repository will be organized as follows:

```
zamani-vault/
├── frontend/         # React frontend
├── backend/          # Django backend
└── ml/               # Machine learning model
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

[MIT License](LICENSE)
