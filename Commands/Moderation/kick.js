const discord = require ('discord.js')
const error = require('../../Utils/error')
const timeUtils = require('../../Utils/getTime')
const emojis = require('../../Configs/emojis.json')
const {prefix,footerText,footerIcon,color,version} = require('../../Configs/botconfig.json')
const {logsChannelId} =  require('../../Managers/configManager')()
const messageUtils = require('../../Utils/messageUtils')




module.exports = {
    name: "kick",
    description:"Kicks a member.",
    aliases:["kickUser"],
    category:"🛠 Moderation",
    usage:`${prefix}kick <member> <reason>`,
    permission: 8,
    execute: async (bot,message,args) => {
        if(args.length<1) return error.send(bot,message.channel,`Required argument missing!\n\n Usage !kick **<member>** <reason>`)

        let userToKick = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(member => member.name === args[0]) ||message.guild.members.cache.find(member => member.id === args[0])
        if(!userToKick) return error.send(bot,message.channel,`User not found!\n\n Usage !kick **<member>**`)
        if(!userToKick.kickable) return error.send(bot,message.channel,`You can't kick ${userToKick}`)
        if(args.length<2) return error.send(bot,message.channel,`Please specify a reason!\n\n Usage !kick <member> **<reason>**`)
        let reason = args.slice(1).join(" ")

        let banEmbedUser = new discord.MessageEmbed()
            .setDescription(`Your account has been __suspended__!\n\n**Reason: **${reason}\nDuration: ** __Permanent__**`)
            .setAuthor(`${userToKick.user.tag}`, userToKick.user.displayAvatarURL())
            .setColor(color)
            .setTimestamp();
        //User Info embed
        messageUtils.sendDmMessage(userToKick,banEmbedUser).catch()


        await userToKick.kick()
        //Success message
        let embed = new discord.MessageEmbed()
            .setColor(color)
            .setAuthor(`${message.author.tag}`,message.author.displayAvatarURL())
            .setDescription(`Successfully kicked user ${userToKick.user.tag}`)
            .setTimestamp()
            .setFooter(footerText.replace("%version%",version))
        await message.channel.send(embed)
        //Info Logs Message
        let logsEmbed = new discord.MessageEmbed()
            .setDescription(`**Action:** __Kick User__\n\n**User:** ${userToKick.user.tag}\n**Kicked By:** ${message.author}\n**Kicked At:** ${timeUtils.getDatePreFormatted()}\n**Time:** ${timeUtils.getTimePreFormatted()}\n\n**Reason:** ${reason}`)
            .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL())
            .setColor(color)
            .setTimestamp()
            .setFooter(footerText.replace("%version%",version))
            .setThumbnail(userToKick.user.displayAvatarURL())
        let logChannel = message.guild.channels.cache.has(logsChannelId) ? message.guild.channels.cache.get(logsChannelId) : null
        if(logChannel) await logChannel.send(logsEmbed)

    }
}