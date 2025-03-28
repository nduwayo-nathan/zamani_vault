
# GitHub Setup Guide

Follow these steps to push your ZamaniVault project to GitHub:

## Prerequisites

- Git installed on your local machine
- GitHub account
- Access to command line or terminal

## Steps

1. Create a new repository on GitHub:
   - Go to [GitHub](https://github.com)
   - Click "New repository"
   - Name your repository (e.g., "zamani-vault")
   - Choose visibility (public/private)
   - Do not initialize with README, .gitignore, or license
   - Click "Create repository"

2. Initialize your local repository:
   ```bash
   git init
   ```

3. Add your GitHub repository as a remote:
   ```bash
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
   ```

4. Add all files to staging:
   ```bash
   git add .
   ```

5. Commit your files:
   ```bash
   git commit -m "Initial commit"
   ```

6. Push to GitHub:
   ```bash
   git push -u origin main
   ```

## Structure Your Repository (Optional)

If you want to reorganize your current frontend code into a subfolder:

1. Create a 'frontend' directory
2. Move all files except the backend directory into the frontend directory
3. Commit and push the changes

## Connecting GitHub to Lovable

If you want to connect your GitHub repository to Lovable:

1. In Lovable, go to Project Settings
2. Connect to your GitHub account
3. Select the repository you created
4. Follow the prompts to complete the connection
