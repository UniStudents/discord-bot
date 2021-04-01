const welcome = require('../Configs/config.json')['welcomeChannelId'];
const discord = require('discord.js')
const emojis = require('../Configs/emojis.json');
const {sendMessageForm} = require('../Utils/sendMessage');

module.exports = {
    name: "messageUpdate",
    execute: async (bot) => {
        bot.on('messageUpdate', (message) => {
            let channel = message.guild.channels.cache.get(welcome);

            sendMessageForm(bot, channel, "a message has changed!",emojis['notification'],"MessageUpdate" );

        })
    }
}