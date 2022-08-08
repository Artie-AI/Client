const moment = require('moment');

module.exports = {
    name: 'about',
    category: 'Info',
    description: 'About Artie',
    userPerms: ['none'],
    basePerms: ['none'],

    run: async(client, interaction) => {

        const row = new client.Artie.MessageActionRow()
         .addComponents(
            new client.Artie.MessageButton()
             .setLabel('Website')
             .setStyle('LINK')
             .setURL('https://artie.live'),
            new client.Artie.MessageButton()
             .setLabel('Invite')
             .setStyle('LINK')
             .setURL('https://discord.com/api/oauth2/authorize?client_id=910319339712950282&permissions=466108153169&scope=bot%20applications.commands'),
            new client.Artie.MessageButton()
             .setLabel('Support')
             .setStyle('LINK')
             .setURL('https://discord.gg/RPqGSeAnPf'),
            new client.Artie.MessageButton()
             .setLabel('Twitter')
             .setStyle('LINK')
             .setURL('https://twitter.com/ArtieTheAI'),
            new client.Artie.MessageButton()
             .setLabel('GitHub')
             .setStyle('LINK')
             .setURL('https://github.com/Artie-AI')
         )

         const embed = new client.Artie.MessageEmbed()
          .setTitle('About Artie')
          .setColor(client.color)
          .setThumbnail(client.logo)
          .setDescription(`Unlike other AI Artie is a Deep Machine Learning AI that uses basic human science such as a brain for its responses.`)
          .addField('Creator', '[Toxic Dev#5936](https://github.com/TheRealToxicDev)', true)
          .addField('Created', `${moment(client.user.createdAt).format("MM/DD/YYYY HH:mm:ss A")}`, true)
          .addField('Ping', `${client.ws.ping}ms`, true)
          .addField('Guilds', `${client.guilds.cache.size}`, true)
          .addField('Users', `${client.users.cache.size}`, true)
          .addField('Channels', `${client.channels.cache.size}`, true)
          .setTimestamp()
          .setFooter({ text: `${client.credits}`, iconURL: `${client.logo}`})

          return interaction.reply({ embeds: [embed], components: [row] });
    }
}