const { Schema, model } = require('mongoose');

module.exports = model('guilds', new Schema({
    guildID: {
        type: String,
        required: true,
    },
    premium: {
        type: Boolean,
        default: false
    },
    banned: {
        type: Boolean,
        default: false
    },
    channel: {
        type: String,
        required: true
    },
    mentionOnly: {
        type: Boolean,
        default: false
    }
}));