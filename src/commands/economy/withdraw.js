const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('withdraw')
    .setDescription('Withdraw money from your bank account')
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('Amount to withdraw')
        .setRequired(true)
        .setMinValue(1)),
  
  cooldown: 3,
  
  async execute(interaction) {
    const userId = interaction.user.id;
    const username = interaction.user.username;
    const amount = interaction.options.getInteger('amount');
    
    const user = interaction.client.database.getUser(userId, username);
    
    if (amount > user.bank) {
      const embed = new EmbedBuilder()
        .setColor('#ff0000')
        .setTitle('❌ Insufficient Funds')
        .setDescription(`You don't have enough money in your bank!`)
        .addFields(
          { name: '🏦 Bank Balance', value: `$${user.bank.toLocaleString()}`, inline: true },
          { name: '💰 Amount Requested', value: `$${amount.toLocaleString()}`, inline: true }
        )
        .setTimestamp();
      
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
    
    // Transfer money from bank to wallet
    interaction.client.database.updateBank(userId, -amount);
    interaction.client.database.updateBalance(userId, amount);
    interaction.client.database.logTransaction(userId, 'withdraw', amount, `Withdrew $${amount} from bank`);
    
    const embed = new EmbedBuilder()
      .setColor('#00ff00')
      .setTitle('🏦 Withdrawal Successful!')
      .setDescription(`You've successfully withdrawn money from your bank account!`)
      .addFields(
        { name: '💰 Amount Withdrawn', value: `$${amount.toLocaleString()}`, inline: true },
        { name: '💵 New Wallet Balance', value: `$${(user.balance + amount).toLocaleString()}`, inline: true },
        { name: '🏦 New Bank Balance', value: `$${(user.bank - amount).toLocaleString()}`, inline: true }
      )
      .setTimestamp();
    
    await interaction.reply({ embeds: [embed] });
  },
}; 