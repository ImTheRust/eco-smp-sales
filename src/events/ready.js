const { Events } = require('discord.js');

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);
    console.log(`Bot is now serving ${client.guilds.cache.size} guilds`);
    
    // Set bot status
    client.user.setActivity('💰 Economy Bot | /help', { type: 'PLAYING' });
  },
}; 