const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('buy')
    .setDescription('Buy an item from the shop')
    .addIntegerOption(option =>
      option.setName('item_id')
        .setDescription('ID of the item to buy')
        .setRequired(true)
        .setMinValue(1)),
  
  cooldown: 3,
  
  async execute(interaction) {
    const userId = interaction.user.id;
    const username = interaction.user.username;
    const itemId = interaction.options.getInteger('item_id');
    
    try {
      interaction.client.database.buyItem(userId, itemId);
      
      const user = interaction.client.database.getUser(userId, username);
      const items = interaction.client.database.getShopItems();
      const item = items.find(i => i.id === itemId);
      
      const embed = new EmbedBuilder()
        .setColor('#00ff00')
        .setTitle('🛒 Purchase Successful!')
        .setDescription(`You've successfully purchased **${item.name}**!`)
        .addFields(
          { name: '💰 Price Paid', value: `$${item.price.toLocaleString()}`, inline: true },
          { name: '💵 New Balance', value: `$${user.balance.toLocaleString()}`, inline: true },
          { name: '📦 Item Type', value: item.type, inline: true },
          { name: '✨ Effect', value: item.effect, inline: true }
        )
        .setTimestamp();
      
      await interaction.reply({ embeds: [embed] });
      
    } catch (error) {
      const embed = new EmbedBuilder()
        .setColor('#ff0000')
        .setTitle('❌ Purchase Failed')
        .setDescription(error.message)
        .setTimestamp();
      
      await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
}; 