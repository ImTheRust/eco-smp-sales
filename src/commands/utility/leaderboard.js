const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('View the richest users')
    .addIntegerOption(option =>
      option.setName('limit')
        .setDescription('Number of users to show (max 20)')
        .setRequired(false)
        .setMinValue(1)
        .setMaxValue(20)),
  
  cooldown: 10,
  
  async execute(interaction) {
    const limit = interaction.options.getInteger('limit') || 10;
    const topUsers = interaction.client.database.getTopUsers(limit);
    
    if (topUsers.length === 0) {
      const embed = new EmbedBuilder()
        .setColor('#ff0000')
        .setTitle('🏆 Leaderboard')
        .setDescription('No users found in the leaderboard.')
        .setTimestamp();
      
      return interaction.reply({ embeds: [embed] });
    }
    
    const embed = new EmbedBuilder()
      .setColor('#ffd700')
      .setTitle('🏆 Richest Users')
      .setDescription('Top users by total wealth (wallet + bank)')
      .setTimestamp();
    
    let description = '';
    topUsers.forEach((user, index) => {
      const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
      const totalWealth = user.balance + user.bank;
      description += `${medal} **${user.username}** - $${totalWealth.toLocaleString()}\n`;
      description += `   💵 Wallet: $${user.balance.toLocaleString()} | 🏦 Bank: $${user.bank.toLocaleString()} | ⭐ Level: ${user.level}\n\n`;
    });
    
    embed.setDescription(description);
    
    await interaction.reply({ embeds: [embed] });
  },
}; 