const GuildDB = require('@Database/models/guilds');
const Logger = require('artie-logger');

module.exports = {
    name: 'config',
    category: 'Guild',
    description: 'Set or View your guild config',
    userPerms: ['MANAGE_GUILD'],
    basePerms: ['none'],
    options: [
        {
            name: 'set',
            description: 'Set your guild config',
            options: [
                {
                    name: 'channel',
                    description: 'The channel for artie to use',
                    type: 'CHANNEL',
                    required: true
                },
                {
                    name: 'mentions',
                    description: 'Should artie only respond to mentions?',
                    type: 'BOOLEAN',
                    required: true
                }
            ],
            type: 'SUB_COMMAND', 
        },
        {
            name: 'view',
            description: 'Check your guild config',
            type: 'SUB_COMMAND'
        }
    ],

    run: async(client, interaction) => {

        let channel = await interaction.options.getChannel('channel');
        let mentions = await interaction.options.getBoolean('mentions');
        let guild = await GuildDB.findOne({ guildID: interaction.guild.id });

        switch (interaction.options.getSubcommand()) {

            case 'set': 

            if (!guild) guild = await GuildDB.create({
                guildID: interaction.guild.id,
                premium: false,
                banned: false,
                channel: channel.name,
                mentionOnly: mentions
            });
    
            else {

                guild.channel = channel.name; 
                guild.mentionOnly = mentions;

                await guild.save().then(async () => {

                    return interaction.reply({ embeds: [
                        new client.Artie.MessageEmbed()
                         .setTitle('Guild Settings Updated!')
                         .setColor(client.color)
                         .setThumbnail(client.logo)
                         .setDescription('Okay, your guild settings have been updated!')
                         .addFields(
                            {
                                name: 'Channel',
                                value: `${channel}`,
                                inline: true
                            },
                            {
                                name: 'Mentions',
                                value: `${mentions}`,
                                inline: true
                            }
                         )
                         .setTimestamp()
                         .setFooter({ text: `${client.credits}`, iconURL: `${client.logo}`})
                    ]})
                }).catch(async(e) => {

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

            break;

            case 'view':
                
            let chan = await interaction.guild.channels.cache.find(c => c.name === guild.channel);
            let ment = await guild.mentionOnly ? 'Only responds when mentioned in the set channel' : 'Responds to all messages in the set channel';
            let prem = await guild.premium ? 'Guild has premium features' : 'Guild does not have premium features';

            return interaction.reply({ embeds: [
                new client.Artie.MessageEmbed()
                 .setTitle('Current Guild Config')
                 .setColor(client.color)
                 .setThumbnail(client.logo)
                 .setDescription('Here is your guild config, You can update these values by re-running the config command with the `set` option (ex: `/config set`)')
                 .addFields(
                    {
                        name: 'Chat Channel',
                        value: `${chan}`,
                        inline: true
                    },
                    {
                        name: 'Mention Only',
                        value: `${ment}`,
                        inline: true
                    },
                    {
                        name: 'Premium',
                        value: `${prem}`,
                        inline: true
                    }
                 )
                 .setTimestamp()
                 .setFooter({ text: `${client.credits}`, iconURL: `${client.logo}`})
            ]})
        }
    }
}