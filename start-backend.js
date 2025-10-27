#!/usr/bin/env node

/**
 * Simple script to start the backend server
 * This helps users get the backend running quickly
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting Backend Server...\n');

// Change to backend directory
const backendDir = path.join(__dirname, 'backend');

// Start the backend server
const backendProcess = spawn('npm', ['run', 'dev'], {
  cwd: backendDir,
  stdio: 'inherit',
  shell: true
});

backendProcess.on('error', (error) => {
  console.error('❌ Failed to start backend:', error.message);
  console.log('\n💡 Make sure you have:');
  console.log('   1. Installed dependencies: cd backend && npm install');
  console.log('   2. Created .env file: cp backend/env.example backend/.env');
  console.log('   3. MongoDB running (optional for development)');
  process.exit(1);
});

backendProcess.on('exit', (code) => {
  if (code !== 0) {
    console.error(`❌ Backend exited with code ${code}`);
  } else {
    console.log('✅ Backend stopped');
  }
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping backend server...');
  backendProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Stopping backend server...');
  backendProcess.kill('SIGTERM');
});

console.log('📊 Backend server starting...');
console.log('🔗 API will be available at: http://localhost:5000');
console.log('🏥 Health check: http://localhost:5000/health');
console.log('📈 Analytics API: http://localhost:5000/api/analytics');
console.log('\nPress Ctrl+C to stop the server\n');
