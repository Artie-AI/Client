const GuildDB = require('@Database/models/guilds');
const Logger = require('artie-logger');

module.exports = {
    name: 'guildCreate',

    async execute(guild, client) {

        const embed = new client.Artie.MessageEmbed();

        let server = await GuildDB.findOne({ guildID: guild.id });

        if (!server) server = await GuildDB.create({
            guildID: guild.id,
            premium: false,
            banned: false,
            channel: 'arties-chat',
            mentionOnly: false
        })

        if (server.banned) {

            await Logger.error(`[GUILD_EVENT]: Banned guild detected: ${guild.name}(${guild.id})`);

            await guild.leave();

            return Logger.info('Artie has left the banned guild successfully!');
        }

        else {

            let owner = await guild.fetchOwner();

             embed.setTitle('[GUILD_EVENT]: Joined new guild')
             embed.setColor(client.color)
             embed.setThumbnail(client.logo)
             embed.setDescription('I have been added to a new guild')
             embed.addField('Guild ID', `${guild.id}`, true)
             embed.addField('Guild Name', `${guild.name}`, true)
             embed.addField('Guild Owner', `${owner.username}`)
             embed.setTimestamp()
             embed.setFooter({ text: `${client.credits}`, iconURL: `${client.logo}`})

             return client.channels.cache.get(client.config.logs).send({ embeds: [embed] });
        }
    }
}