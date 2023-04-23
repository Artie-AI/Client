const { DatabaseClient } = require('@Database/client');
//const { InfinityAutoPoster } = require('@infinitybots/autoposter');
const ClientStats = require('@Database/models/client');
const config = require('@Settings/config');

module.exports = {
    name: 'ready',
    once: true,

    async execute(client) {

        await DatabaseClient({ connectionURL: config.mongo });
        await ClientStats.create({
                guilds: client.guilds.cache.size,
                channels: client.channels.cache.size,
                users: client.users.cache.size,
        });

        /**const poster = InfinityAutoPoster('', client);

        poster.on('posted', (stats) => {
            console.log('Stats posted to Infinity Bot List!')
            console.log(stats);
        });

        poster.on('error', (err) => {
            console.log(`Error posting stats to Infinity Bot List: ${err}`);
        })*/

        await client.utils.handleStatus(client);

        await client.channels.cache.get(client.config.logs).send({ embeds: [
            new client.Artie.MessageEmbed()
             .setTitle('Startup Logs')
             .setColor(client.color)
             .setThumbnail(client.logo)
             .setDescription('Startup successful')
             .addFields(
                {
                    name: 'Guilds',
                    value: `${client.guilds.cache.size}`,
                    inline: true
                }, 
                {
                    name: 'Channels',
                    value: `${client.channels.cache.size}`,
                    inline: true
                },
                {
                    name: 'Users',
                    value: `${client.users.cache.size}`,
                    inline: true
                }
             )
             .setTimestamp()
             .setFooter({ text: `${client.credits}`, iconURL: `${client.logo}`})
        ]});

        return client.logger.info(`${client.user.username} is online and ready!`);         
    }
}
