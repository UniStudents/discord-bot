const config = require('../Managers/configManager')();
const discord = require("discord.js");
const emojis = require('../Configs/emojis.json');
const {sendMessageForm} = require("../Managers/embedCreator");
const fetcher = require("../Configs/fetchMessages.json");
const {color, version, footerIcon, footerText} = require("../Configs/botconfig.json");
const welcomeEmbed = require('../EmbedSetups/welcomeEmbedSetup')


module.exports = {
    name: "guildMemberAdd",
    execute: async (bot) => {
        bot.on('guildMemberAdd', (guildMember) => {
            guildMember.roles.add(config.defaultRole)
            welcomeEmbed.setup(bot,guildMember)
        })
    }
}
