const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('daily')
    .setDescription('Claim your daily reward'),
  
  cooldown: 1,
  
  async execute(interaction) {
    const userId = interaction.user.id;
    const username = interaction.user.username;
    
    if (!interaction.client.database.canClaimDaily(userId)) {
      const user = interaction.client.database.getUser(userId, username);
      const lastDaily = new Date(user.last_daily);
      const nextDaily = new Date(lastDaily.getTime() + 24 * 60 * 60 * 1000);
      
      const embed = new EmbedBuilder()
        .setColor('#ff0000')
        .setTitle('⏰ Daily Reward Already Claimed')
        .setDescription(`You've already claimed your daily reward today!`)
        .addFields(
          { name: 'Next Daily Available', value: `<t:${Math.floor(nextDaily.getTime() / 1000)}:R>`, inline: false }
        )
        .setTimestamp();
      
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
    
    // Calculate daily reward (base + bonus based on level)
    const user = interaction.client.database.getUser(userId, username);
    const baseReward = 100;
    const levelBonus = Math.floor(user.level * 10);
    const totalReward = baseReward + levelBonus;
    
    // Claim daily and add reward
    interaction.client.database.claimDaily(userId);
    interaction.client.database.updateBalance(userId, totalReward);
    interaction.client.database.addXP(userId, 10);
    interaction.client.database.logTransaction(userId, 'daily', totalReward, 'Daily reward claimed');
    
    const embed = new EmbedBuilder()
      .setColor('#00ff00')
      .setTitle('💰 Daily Reward Claimed!')
      .setDescription(`You've successfully claimed your daily reward!`)
      .addFields(
        { name: '💵 Reward', value: `$${totalReward.toLocaleString()}`, inline: true },
        { name: '📈 XP Gained', value: '10 XP', inline: true },
        { name: '⭐ Level Bonus', value: `+$${levelBonus}`, inline: true }
      )
      .setTimestamp()
      .setFooter({ text: 'Come back tomorrow for another reward!' });
    
    await interaction.reply({ embeds: [embed] });
  },
}; 