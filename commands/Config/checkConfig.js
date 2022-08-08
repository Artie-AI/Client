const GuildDB = require("@Database/models/guilds");
const Logger = require("artie-logger");

module.exports = {
  name: "check_config",
  category: "Config",
  description: "Check your current guild config",
  userPerms: ["MANAGE_GUILD"],
  basePerms: ["none"],

  run: async (client, interaction) => {
    let guild = await GuildDB.findOne({ guildID: interaction.guild.id });

    if (!guild)
      return interaction.reply({
        content: "Guild config not found. Please use the `set_config` command.",
      });

    let chan = await client.channels.cache.find(
      (c) => c.name === guild.channel
    );
    let ment = guild.mentionOnly
      ? "Only responds when mentioned"
      : "Responds to all messages";
    let prem = guild.premium
      ? "Has premium feature"
      : "Has no premium features";

    let embed = new client.Artie.MessageEmbed()
      .setTitle("Current Guild Config")
      .setColor(client.color)
      .setThumbnail(client.logo)
      .setDescription(
        "Here is your current guild config. You can change these values using the `set_config` command"
      )
      .addField("Chat Channel", `<#${chan.id}>`, true)
      .addField("Mention Only", `${ment}`, true)
      .addField("Premium Guild", `${prem}`, true)
      .setTimestamp()
      .setFooter({ text: `${client.credits}`, iconURL: `${client.logo}` });

    return interaction.reply({ embeds: [embed] });
  },
};
