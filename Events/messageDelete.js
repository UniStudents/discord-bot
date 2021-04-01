const welcome = require('../Configs/config.json')['welcomeChannelId'];
const discord = require('discord.js')
const emojis = require('../Configs/emojis.json');
const {sendMessageForm} = require('../Utils/sendMessage');
const {prefix} = require('../Configs/botconfig.json')
const {getTime} = require('../Utils/getTime');

module.exports = {
    name: "messageDelete",
    execute: async (bot) => {
        bot.on('messageDelete', (message) => {
            let channel = message.channel;
            let username = message.author.username;
            let channelName = channel.name;
            let deletedContent = message.content;
            let timeStamp = getTime();
            let fieldsNames = ['Delete at','Message'];
            let fieldValues = [timeStamp,deletedContent];

            sendMessageForm(bot, channel, `Message deleted in ${channelName}`, `The user ${username} delete a message`, fieldsNames, fieldValues, message.author);
        })
    }
}

