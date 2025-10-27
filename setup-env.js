// Setup script to create environment variables
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create .env.local file for Vite
const envContent = `# Frontend Environment Variables (Vite format)
VITE_API_URL=http://localhost:5000/api/analytics
VITE_BACKEND_URL=http://localhost:5000
`;

const envPath = path.join(__dirname, '.env.local');

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env.local file with Vite environment variables');
  console.log('📝 Environment variables:');
  console.log('   VITE_API_URL=http://localhost:5000/api/analytics');
  console.log('   VITE_BACKEND_URL=http://localhost:5000');
  console.log('\n🚀 You can now start the frontend with: npm start');
} catch (error) {
  console.error('❌ Error creating .env.local file:', error.message);
}
