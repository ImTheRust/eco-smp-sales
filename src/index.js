const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const Database = require('./database/database');
const { loadCommands } = require('./utils/commandLoader');
const { loadEvents } = require('./utils/eventLoader');
const cron = require('node-cron');

// Import health check server
require('./health');

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

// Initialize database
client.database = new Database();

// Create collections for commands and cooldowns
client.commands = new Collection();
client.cooldowns = new Collection();

// Load commands and events
loadCommands(client);
loadEvents(client);

// Daily reward cron job (runs at midnight UTC)
cron.schedule('0 0 * * *', async () => {
  console.log('Running daily reset...');
  try {
    await client.database.resetDailyRewards();
    console.log('Daily rewards reset completed');
  } catch (error) {
    console.error('Error resetting daily rewards:', error);
  }
});

// Handle process termination
process.on('SIGINT', async () => {
  console.log('Shutting down bot...');
  await client.database.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down bot...');
  await client.database.close();
  process.exit(0);
});

// Login to Discord
client.login(process.env.DISCORD_TOKEN); 