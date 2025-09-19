#!/usr/bin/env node

// Simple test script to verify the setup
const { exec } = require('child_process');

console.log('🧪 Testing Code Sensei Setup...\n');

// Test 1: Check if Docker is running
console.log('1. Checking Docker...');
exec('docker --version', (error, stdout, stderr) => {
  if (error) {
    console.log('❌ Docker not found. Please install Docker first.');
    return;
  }
  console.log('✅ Docker is installed:', stdout.trim());
});

// Test 2: Check if docker-compose is available
console.log('\n2. Checking Docker Compose...');
exec('docker-compose --version', (error, stdout, stderr) => {
  if (error) {
    console.log('❌ Docker Compose not found. Please install Docker Compose first.');
    return;
  }
  console.log('✅ Docker Compose is available:', stdout.trim());
});

// Test 3: Check if .env file exists
console.log('\n3. Checking environment file...');
const fs = require('fs');
if (fs.existsSync('.env')) {
  console.log('✅ .env file exists');
} else {
  console.log('⚠️  .env file not found. Please copy env.example to .env and configure it.');
}

// Test 4: Check if required packages are installed
console.log('\n4. Checking dependencies...');
exec('npm list ioredis', (error, stdout, stderr) => {
  if (error) {
    console.log('❌ Redis package not installed. Run: npm install');
    return;
  }
  console.log('✅ Redis package is installed');
});

console.log('\n🎉 Setup verification complete!');
console.log('\nNext steps:');
console.log('1. Copy env.example to .env and configure your API keys');
console.log('2. Run: ./docker-manage.sh start');
console.log('3. Visit: http://localhost:3000');
