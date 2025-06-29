const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('coinflip')
    .setDescription('Flip a coin to double your money')
    .addIntegerOption(option =>
      option.setName('bet')
        .setDescription('Amount to bet')
        .setRequired(true)
        .setMinValue(10)
        .setMaxValue(10000))
    .addStringOption(option =>
      option.setName('choice')
        .setDescription('Heads or Tails')
        .setRequired(true)
        .addChoices(
          { name: 'Heads', value: 'heads' },
          { name: 'Tails', value: 'tails' }
        )),
  
  cooldown: 3,
  
  async execute(interaction) {
    const userId = interaction.user.id;
    const username = interaction.user.username;
    const bet = interaction.options.getInteger('bet');
    const choice = interaction.options.getString('choice');
    
    const user = interaction.client.database.getUser(userId, username);
    
    if (bet > user.balance) {
      const embed = new EmbedBuilder()
        .setColor('#ff0000')
        .setTitle('❌ Insufficient Funds')
        .setDescription(`You don't have enough money to place this bet!`)
        .addFields(
          { name: '💵 Your Balance', value: `$${user.balance.toLocaleString()}`, inline: true },
          { name: '💰 Bet Amount', value: `$${bet.toLocaleString()}`, inline: true }
        )
        .setTimestamp();
      
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
    
    // Flip the coin
    const result = Math.random() < 0.5 ? 'heads' : 'tails';
    const won = choice === result;
    const winnings = won ? bet : -bet;
    
    // Update balance
    interaction.client.database.updateBalance(userId, winnings);
    interaction.client.database.logTransaction(userId, 'coinflip', winnings, `Coinflip: ${choice} vs ${result} - ${won ? 'WON' : 'LOST'}`);
    
    const embed = new EmbedBuilder()
      .setColor(won ? '#00ff00' : '#ff0000')
      .setTitle('🪙 Coin Flip')
      .setDescription(`**${result === 'heads' ? '🪙' : '🪙'} ${result.toUpperCase()}**`)
      .addFields(
        { name: '💰 Bet Amount', value: `$${bet.toLocaleString()}`, inline: true },
        { name: '🎯 Your Choice', value: choice.toUpperCase(), inline: true },
        { name: '🎲 Result', value: result.toUpperCase(), inline: true },
        { name: '📊 Outcome', value: won ? '✅ WON!' : '❌ LOST!', inline: true },
        { name: '💵 Net Gain', value: `${winnings >= 0 ? '+' : ''}$${winnings.toLocaleString()}`, inline: true },
        { name: '💵 New Balance', value: `$${(user.balance + winnings).toLocaleString()}`, inline: true }
      )
      .setTimestamp();
    
    await interaction.reply({ embeds: [embed] });
  },
}; 