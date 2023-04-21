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

             return client.channels.cache.get(client.config.logs).send({ embeds: [
                new client.Artie.MessageEmbed()
                 .setTitle('[GUILD_EVENT]: Joined new guild')
                 .setColor(client.color)
                 .setThumbnail(client.logo)
                 .setDescription('I have been added to a new guild')
                 .addFields(
                    {
                        name: 'Guild ID',
                        value: `${guild.id}`,
                        inline: true
                    },
                    {
                        name: 'Guild Name',
                        value: `${guild.name}`,
                        inline: true
                    },
                    {
                        name: 'Guild Owner',
                        value: `${owner.user.tag}`,
                        inline: true
                    }
                 )
                 .setTimestamp()
                 .setFooter({ text: `${client.credits}`, iconURL: `${client.logo}`})
             ]});
        }
    }
}