const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('shop')
    .setDescription('View the shop and buy items'),
  
  cooldown: 5,
  
  async execute(interaction) {
    const items = interaction.client.database.getShopItems();
    
    if (items.length === 0) {
      const embed = new EmbedBuilder()
        .setColor('#ff0000')
        .setTitle('🏪 Shop')
        .setDescription('No items available in the shop at the moment.')
        .setTimestamp();
      
      return interaction.reply({ embeds: [embed] });
    }
    
    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('🏪 Economy Shop')
      .setDescription('Browse our selection of items and boosts!')
      .setTimestamp();
    
    items.forEach((item, index) => {
      embed.addFields({
        name: `${index + 1}. ${item.name} - $${item.price.toLocaleString()}`,
        value: `${item.description}\n**Type:** ${item.type} | **Effect:** ${item.effect}`,
        inline: false
      });
    });
    
    embed.setFooter({ text: 'Use /buy <item_id> to purchase an item' });
    
    await interaction.reply({ embeds: [embed] });
  },
}; 