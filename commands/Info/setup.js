module.exports = {
  name: "setup",
  category: "Info",
  description: "Information about setting up Artie",
  userPerms: ["none"],
  basePerms: ["none"],

  run: async (client, interaction) => {
    const embed = new client.Artie.MessageEmbed()
      .setTitle("Setup Information")
      .setColor(client.color)
      .setThumbnail(client.logo)
      .setDescription("Hey there, here is some info to help you along the way!")
      .addField(
        "Channels",
        "By default Artie requires a channel named `arties-chat`",
        true
      )
      .addField(
        "Server Bans",
        "Our developers reserve the right to ban any server at any time if they have reason to believe the server is abusing or mistreating our services.",
        true
      )
      .addField(
        "User Bans",
        "Our developers reserve the right to ban any user at any time if they have reason to believe the user is abusing or mistreating our services",
        true
      )
      .setTimestamp()
      .setFooter({
        text: "[NOTE]: Channel Requirements aren't permanent",
        iconURL: `${client.logo}`,
      });

    await interaction.reply({ embeds: [embed] });
  },
};
