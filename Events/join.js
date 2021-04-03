const {welcomeChannelId} = require('../Managers/configManager')();
const emojis = require('../Configs/emojis.json');
const {sendMessageForm} = require("../Managers/embedCreator");

module.exports = {
    name: "guildMemberAdd",
    execute: async (bot) => {
        bot.on('guildMemberAdd', (guildMember) => {
            // toDO make on join event.
        })
    }
}

