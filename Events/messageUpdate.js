const {welcomeChannelId} = require('../Managers/configManager')();
const discord = require('discord.js')
const emojis = require('../Configs/emojis.json');
const {sendMessageForm} = require('../Managers/embedCreator');
const {getTime} = require('../Utils/getTime');


module.exports = {
    name: "messageUpdate",
    execute: async (bot) => {
        bot.on('messageUpdate', (message) => {
            // toDO old content has been deleted, i'm gonna rewrote this.
        })
    }
}