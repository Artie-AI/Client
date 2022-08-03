const request = require('node-fetch');
const {
    URL,
    URLSearchParams
} = require('url');
const {
    chat
} = require('./misc/config.json');
const mainURL = new URL(chat.url);
const urlOptions = {
    bid: chat.brainID,
    key: chat.key,
    uid: null,
    msg: null
};
const handleStatus = (client, status) => {
    let statuses = [
        'Chatting with peeps',
        'with https://artie.live',
        '@Mention for help/information'
    ]

    client.user.setStatus(status.state);

    setInterval(function() {
        let status = statuses[Math.floor(Math.random() * statuses.length)];

        client.user.setActivity(status, {
            type: 'PLAYING'
        })
    }, 10000)
};

const handleTalk = async (msg) => {
    msg.content = msg.content.replace(/^<@!?[0-9]{1,20}> ?/i, '');
    if (msg.content.length < 2 || (chat.channel != msg.channel.name)) return;
    msg.channel.sendTyping();
    urlOptions.uid = msg.author.id;
    urlOptions.msg = msg.content;
    mainURL.search = new URLSearchParams(urlOptions).toString();
    try {
        let reply = await request(mainURL);
        if (reply) {
            reply = await reply.json();
            msg.reply({
                content: reply.cnt,
                allowedMentions: {
                    repliedUser: false
                }
            })
        }
    } catch (e) {
        console.log(e.stack);
    }
};

module.exports = {
    handleStatus,
    handleTalk
};
