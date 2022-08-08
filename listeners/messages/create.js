const UserModel = require("@Database/models/users");
const GuildModel = require("@Database/models/guilds");
const { findOne } = require("@Database/controllers/users/findOne");
const Logger = require("artie-logger");

module.exports = {
  name: "messageCreate",

  async execute(message, client) {
    if (message.author.bot) return;

    if (message.guild) {
      let g = await GuildModel.findOne({ guildID: message.guild.id });

      if (!g)
        g = await GuildDB.create({
          guildID: message.guild.id,
          premium: false,
          banned: false,
          channel: "arties-chat",
          mentionOnly: false,
        });

      let user_check = await UserModel.findOne({ userID: message.author.id });

      if (!user_check)
        await UserModel.create({
          userID: message.author.id,
          premium: false,
          banned: false,
        });

      if (user_check.banned) {
        if (
          message.content.startsWith(`<@${message.client.user.id}>`) ||
          message.content.startsWith(`<@!${message.client.user.id}>`)
        ) {
          return message.author
            .send({
              content:
                "Hey there, i am ignoring your base messages because you have been banned from using my services. Join here to resolve this: https://discord.gg/RPqGSeAnPf",
            })
            .catch(() => {
              message.reply("Please allow DMs from me and then ping me again");
            });
        }
        return;
      }

      if (g.mentionOnly) {
        if (
          message.content.startsWith(`<@${message.client.user.id}>`) ||
          message.content.startsWith(`<@!${message.client.user.id}>`)
        ) {
          await client.utils.handleChat(message);
        }
      } else {
        await client.utils.handleChat(message);
      }
    } else if (message.guild === null) {
      let user_check = await UserModel.findOne({ userID: message.author.id });

      if (user_check && user_check.banned) {
        return message.reply({
          content:
            "Hey there, you have been banned from using my services. Join here to resolve this: https://discord.gg/RPqGSeAnPf",
        });
      }

      await client.utils.handleDirectMessage(message);
    }
  },
};
