const welcome = require('../Configs/config.json')['welcomeChannelId'];
const discord = require('discord.js')
const emojis = require('../Configs/emojis.json');
const {sendMessageForm} = require('../Utils/sendMessage');
const {prefix} = require('../Configs/botconfig.json')

module.exports = {
    name: "messageDelete",
    execute: async (bot) => {
        bot.on('messageDelete', (message) => {
            let channel = message.guild.channels.cache.get(welcome);

            if (message.content.startsWith(prefix) || !channel) return;
            sendMessageForm(bot, channel, "a message has been deleted",emojis['notification'],"MessageDeleted" );

        })
    }
}