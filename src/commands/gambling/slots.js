const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('slots')
    .setDescription('Play slots to win money')
    .addIntegerOption(option =>
      option.setName('bet')
        .setDescription('Amount to bet')
        .setRequired(true)
        .setMinValue(10)
        .setMaxValue(10000)),
  
  cooldown: 5,
  
  async execute(interaction) {
    const userId = interaction.user.id;
    const username = interaction.user.username;
    const bet = interaction.options.getInteger('bet');
    
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
    
    // Slot machine symbols and their values
    const symbols = ['🍎', '🍊', '🍇', '🍒', '💎', '7️⃣', '🎰', '⭐'];
    const symbolValues = {
      '🍎': 1, '🍊': 2, '🍇': 3, '🍒': 4, '💎': 10, '7️⃣': 25, '🎰': 50, '⭐': 100
    };
    
    // Generate random slots
    const slots = [];
    for (let i = 0; i < 3; i++) {
      slots.push(symbols[Math.floor(Math.random() * symbols.length)]);
    }
    
    // Check for wins
    let multiplier = 0;
    let winMessage = '';
    
    if (slots[0] === slots[1] && slots[1] === slots[2]) {
      // Three of a kind
      multiplier = symbolValues[slots[0]] * 3;
      winMessage = '🎉 JACKPOT! Three of a kind!';
    } else if (slots[0] === slots[1] || slots[1] === slots[2] || slots[0] === slots[2]) {
      // Two of a kind
      const matchingSymbol = slots[0] === slots[1] ? slots[0] : slots[2];
      multiplier = symbolValues[matchingSymbol] * 2;
      winMessage = '🎊 Two of a kind!';
    } else if (slots.includes('💎') || slots.includes('7️⃣') || slots.includes('🎰') || slots.includes('⭐')) {
      // Special symbols
      const specialSymbols = slots.filter(s => ['💎', '7️⃣', '🎰', '⭐'].includes(s));
      multiplier = specialSymbols.reduce((sum, symbol) => sum + symbolValues[symbol], 0);
      winMessage = '✨ Special symbols bonus!';
    }
    
    const winnings = bet * multiplier;
    const netGain = winnings - bet;
    
    // Update balance
    interaction.client.database.updateBalance(userId, netGain);
    interaction.client.database.logTransaction(userId, 'slots', netGain, `Slots: ${slots.join(' ')} - ${winMessage}`);
    
    const embed = new EmbedBuilder()
      .setColor(multiplier > 0 ? '#00ff00' : '#ff0000')
      .setTitle('🎰 Slot Machine')
      .setDescription(`**${slots.join(' | ')}**`)
      .addFields(
        { name: '💰 Bet Amount', value: `$${bet.toLocaleString()}`, inline: true },
        { name: '🎯 Multiplier', value: `${multiplier}x`, inline: true },
        { name: '💵 Winnings', value: `$${winnings.toLocaleString()}`, inline: true },
        { name: '📊 Net Gain', value: `${netGain >= 0 ? '+' : ''}$${netGain.toLocaleString()}`, inline: true },
        { name: '💵 New Balance', value: `$${(user.balance + netGain).toLocaleString()}`, inline: true }
      )
      .setFooter({ text: winMessage || 'Better luck next time!' })
      .setTimestamp();
    
    await interaction.reply({ embeds: [embed] });
  },
}; 