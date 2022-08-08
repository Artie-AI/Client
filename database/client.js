const mongo = require("mongoose");
const config = require("@Settings/config");
const Logger = require("artie-logger");

module.exports.DatabaseClient = async ({ connectionURL }) => {
  if (!connectionURL) return Logger.error("Please provide a connection url");

  await mongo
    .connect(connectionURL, {
      family: 4,
      autoIndex: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 10000,
    })
    .then(() => {
      Logger.info("Connected to the Database Successfully!");
    })
    .catch((e) => {
      Logger.error(`Error connecting to the Database: ${e.stack}`);
    });

  mongo.connection.on("connected", () => {
    Logger.info("Database Connection has been Established Successfully!");
  });

  mongo.connection.on("err", () => {
    Logger.error("Error occurred while Establishing the Connection");
  });

  mongo.connection.on("disconnected", () => {
    Logger.error("Database Connection dropped. Please wait...");
  });
};
