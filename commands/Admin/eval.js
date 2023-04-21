const util = require("util");
const { isArgumentsObject } = require("util/types");

module.exports = {
    name: 'eval',
    category: 'Admin',
    description: 'Evaluate some Javascript Code',
    usage: '/eval',
    userPerms: ['BOT_ADMIN'],
    basePerms: ['none'],
    options: [
        {
            name: 'eval',
            description: 'Code to be evaluated',
            type: 'STRING',
            required: true
        },
        {
            name: 'options',
            description: 'Evaluation options (`a` or `async` to use with async)',
            type: 'STRING',
            required: false
        }
    ],

    run: async(client, interaction) => {

        let evaled = await interaction.options.getString("eval")

        try {

            if (interaction.options.getString("options") === 'a' || interaction.options.getString("options") === 'async') {
                evaled = `(async () => { ${interaction.options.getString("eval") }})()`
            }

            evaled = await eval(evaled);

            if (typeof evaled === 'object') {
                evaled = util.inspect(evaled, { depth: 0, showHidden: true });
            } else {
                evaled = String(evaled);
            }

        } catch (e) {

            let embed = new client.Artie.MessageEmbed()
              .setTitle('Eval Failed')
              .setColor(client.color)
              .setThumbnail(client.logo)
              .setDescription(`Error: ${e.message}`)
              .setTimestamp()
              .setFooter({ text: `${client.credits}`, iconURL: `${client.logo}`})

              interaction.reply({ embeds: [embed], ephemeral: true })

            return client.logger.sendLogs(`Error: ${e.stack}`, 'error');
        }

        const token = client.config.token;
        const regex = new RegExp(token + 'g');
        
        if (evaled.includes(token) || evaled.includes(regex)) {
            
            evaled = evaled.replace(regex, '[REDACTED]')
        }

        const fullLen = evaled.length;

        if (fullLen === 0) {
            return null;
        } else if (fullLen > 2000) {
            evaled = evaled.match(/[\s\S]{1,1900}[\n\r]/g) || []

            if (evaled.length > 3) {

                interaction.channel.send({ content: `\`\`\`js\n${evaled[0]}\`\`\`` })
                interaction.channel.send({ content: `\`\`\`js\n${evaled[1]}\`\`\`` })
                interaction.channel.send({ content: `\`\`\`js\n${evaled[2]}\`\`\`` })
                
                return
            }

            return evaled.forEach((message) => {

                interaction.reply({ content: `\`\`\`js\n${message}\`\`\``})

                return;
            })
        }

        let embed = new client.Artie.MessageEmbed()
         .setTitle('Eval Results')
         .setColor(client.color)
         .setThumbnail(client.logo)
         .addField('Input', `${interaction.options.getString("eval")}`, true)
         .addField('Output', `${evaled}`, true)
         .setTimestamp()
         .setFooter({ text: `${client.credits}`, iconURL: `${client.logo}`})

         return interaction.reply({ embeds: [embed] });
   }
}