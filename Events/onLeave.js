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
            //Leave announce
            announceLeave(guildMember)

        })
    }
}

function announceLeave(guildMember){
    let dateJoined = guildMember.joinedAt
    let diff = Date.now() - dateJoined
    let final = parseInt(diff)/86400000

    const leaveChannel = guildMember.guild.channels.cache.get(config.leavesChannelId)
    let leaveEmbed =  new discord.MessageEmbed()
        .setAuthor(guildMember.user.tag,guildMember.user.displayAvatarURL())
        .setColor(color)
        .setDescription(`**User: ** ${guildMember.user.tag}\nHas left the server\n\n**He was in the server for: ** ${final.toFixed(0)} days`)
        .setFooter(version)
        .setTimestamp();
     leaveChannel.send(leaveEmbed)
}
