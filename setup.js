#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🎮 Discord Economy Bot Setup');
console.log('============================\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  console.log('✅ .env file already exists');
} else {
  console.log('❌ .env file not found');
  console.log('📝 Creating .env file from template...');
  
  const envExample = fs.readFileSync(path.join(__dirname, 'env.example'), 'utf8');
  fs.writeFileSync(envPath, envExample);
  
  console.log('✅ Created .env file');
  console.log('⚠️  Please edit .env file with your Discord bot credentials');
}

// Check if data directory exists
const dataPath = path.join(__dirname, 'data');
if (fs.existsSync(dataPath)) {
  console.log('✅ data directory exists');
} else {
  console.log('📁 Creating data directory...');
  fs.mkdirSync(dataPath, { recursive: true });
  console.log('✅ Created data directory');
}

// Check package.json
const packagePath = path.join(__dirname, 'package.json');
if (fs.existsSync(packagePath)) {
  console.log('✅ package.json exists');
} else {
  console.log('❌ package.json not found');
  process.exit(1);
}

console.log('\n📋 Next Steps:');
console.log('1. Edit .env file with your Discord bot token and client ID');
console.log('2. Run: npm install');
console.log('3. Run: npm run deploy (to register slash commands)');
console.log('4. Run: npm start (to start the bot)');
console.log('\n🚀 For Railway deployment, follow the instructions in DEPLOYMENT.md');

console.log('\n�� Setup complete!'); 