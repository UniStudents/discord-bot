const welcome = require('../Configs/config.json')['welcomeChannelId'];
const emojis = require('../Configs/emojis.json');
const {sendMessageForm} = require("../Utils/sendMessage");

module.exports = {
    name: "guildMemberAdd",
    execute: async (bot) => {
        bot.on('guildMemberAdd', (guildMember) => {
            let channel = guildMember.guild.channels.cache.get(welcome);
            sendMessageForm(bot, channel, "Welcome to our server!", emojis['notification'],"Welcome")
            // toDO finish it.
        })
    }
}

