import dotenv from 'dotenv';
import { readFileSync } from 'fs';

dotenv.config();

console.log('🔍 Environment Variables Debug\n');
try {
    const envFile = readFileSync('.env', 'utf8');
    console.log('✅ .env file found');
    console.log('📄 Contents (without sensitive data):');
    envFile.split('\n').forEach((line, index) => {
        if (line.trim() && !line.startsWith('#')) {
            const [key] = line.split('=');
            const value = process.env[key];
            console.log(`   ${key}: ${value ? '✅ Loaded' : '❌ Not loaded'}`);
        }
    });
} catch (error) {
    console.log('❌ .env file not found');
    console.log('💡 Run: cp .env.example .env');
}

console.log('\n🔧 Required Variables for Setup:');
const requiredVars = [
    'VITE_APPWRITE_PROJECT_ID',
    'APPWRITE_API_KEY',
    'VITE_APPWRITE_ENDPOINT',
    'VITE_APPWRITE_DATABASE_ID',
    'VITE_APPWRITE_COLLECTION_ID',
    'VITE_APPWRITE_ADMIN_TEAM_ID'
];

requiredVars.forEach(varName => {
    const value = process.env[varName];
    console.log(`   ${varName}: ${value ? '✅ Set' : '❌ Missing'}`);
});

console.log('\n📋 Next Steps:');
console.log('1. Ensure all required variables are set in .env');
console.log('2. Get APPWRITE_API_KEY from your Appwrite Console');
console.log('3. Run: npm run setup:appwrite');
