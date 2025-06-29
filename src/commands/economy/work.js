const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('work')
    .setDescription('Work to earn money'),
  
  cooldown: 1,
  
  async execute(interaction) {
    const userId = interaction.user.id;
    const username = interaction.user.username;
    
    if (!interaction.client.database.canWork(userId)) {
      const user = interaction.client.database.getUser(userId, username);
      const lastWork = new Date(user.last_work);
      const nextWork = new Date(lastWork.getTime() + 30 * 60 * 1000); // 30 minutes
      
      const embed = new EmbedBuilder()
        .setColor('#ff0000')
        .setTitle('⏰ Work Cooldown')
        .setDescription(`You're too tired to work right now!`)
        .addFields(
          { name: 'Next Work Available', value: `<t:${Math.floor(nextWork.getTime() / 1000)}:R>`, inline: false }
        )
        .setTimestamp();
      
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
    
    // Work jobs and rewards
    const jobs = [
      { name: '👨‍💼 Office Worker', min: 50, max: 100 },
      { name: '👷 Construction Worker', min: 75, max: 150 },
      { name: '🚗 Uber Driver', min: 60, max: 120 },
      { name: '🍕 Pizza Delivery', min: 40, max: 80 },
      { name: '💻 Freelance Developer', min: 100, max: 200 },
      { name: '🎨 Graphic Designer', min: 80, max: 160 },
      { name: '📝 Content Writer', min: 70, max: 140 },
      { name: '🔧 Mechanic', min: 90, max: 180 }
    ];
    
    const selectedJob = jobs[Math.floor(Math.random() * jobs.length)];
    const earned = Math.floor(Math.random() * (selectedJob.max - selectedJob.min + 1)) + selectedJob.min;
    
    // Calculate level bonus
    const user = interaction.client.database.getUser(userId, username);
    const levelBonus = Math.floor(user.level * 5);
    const totalEarned = earned + levelBonus;
    
    // Update database
    interaction.client.database.work(userId);
    interaction.client.database.updateBalance(userId, totalEarned);
    interaction.client.database.addXP(userId, 15);
    interaction.client.database.logTransaction(userId, 'work', totalEarned, `Worked as ${selectedJob.name}`);
    
    const embed = new EmbedBuilder()
      .setColor('#00ff00')
      .setTitle('💼 Work Complete!')
      .setDescription(`You worked hard and earned some money!`)
      .addFields(
        { name: '💼 Job', value: selectedJob.name, inline: true },
        { name: '💵 Base Pay', value: `$${earned}`, inline: true },
        { name: '⭐ Level Bonus', value: `+$${levelBonus}`, inline: true },
        { name: '💰 Total Earned', value: `$${totalEarned}`, inline: true },
        { name: '📈 XP Gained', value: '15 XP', inline: true }
      )
      .setTimestamp()
      .setFooter({ text: 'Come back in 30 minutes to work again!' });
    
    await interaction.reply({ embeds: [embed] });
  },
}; 