const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('transfer')
    .setDescription('Transfer money to another user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to transfer money to')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('Amount to transfer')
        .setRequired(true)
        .setMinValue(1)),
  
  cooldown: 5,
  
  async execute(interaction) {
    const fromUserId = interaction.user.id;
    const fromUsername = interaction.user.username;
    const toUser = interaction.options.getUser('user');
    const toUserId = toUser.id;
    const amount = interaction.options.getInteger('amount');
    
    // Prevent self-transfer
    if (fromUserId === toUserId) {
      const embed = new EmbedBuilder()
        .setColor('#ff0000')
        .setTitle('❌ Invalid Transfer')
        .setDescription(`You cannot transfer money to yourself!`)
        .setTimestamp();
      
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
    
    const fromUser = interaction.client.database.getUser(fromUserId, fromUsername);
    
    if (amount > fromUser.balance) {
      const embed = new EmbedBuilder()
        .setColor('#ff0000')
        .setTitle('❌ Insufficient Funds')
        .setDescription(`You don't have enough money in your wallet!`)
        .addFields(
          { name: '💵 Your Balance', value: `$${fromUser.balance.toLocaleString()}`, inline: true },
          { name: '💰 Amount Requested', value: `$${amount.toLocaleString()}`, inline: true }
        )
        .setTimestamp();
      
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
    
    // Transfer money
    interaction.client.database.transferMoney(fromUserId, toUserId, amount);
    interaction.client.database.logTransaction(fromUserId, 'transfer_sent', -amount, `Transferred $${amount} to ${toUser.username}`);
    interaction.client.database.logTransaction(toUserId, 'transfer_received', amount, `Received $${amount} from ${fromUsername}`);
    
    const embed = new EmbedBuilder()
      .setColor('#00ff00')
      .setTitle('💸 Transfer Successful!')
      .setDescription(`You've successfully transferred money to ${toUser.username}!`)
      .addFields(
        { name: '💰 Amount Transferred', value: `$${amount.toLocaleString()}`, inline: true },
        { name: '👤 Recipient', value: toUser.username, inline: true },
        { name: '💵 New Balance', value: `$${(fromUser.balance - amount).toLocaleString()}`, inline: true }
      )
      .setTimestamp();
    
    await interaction.reply({ embeds: [embed] });
  },
}; 