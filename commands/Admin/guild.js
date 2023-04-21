const GuildDB = require('@Database/models/guilds');
const Logger = require('artie-logger');

module.exports = {
    name: 'guild',
    category: 'Admin',
    description: 'Manage or Update a Guilds Premium or Blacklist Status',
    usage: '/guild',
    userPerms: ['BOT_ADMIN'],
    basePerms: ['none'],
    options: [
        {
            name: 'guild_id',
            description: 'The guild ID',
            type: 'STRING',
            required: true
        },
        {
            name: 'banned',
            description: 'Is the guild banned?',
            type: 'BOOLEAN',
            required: true
        },
        {
            name: 'premium',
            description: 'Is this a premium guild?',
            type: 'BOOLEAN',
            required: true
        }
    ],

    run: async(client, interaction) => {

        let guild = await interaction.options.getString('guild_id');
        let banned = await interaction.options.getBoolean('banned');
        let premium = await interaction.options.getBoolean('premium');
        let guild_db = await GuildDB.findOne({ guildID: guild });
        let g = await client.guilds.cache.find(g => g.id === guild);

        if (!guild_db) return interaction.reply({ embeds: [
            new client.Artie.MessageEmbed()
             .setTitle('Error: Guild not found')
             .setColor('RED')
             .setThumbnail(client.logo)
             .setDescription('Unable to find that guild in our database! Please verify the Guild ID is correct!')
             .setTimestamp()
             .setFooter({ text: `${client.credits}`, iconURL: `${client.logo}` })
        ]})

        guild_db.banned = banned;
        guild_db.premium = premium;

        await guild_db.save().then(async () => {

            return interaction.reply({ embeds: [
                new client.Artie.MessageEmbed()
                 .setTitle('[OWNER_ACTION]: Guild updated')
                 .setColor(client.color)
                 .setThumbnail(client.logo)
                 .setDescription('Guild status has been updated')
                 .addFields(
                    {
                        name: 'Guild',
                        value: `${g ? g.name : guild}`,
                        inline: true
                    },
                    {
                        name: 'Premium',
                        value: `${premium}`,
                        inline: true
                    },
                    {
                        name: 'Banned',
                        value: `${banned}`,
                        inline: true
                    }
                 )
                 .setTimestamp()
                 .setFooter({ text: `${client.credits}`, iconURL: `${client.logo}` })

            ]})

        }).catch(async(err) => {

            await interaction.reply({ embeds: [
                new client.Artie.MessageEmbed()
                 .setTitle('Error: Settings update failed!')
                 .setColor('RED')
                 .setThumbnail(client.logo)
                 .setDescription('Failed to update guild settings. See below for reason!')
                 .addFields(
                    {
                        name: 'Error',
                        value: `${e.message}`,
                        inline: true
                    }
                 )
                 .setTimestamp()
                 .setFooter({ text: `${client.credits}`, iconURL: `${client.logo}`})
            ]})

            return Logger.error(`Failed updating settings for: ${interaction.guild.name} with error: ${e.stack}`)
        })
   }
}