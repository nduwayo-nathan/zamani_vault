
# GitHub Setup Guide for ZamaniVault

This guide will help you set up a GitHub repository for the ZamaniVault project, organizing both the frontend and backend components.

## Prerequisites

- Git installed on your local machine
- GitHub account
- Access to command line or terminal

## Repository Structure

The repository will be structured as follows:

```
zamani-vault/
├── README.md              # Main project README
├── frontend/              # React frontend application
│   ├── src/               # Frontend source code
│   ├── public/            # Public assets
│   ├── package.json       # Frontend dependencies
│   └── ...                # Other frontend files
├── backend/               # Django backend application
│   ├── zamanivault/       # Django project directory
│   ├── accounts/          # User management app
│   ├── content/           # Content management app
│   ├── ml_service/        # ML integration app
│   ├── subscriptions/     # Subscription management app
│   ├── manage.py          # Django management script
│   ├── requirements.txt   # Backend dependencies
│   └── ...                # Other backend files
```

## Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click "New repository"
3. Name your repository (e.g., "zamani-vault")
4. Choose visibility (public/private)
5. Do not initialize with README, .gitignore, or license
6. Click "Create repository"

## Step 2: Clone the Repository

Clone the empty repository to your local machine:

```bash
git clone https://github.com/YOUR-USERNAME/zamani-vault.git
cd zamani-vault
```

## Step 3: Create a Main README

Create a main README.md file in the root directory:

```bash
# Assuming you're in the root of the repository
echo "# ZamaniVault

ZamaniVault is a platform for exploring African history through videos, books, artifacts, and other educational content.

## Repository Structure

- **frontend/**: React application with TypeScript, TanStack Query, and Tailwind CSS
- **backend/**: Django REST API with MongoDB and ML integration

See the README in each directory for specific setup instructions.
" > README.md
```

## Step 4: Organize Frontend and Backend

### Frontend

1. Create a frontend directory and copy your existing frontend code:

```bash
mkdir -p frontend
# Copy your frontend code to the frontend directory
```

### Backend

1. Create a backend directory:

```bash
mkdir -p backend
# Copy your backend code to the backend directory
```

## Step 5: Create .gitignore

Create a .gitignore file to exclude unnecessary files:

```bash
cat > .gitignore << EOF
# General
.DS_Store
*.log
*.swp
.idea/
.vscode/

# Frontend
frontend/node_modules/
frontend/.pnp
frontend/.pnp.js
frontend/coverage/
frontend/build/
frontend/.env.local
frontend/.env.development.local
frontend/.env.test.local
frontend/.env.production.local
frontend/npm-debug.log*
frontend/yarn-debug.log*
frontend/yarn-error.log*

# Backend
backend/venv/
backend/__pycache__/
backend/*.py[cod]
backend/*$py.class
backend/*.so
backend/.Python
backend/env/
backend/build/
backend/develop-eggs/
backend/dist/
backend/downloads/
backend/eggs/
backend/.eggs/
backend/lib/
backend/lib64/
backend/parts/
backend/sdist/
backend/var/
backend/wheels/
backend/*.egg-info/
backend/.installed.cfg
backend/*.egg
backend/.env
backend/media/
backend/static/
backend/db.sqlite3
EOF
```

## Step 6: Add, Commit, and Push

Add all files to Git, commit them, and push to GitHub:

```bash
git add .
git commit -m "Initial commit with frontend and backend structure"
git push -u origin main
```

## Step 7: Set Up Development Environment

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - On Windows: `venv\Scripts\activate`
   - On macOS/Linux: `source venv/bin/activate`

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

6. Run migrations:
   ```bash
   python manage.py migrate
   ```

7. Start the development server:
   ```bash
   python manage.py runserver
   ```

## Step 8: Collaborating with Others

When collaborating with others, use branches for new features:

```bash
# Create a new branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "Add new feature"

# Push branch to GitHub
git push -u origin feature/new-feature

# Then create a Pull Request on GitHub
```

## Step 9: Deployment Considerations

For deployment, consider:

1. Create separate deployment pipelines for frontend and backend
2. Set up environment-specific configuration
3. Use environment variables for sensitive information
4. Document deployment steps in each component's README

## Additional GitHub Features to Use

1. **Issues**: Track bugs and feature requests
2. **Projects**: Manage development workflow
3. **Actions**: Set up CI/CD pipelines
4. **Wiki**: Add detailed documentation
5. **Releases**: Tag and release versions

## Next Steps

1. Set up continuous integration
2. Configure deployment workflows
3. Add code quality checks
4. Implement automated testing
5. Document API endpoints and integration points

