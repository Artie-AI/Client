const { Schema, model } = require("mongoose");

module.exports = model(
  "users",
  new Schema({
    userID: {
      type: String,
      required: true,
    },
    premium: {
      type: Boolean,
      default: false,
    },
    banned: {
      type: Boolean,
      default: false,
    },
  })
);
