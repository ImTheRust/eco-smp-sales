const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('deposit')
    .setDescription('Deposit money into your bank account')
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('Amount to deposit (use "all" for all money)')
        .setRequired(true)
        .setMinValue(1)),
  
  cooldown: 3,
  
  async execute(interaction) {
    const userId = interaction.user.id;
    const username = interaction.user.username;
    const amount = interaction.options.getInteger('amount');
    
    const user = interaction.client.database.getUser(userId, username);
    
    if (amount > user.balance) {
      const embed = new EmbedBuilder()
        .setColor('#ff0000')
        .setTitle('❌ Insufficient Funds')
        .setDescription(`You don't have enough money in your wallet!`)
        .addFields(
          { name: '💵 Your Balance', value: `$${user.balance.toLocaleString()}`, inline: true },
          { name: '💰 Amount Requested', value: `$${amount.toLocaleString()}`, inline: true }
        )
        .setTimestamp();
      
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
    
    // Transfer money to bank
    interaction.client.database.updateBalance(userId, -amount);
    interaction.client.database.updateBank(userId, amount);
    interaction.client.database.logTransaction(userId, 'deposit', -amount, `Deposited $${amount} to bank`);
    
    const embed = new EmbedBuilder()
      .setColor('#00ff00')
      .setTitle('🏦 Deposit Successful!')
      .setDescription(`You've successfully deposited money into your bank account!`)
      .addFields(
        { name: '💰 Amount Deposited', value: `$${amount.toLocaleString()}`, inline: true },
        { name: '💵 New Wallet Balance', value: `$${(user.balance - amount).toLocaleString()}`, inline: true },
        { name: '🏦 New Bank Balance', value: `$${(user.bank + amount).toLocaleString()}`, inline: true }
      )
      .setTimestamp();
    
    await interaction.reply({ embeds: [embed] });
  },
}; 