const discord = require ('discord.js')
const {prefix,color,footerText,version,footerIcon} = require('../../Configs/botconfig.json')
const error = require('../../Utils/error')
const emojis = require('../../Configs/emojis.json')

module.exports = {
    name: "announceraw",
    description:"Make an raw announcement.",
    aliases:["annraw","raw"],
    category:"📝 Info",
    usage:`${prefix}announce <channel> <text>`,
    permission: 5,
    execute: async (bot,message,args) => {
        let channelToAnnounce = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || Array.from(message.guild.channels.cache.values()).find(channel => channel.name === args[0])
        if(!channelToAnnounce) return error.send(bot,message.channel,`Required argument missing!\n\n Usage: !announce **<channel>** <announce text>`)

        let whatToAnnounce = args.slice(1).join(' ')
        if(!whatToAnnounce &&message.attachments.size<1) return error.send(bot,message.channel,`Required argument missing!\n\n Usage: !announce <channel> **<announce text>**`)

        //Send embed
        let url
        if(message.attachments.size>=1){
            url = message.attachments.first().url;
            await channelToAnnounce.send(whatToAnnounce, {files: [`${url}`]})

        }else{
            await channelToAnnounce.send(whatToAnnounce)
        }
    }
}