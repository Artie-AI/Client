module.exports = {
  name: "interactionCreate",

  async execute(interaction, client) {
    if (!interaction.isCommand()) return;

    const command = client.slash.get(interaction.commandName);

    if (!command) return interaction.reply({ content: "Command not found!" });

    if (
      command.userPerms.includes("BOT_ADMIN") &&
      !client.config.Admins.includes(interaction.user.id)
    ) {
      return interaction.reply({
        content: "You do not have permission to use this command!",
        ephemeral: true,
      });
    }

    if (
      command.basePerms &&
      !interaction.member.permissions.has(command.basePerms)
    ) {
      return interaction.reply({
        content: `You need: \`${command.basePerms}\` to use this command!`,
        ephemeral: true,
      });
    }

    const args = [];

    for (let option of interaction.options.data) {
      if (option.type === "SUB_COMMAND") {
        if (option.name) args.push(option.name);
        option.options?.forEach((x) => {
          if (x.value) args.push(x.value);
        });
      } else if (option.value) args.push(option.value);
    }

    try {
      command.run(client, interaction, args);
    } catch (e) {
      interaction.reply({
        content: `Interaction failed: ${e.message}`,
        ephemeral: true,
      });
    }
  },
};
