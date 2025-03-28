
/**
 * This script helps connect the frontend to the backend by:
 * 1. Setting up the correct API base URL in the frontend
 * 2. Configuring CORS in the backend to accept requests from the frontend
 * 3. Testing the connection between frontend and backend
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { exec } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Configuration
let frontendPort = '3000';
let backendPort = '8000';
let frontendUrl = '';
let backendUrl = '';

console.log('ZamaniVault Frontend-Backend Connection Setup\n');

const setupPorts = () => {
  rl.question('Enter frontend port (default: 3000): ', (fPort) => {
    if (fPort) frontendPort = fPort;
    
    rl.question('Enter backend port (default: 8000): ', (bPort) => {
      if (bPort) backendPort = bPort;
      
      frontendUrl = `http://localhost:${frontendPort}`;
      backendUrl = `http://localhost:${backendPort}`;
      
      console.log(`\nUsing frontend URL: ${frontendUrl}`);
      console.log(`Using backend URL: ${backendUrl}\n`);
      
      updateFrontendConfig();
    });
  });
};

const updateFrontendConfig = () => {
  console.log('Updating frontend API configuration...');
  
  // Path to the API connect file
  const apiConnectPath = path.join(__dirname, 'src', 'services', 'apiConnect.ts');
  
  try {
    if (fs.existsSync(apiConnectPath)) {
      let content = fs.readFileSync(apiConnectPath, 'utf8');
      
      // Update API base URL
      content = content.replace(
        /const API_BASE_URL = .*/,
        `const API_BASE_URL = '${backendUrl}/api';`
      );
      
      fs.writeFileSync(apiConnectPath, content);
      console.log('✅ Frontend API configuration updated successfully.');
      
      updateBackendConfig();
    } else {
      console.error('❌ API connect file not found. Make sure you run this script from the project root.');
      rl.close();
    }
  } catch (error) {
    console.error('❌ Error updating frontend config:', error);
    rl.close();
  }
};

const updateBackendConfig = () => {
  console.log('\nUpdating backend CORS configuration...');
  
  // Path to the Django settings file
  const settingsPath = path.join(__dirname, 'backend', 'zamanivault', 'settings.py');
  
  try {
    if (fs.existsSync(settingsPath)) {
      let content = fs.readFileSync(settingsPath, 'utf8');
      
      // Check if CORS_ALLOWED_ORIGINS is already defined
      if (content.includes('CORS_ALLOWED_ORIGINS')) {
        // Update CORS_ALLOWED_ORIGINS
        const corsRegex = /CORS_ALLOWED_ORIGINS = \[([\s\S]*?)\]/;
        const corsMatch = content.match(corsRegex);
        
        if (corsMatch) {
          // Check if frontend URL is already in the list
          if (!corsMatch[0].includes(frontendUrl)) {
            // Add frontend URL to the list
            const updatedCors = corsMatch[0].replace(
              ']',
              `    "${frontendUrl}",\n]`
            );
            content = content.replace(corsRegex, updatedCors);
          }
        }
      } else {
        // Add CORS_ALLOWED_ORIGINS if it doesn't exist
        content += `\n# CORS settings\nCORS_ALLOWED_ORIGINS = [\n    "${frontendUrl}",\n]\n`;
      }
      
      fs.writeFileSync(settingsPath, content);
      console.log('✅ Backend CORS configuration updated successfully.');
      
      testConnection();
    } else {
      console.error('❌ Django settings file not found. Make sure you run this script from the project root.');
      rl.close();
    }
  } catch (error) {
    console.error('❌ Error updating backend config:', error);
    rl.close();
  }
};

const testConnection = () => {
  console.log('\nTesting connection between frontend and backend...');
  
  // Simple test to check if backend is running
  exec(`curl -s ${backendUrl}/api/health/`, (error, stdout, stderr) => {
    if (error) {
      console.log(`❌ Backend is not running at ${backendUrl}.`);
      console.log('Please start the Django server with:');
      console.log('  cd backend && python manage.py runserver');
    } else {
      try {
        const response = JSON.parse(stdout);
        if (response.status === 'ok') {
          console.log('✅ Backend is running and responding correctly.');
        } else {
          console.log('⚠️ Backend is running but returned an unexpected response.');
        }
      } catch (e) {
        console.log('⚠️ Backend is running but returned a non-JSON response.');
      }
    }
    
    console.log('\nSetup completed! You may need to restart your development servers.');
    console.log('\nTo start the frontend: cd frontend && npm run dev');
    console.log('To start the backend: cd backend && python manage.py runserver');
    
    rl.close();
  });
};

// Start the setup process
setupPorts();
