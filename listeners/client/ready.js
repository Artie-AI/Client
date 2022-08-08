const { DatabaseClient } = require("@Database/client");
const config = require("@Settings/config");

module.exports = {
  name: "ready",
  once: true,

  async execute(client) {
    await DatabaseClient({ connectionURL: config.mongo });

    await client.utils.handleStatus(client);

    let embed = new client.Artie.MessageEmbed()
      .setTitle("Startup Logs")
      .setColor(client.color)
      .setThumbnail(client.logo)
      .setDescription("Startup successful")
      .addField("Guilds", `${client.guilds.cache.size}`, true)
      .addField("Channels", `${client.channels.cache.size}`, true)
      .addField("Users", `${client.users.cache.size}`, true)
      .setTimestamp()
      .setFooter({ text: `${client.credits}`, iconURL: `${client.logo}` });

    await client.channels.cache
      .get(client.config.logs)
      .send({ embeds: [embed] });

    return client.logger.info(`${client.user.username} is online and ready!`);
  },
};
