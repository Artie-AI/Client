const UserDB = require('@Database/models/users');
const Logger = require('artie-logger');

module.exports = {
    name: 'user',
    category: 'Admin',
    description: 'Manage or Update a Users Premium or Blacklist Status',
    usage: '/guild',
    userPerms: ['BOT_ADMIN'],
    basePerms: ['none'],
    options: [
        {
            name: 'user_id',
            description: 'The user ID',
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

        let user = await interaction.options.getString('user_id');
        let banned = await interaction.options.getBoolean('banned');
        let premium = await interaction.options.getBoolean('premium');
        let user_db = await UserDB.findOne({ userID: user });
        let u = await client.users.fetch(user);

        if (banned === true && user === '510065483693817867') return;

        if (!user_db) return interaction.reply({ embeds: [
            new client.Artie.MessageEmbed()
             .setTitle('Error: User not found')
             .setColor('RED')
             .setThumbnail(client.logo)
             .setDescription('Unable to find that user in our database! Please verify the User ID is correct!')
             .setTimestamp()
             .setFooter({ text: `${client.credits}`, iconURL: `${client.logo}` })
        ]})

        user_db.banned = banned;
        user_db.premium = premium;

        await user_db.save().then(async () => {

            return interaction.reply({ embeds: [
                new client.Artie.MessageEmbed()
                 .setTitle('[OWNER_ACTION]: User updated')
                 .setColor(client.color)
                 .setThumbnail(client.logo)
                 .setDescription('User status has been updated')
                 .addFields(
                    {
                        name: 'User',
                        value: `${u ? u.username : user}`,
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
                 .setDescription('Failed to update user settings. See below for reason!')
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