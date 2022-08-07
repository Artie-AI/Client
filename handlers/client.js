const fs = require("fs");
const chalk = require("chalk");

/**
 * Load Events
 */
const loadEvents = async function (client) {
    const eventFolders = fs.readdirSync("./listeners");
    for (const folder of eventFolders) {
        const eventFiles = fs
        .readdirSync(`./listeners/${folder}`)
        .filter((file) => file.endsWith(".js"));
        
        for (const file of eventFiles) {
            const event = require(`../listeners/${folder}/${file}`);
            
            if (event.name) {
                client.logger.info(`Client Event: ${file} of Category: ${folder} has been Loaded Successfully!`, 'event');
            } else {
                client.logger.info(`Client Event: ${file} of Category: ${folder} is missing a Name or Name is not a string.`, 'error');
                continue;
            }
            
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args, client));
            } else {
                client.on(event.name, (...args) => event.execute(...args, client));
            }
        }
    }
}

/**
 * Load SlashCommands
 */
const loadSlashCommands = async function (client) {
    let slash = []

    const commandFolders = fs.readdirSync("./commands");
    for (const folder of commandFolders) {
        const commandFiles = fs
        .readdirSync(`./commands/${folder}`)
        .filter((file) => file.endsWith(".js"));
        
        for (const file of commandFiles) {
            const command = require(`../commands/${folder}/${file}`);
            
            if (command.name) {
                client.slash.set(command.name, command);
                slash.push(command)
                client.logger.info(`Command: ${file} of Category: ${folder} has been Loaded Successfully!`, 'cmd')
            } else {
                return client.logger.info(`Command: ${file} of Category: ${folder} is missing a Name or Name is not a string.`, 'error')
            }
        }
    }

    client.on("ready", async() => {
        await client.application.commands.set(slash).then(() => {
            client.logger.info('Slash Commands have been registered with the Discord API', 'event')
        }).catch((e) => {
            client.logger.error(`Failed to register Slash Commands: ${e.stack}`, 'error')
        })
    })
}

module.exports = {
    loadEvents,
    loadSlashCommands
}