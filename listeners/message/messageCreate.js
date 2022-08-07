const UserModel = require('@Database/models/users');
const Logger = require('artie-logger');

module.exports = {
    name: 'messageCreate',

    async execute(message, client) {

        if (message.author.bot) return;
        
        if (message.guild) {

            let user_check = await UserModel.findOne({ userID: message.author.id });

            if (!user_check) await UserModel.create({
                userID: message.author.id,
                premium: false,
                banned: false
            })

            if (user_check.banned) return;

            if (message.content.startsWith(`<@${message.client.user.id}>`) || message.content.startsWith(`<@!${message.client.user.id}>`)) {
                return message.channel.send('Please run my `/help` or `/setup` slash command(s) for setup info and usage instructions xD')
            }
            
            await client.utils.handleChat(message);
        }

        else if (message.channel.type === 'dm') {

            await client.utils.handleDirectMessage(message);
        }
    }
}