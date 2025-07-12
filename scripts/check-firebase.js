#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking Firebase Configuration...\n');

// Check if .env.local exists
const envPath = path.join(__dirname, '..', '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local file not found!');
  console.log('Please copy env.local.template to .env.local and fill in your Firebase configuration.');
  process.exit(1);
}

// Read and check environment variables
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim();
  }
});

const requiredVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID'
];

console.log('📋 Environment Variables Check:');
let allGood = true;

requiredVars.forEach(varName => {
  const value = envVars[varName];
  if (!value || value.includes('your_') || value === '') {
    console.log(`❌ ${varName}: Not set or using placeholder value`);
    allGood = false;
  } else {
    console.log(`✅ ${varName}: Set`);
  }
});

console.log('\n🔧 Next Steps:');

if (!allGood) {
  console.log('1. Copy env.local.template to .env.local');
  console.log('2. Fill in your Firebase configuration values');
  console.log('3. Enable Firebase Storage in your Firebase Console');
  console.log('4. Deploy storage rules');
  console.log('\n📖 See FIREBASE_STORAGE_SETUP.md for detailed instructions');
} else {
  console.log('✅ All environment variables are set correctly!');
  console.log('\n🚀 To test Firebase Storage:');
  console.log('1. Start your dev server: npm run dev');
  console.log('2. Go to /company-demo');
  console.log('3. Use the "Firebase Storage Test" section');
}

console.log('\n📚 Documentation:');
console.log('- Firebase Setup: FIREBASE_SETUP.md');
console.log('- Storage Setup: FIREBASE_STORAGE_SETUP.md'); 