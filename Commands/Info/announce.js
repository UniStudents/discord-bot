const discord = require ('discord.js')
const {prefix,color,footerText,version,footerIcon} = require('../../Configs/botconfig.json')
const error = require('../../Utils/error')
const emojis = require('../../Configs/emojis.json')

module.exports = {
    name: "announce",
    description:"Make an announcement.",
    aliases:["an"],
    category:"📝 Info",
    usage:`${prefix}announce <channel> <announce text>`,
    permission: 5,
    execute: async (bot,message,args) => {
        let channelToAnnounce = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || Array.from(message.guild.channels.cache.values()).find(channel => channel.name === args[0])
        if(!channelToAnnounce) return error.send(bot,message.channel,`Required argument missing!\n\n Usage: !announce **<channel>** <announce text>`)

        let whatToAnnounce = args.slice(1).join(' ')
        if(!whatToAnnounce) return error.send(bot,message.channel,`Required argument missing!\n\n Usage: !announce <channel> **<announce text>**`)

        //Send embed
        let announce = bot.emojis.resolve(emojis["notification"])
        let embedMessage = new discord.MessageEmbed()
            .setTitle(`**${channelToAnnounce.name.toUpperCase()}**`)
            .setColor(color)
            .setDescription(`${whatToAnnounce}\n\n${announce} Announcement by: ${message.author}`)
            .setFooter(footerText.replace("%version%",version),message.author.displayAvatarURL())
            .setTimestamp();
        await channelToAnnounce.send(embedMessage)
    }
}