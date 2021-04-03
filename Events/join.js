const {welcomeChannelId} = require('../Managers/configManager')();
const emojis = require('../Configs/emojis.json');
const {sendMessageForm} = require("../Managers/embedCreator");

module.exports = {
    name: "guildMemberAdd",
    execute: async (bot) => {
        bot.on('guildMemberAdd', (guildMember) => {
            let channel = guildMember.guild.channels.cache.get(welcomeChannelId);
           // sendMessageForm(bot, channel, "Welcome to our server!", emojis['notification'],"Welcome")
            // toDO finish it.
            //todo make member take member role remake sendMessageForm
        })
    }
}

