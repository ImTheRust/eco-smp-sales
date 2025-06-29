const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Check your current balance')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to check balance for (optional)')
        .setRequired(false)),
  
  cooldown: 5,
  
  async execute(interaction) {
    const targetUser = interaction.options.getUser('user') || interaction.user;
    const user = interaction.client.database.getUser(targetUser.id, targetUser.username);
    
    const embed = new EmbedBuilder()
      .setColor('#00ff00')
      .setTitle(`💰 ${targetUser.username}'s Balance`)
      .setThumbnail(targetUser.displayAvatarURL())
      .addFields(
        { name: '💵 Wallet', value: `$${user.balance.toLocaleString()}`, inline: true },
        { name: '🏦 Bank', value: `$${user.bank.toLocaleString()}`, inline: true },
        { name: '📊 Total', value: `$${(user.balance + user.bank).toLocaleString()}`, inline: true },
        { name: '⭐ Level', value: `${user.level}`, inline: true },
        { name: '📈 XP', value: `${user.xp}/100`, inline: true }
      )
      .setTimestamp()
      .setFooter({ text: 'Economy Bot' });
    
    await interaction.reply({ embeds: [embed] });
  },
}; 