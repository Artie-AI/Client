const request = require("node-fetch");
const { URL, URLSearchParams } = require("url");
const { ArtieAPI } = require("@Settings/config");

const baseURL = new URL(ArtieAPI.url);

const urlParams = {
    bid: ArtieAPI.id,
    key: ArtieAPI.key,
    uid: null,
    msg: null
};

const handleStatus = (client, status) => {

    let statuses = [
        'Chatting with peeps',
        'Artificial Intelligence',
        'Slash Command Usage',
        '@Mention or /help'
    ]

    client.user.setStatus('idle');

    setInterval(function() {
        
        let status = statuses[Math.floor(Math.random() * statuses.length)];

        client.user.setActivity(status, {
            type: 'STREAMING',
            url: 'https://twitch.tv/monstercat'
        })
    }, 10000)
};

const handleChat = async (msg) => {

    msg.content = msg.content.replace(/^<@!?[0-9]{1,20}> ?/i, '');

    //if (msg.content.length < 2 || (msg.channel.name !== 'arties-chat')) return;
    if (msg.content.length < 2 || (msg.channel.name !== 'devs-chat')) return;

    msg.channel.sendTyping();

    urlParams.uid = msg.author.id;
    urlParams.msg = msg.content;

    baseURL.search = new URLSearchParams(urlParams).toString();

    try {

        let reply = await request(baseURL);

        if (reply) {
            reply = await reply.json();

            msg.reply({
                content: reply.cnt,
                allowedMentions: {
                    repliedUser: true
                }
            })
        }
    } catch (e) {

        await msg.reply({
            content: `Error calculating a response. Please report this to my dev: ${e.message}`,
            allowedMentions: {
                repliedUser: true
            }
        })

        return client.logger.info(`Error with chat response: ${e.stack}`, 'error');
    }
}

const handleDirectMessage = async (msg) => {

    msg.content = msg.content.replace(/^<@!?[0-9]{1,20}> ?/i, '');

    urlParams.uid = msg.author.id;
    urlParams.msg = msg.content;

    baseURL.search = new URLSearchParams(urlParams).toString();

    try {

        let reply = await request(baseURL);

        if (reply) {
            
            reply = await reply.json();

            msg.channel.send({
                content: reply.cnt,
                allowedMentions: {
                    repliedUser: true
                }
            })
        }
    } catch (e) {

        await msg.reply({
            content: `Error calculating a response. Please report this to my dev: ${e.message}`,
            allowedMentions: {
                repliedUser: true
            }
        })

        return client.logger.error(`Error with chat response: ${e.stack}`, 'error');
    }
}

module.exports = {
    handleStatus,
    handleChat,
    handleDirectMessage,
}