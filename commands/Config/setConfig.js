const GuildDB = require("@Database/models/guilds");
const Logger = require("artie-logger");

module.exports = {
  name: "set_config",
  category: "Config",
  description: "Set a guild config value",
  userPerms: ["MANAGE_GUILD"],
  basePerms: ["none"],
  options: [
    {
      name: "channel",
      description: "Type the channel name (Ex: dev-chat)",
      type: "STRING",
      required: true,
    },
    {
      name: "mentions",
      description: "true or false",
      type: "STRING",
      required: true,
    },
  ],

  run: async (client, interaction) => {
    let channel = await interaction.options.getString("channel");
    let mentions = await interaction.options.getString("mentions");

    let guild = await GuildDB.findOne({ guildID: interaction.guild.id });

    if (!guild)
      return interaction.reply({
        content:
          "Unable to find your guild in our Database. Please run the sync command.",
      });
    else {
      guild.channel = channel;
      guild.mentionOnly = mentions === "true" ? true : false;

      await guild
        .save()
        .then(async () => {
          let embed = new client.Artie.MessageEmbed()
            .setTitle("Guild Settings Updated")
            .setColor(client.color)
            .setThumbnail(client.logo)
            .setDescription("Okay, your new settings have been saved!")
            .addField("Channel", `${channel}`, true)
            .addField("Mentions", `${mentions === "true" ? true : false}`, true)
            .setTimestamp()
            .setFooter({
              text: `${client.credits}`,
              iconURL: `${client.logo}`,
            });

          return interaction.reply({ embeds: [embed] });
        })
        .catch(async (e) => {
          let embed = new client.Artie.MessageEmbed()
            .setTitle("Guild Settings Update Failed")
            .setColor(client.color)
            .setThumbnail(client.logo)
            .setDescription("Failed to update settings")
            .addField("Error", `${e.message}`, true)
            .setTimestamp()
            .setFooter({
              text: `${client.credits}`,
              iconURL: `${client.logo}`,
            });

          await interaction.reply({ embeds: [embed] });

          Logger.error(`Failed setting guild config: ${e.stack}`);
        });
    }
  },
};
