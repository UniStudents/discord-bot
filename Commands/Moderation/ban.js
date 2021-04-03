const discord = require ('discord.js')
const error = require('../../Utils/error')
const db = require('quick.db');
const emojis = require('../../Configs/emojis.json')
const {prefix,footerText,footerIcon,color,version} = require('../../Configs/botconfig.json')
const {logsChannelId} =  require('../../Managers/configManager')()
const messageUtils = require('../../Utils/messageUtils')
const timeUtils = require('../../Utils/getTime')





module.exports = {
    name: "ban",
    description:"Bans a member.",
    aliases:["banUser"],
    category:"Moderation",
    usage:`${prefix}ban <member>`,
    permission: 8,
    execute: async (bot,message,args) => {
        if(args.length<1) return error.send(bot,message.channel,`Required argument missing!\n\n Usage !ban **<member>**`)

        let userToBan = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(member => member.name === args[0]) ||message.guild.members.cache.find(member => member.id === args[0])
        if(!userToBan) return error.send(bot,message.channel,`User not found!\n\n Usage !ban **<member>**`)
        if(!userToBan.bannable) return error.send(bot,message.channel,`You can't ban ${userToBan}`)
        if(args.length<2) return error.send(bot,message.channel,`Please specify a reason!\n\n Usage !ban <member> **<reason>**`)
        let reason = args.slice(1).join(" ")


        let banEmbedUser = new discord.MessageEmbed()
            .setDescription(`Your have been banned from UniStudents Discord Server!\n\n**Reason: **${reason}`)
            .setAuthor(`${userToBan.user.tag}`, userToBan.user.displayAvatarURL())
            .setColor(color)
            .setTimestamp();
        //User Info embed
        messageUtils.sendDmMessage(userToBan,banEmbedUser).catch()


        await userToBan.ban()
        //Success message
        let embed = new discord.MessageEmbed()
            .setColor(color)
            .setAuthor(`${message.author.tag}`,message.author.displayAvatarURL())
            .setDescription(`Successfully banned user ${userToBan.user.tag}`)
            .setTimestamp()
            .setFooter(footerText.replace("%version%",version))
        await message.channel.send(embed)
        //Info Logs Message
        let logsEmbed = new discord.MessageEmbed()
            .setDescription(`**Action:** __Ban User__\n\n**User:** ${userToBan.user.tag}\n**Baned By:** ${message.author}\n**Banned At:** ${timeUtils.getDatePreFormatted()}\n**Time:** ${timeUtils.getTimePreFormatted()}\n\n**Reason:** ${reason}`)
            .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL())
            .setColor(color)
            .setTimestamp()
            .setFooter(footerText.replace("%version%",version))
            .setThumbnail(userToBan.user.displayAvatarURL())
        let logChannel = message.guild.channels.cache.has(logsChannelId) ? message.guild.channels.cache.get(logsChannelId) : null
        if(logChannel) await logChannel.send(logsEmbed)

    }
}