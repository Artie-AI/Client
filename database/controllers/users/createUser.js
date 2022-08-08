const MongoDB = require("mongoose");
const UserModel = require("@Database/models/users");
const Logger = require("artie-logger");

module.exports.createUser = async ({ user, premium, banned }) => {
  if (!user) {
    return Logger.error(
      "[CREATE_USER]: User ID should be a valid Snowflake String"
    );
  } else if (!premium) {
    Logger.error(
      "[CREATE_USER]: Premium option should be one of `true` or `false`"
    );
  } else if (!banned) {
    Logger.error(
      "[CREATE_USER]: Banned option should be one of `true` or `false`"
    );
  } else {
    UserModel.create({
      userID: user,
      premium: premium,
      banned: banned,
    })
      .then(() => {
        Logger.info("[CREATE_USER]: New user added successfully");
      })
      .catch((e) => {
        Logger.error(`[CREATE_USER]: Failed to add new user: ${e.stack}`);
      });

    await UserModel.save();
  }
};
