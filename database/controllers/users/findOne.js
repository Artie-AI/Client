const MongoDB = require("mongoose");
const UserModel = require("@Database/models/users");
const Logger = require("artie-logger");

module.exports.findOne = async ({ user }) => {
  if (!user) {
    return Logger.error(
      "[CREATE_USER]: User ID should be a valid Snowflake String"
    );
  } else {
    let userdb = UserModel.findOne({
      userID: user,
    })
      .then(() => {
        Logger.info("[FIND_ONE]: Found User successfully");
      })
      .catch((e) => {
        Logger.error(`[FIND_ONE]: Failed to find user: ${e.stack}`);
      });

    return userdb;
  }
};
