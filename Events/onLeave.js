const config = require('../Managers/configManager')();
const discord = require("discord.js");
const emojis = require('../Configs/emojis.json');
const {sendMessageForm} = require("../Managers/embedCreator");
const db = require('quick.db');
const fetcher = require("../Configs/fetchMessages.json");
const {color, version, footerIcon, footerText} = require("../Configs/botconfig.json");
const welcomeEmbed = require('../EmbedSetups/welcomeEmbedSetup')


module.exports = {
    name: "guildMemberRemove",
    execute: async (bot) => {
        bot.on('guildMemberRemove', (guildMember) => {
            let testers = db.has("BetaTesters") ? db.get("BetaTesters").list : {}
            if(testers[guildMember.id]){
                delete testers[guildMember.id]
                console.log(testers)
                db.set("BetaTesters.list",testers)
            }
        })
    }
}
