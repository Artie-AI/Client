module.exports = {
  name: "invite",
  category: "Info",
  description: "Get a link to invite Artie!",
  userPerms: ["none"],
  basePerms: ["none"],

  run: async (client, interaction) => {
    const inv =
      "https://discord.com/api/oauth2/authorize?client_id=910319339712950282&permissions=466108153169&scope=bot%20applications.commands";

    const embed = new client.Artie.MessageEmbed()
      .setTitle("Invite Artie")
      .setColor(client.color)
      .setThumbnail(client.logo)
      .setDescription(`You can invite me using [This Link](${inv})`)
      .setTimestamp()
      .setFooter({ text: `${client.credits}`, iconURL: `${client.logo}` });

    await interaction.reply({ embeds: [embed] });
  },
};
