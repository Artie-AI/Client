const { Schema, model } = require('mongoose');

module.exports = model('client_stats', new Schema({
    guilds: {
        type: Number,
        default: 0,
    },
    channels: {
        type: Number,
        default: 0
    },
    users: {
        type: Number,
        default: 0
    }
}));
