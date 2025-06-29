const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Show all available commands'),
  
  cooldown: 5,
  
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('💰 Economy Bot Help')
      .setDescription('Here are all the available commands:')
      .addFields(
        {
          name: '💵 Economy Commands',
          value: '`/balance` - Check your balance\n`/daily` - Claim daily reward\n`/work` - Work to earn money\n`/deposit <amount>` - Deposit money to bank\n`/withdraw <amount>` - Withdraw money from bank\n`/transfer <user> <amount>` - Transfer money to another user',
          inline: false
        },
        {
          name: '🎰 Gambling Commands',
          value: '`/slots <bet>` - Play slot machine\n`/coinflip <bet> <choice>` - Flip a coin (heads/tails)',
          inline: false
        },
        {
          name: '🏪 Shop Commands',
          value: '`/shop` - View available items\n`/buy <item_id>` - Purchase an item',
          inline: false
        },
        {
          name: '📊 Utility Commands',
          value: '`/leaderboard [limit]` - View richest users\n`/help` - Show this help message',
          inline: false
        }
      )
      .addFields(
        {
          name: '💡 Tips',
          value: '• Use `/daily` every day for free money\n• Work every 30 minutes to earn money\n• Higher levels give better rewards\n• Keep money in the bank for safety\n• Try gambling for big wins (or losses!)',
          inline: false
        }
      )
      .setFooter({ text: 'Economy Bot - Have fun earning money!' })
      .setTimestamp();
    
    await interaction.reply({ embeds: [embed] });
  },
}; 