const discord = require ('discord.js')
const {prefix,color,footerText,version,footerIcon} = require('../../Configs/botconfig.json')
const error = require('../../Utils/error')
const emojis = require('../../Configs/emojis.json')

module.exports = {
    name: "userinfo",
    description:"Displays user's info",
    aliases:["info"],
    category:"📝 Info",
    usage:`${prefix}userinfo <@user>`,
    permission: 5,
    execute: async (bot,message,args) => {
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(member => member.name === args[0]) ||message.guild.members.cache.find(member => member.id === args[0])
        if(!member) return error.send(bot,message.channel,`User not found!!\n\n Usage !userinfo **<@User>**`)
        let datecreated = member.user.createdAt
        let datejoined = member.joinedAt  // new Date(new Date() - (message.member.joinedAt / 1000))   poso kairo ine mesa ston server se miliseocnds

        let date2 = new Date(new Date() - (message.member.joinedAt / 1000))
        let diff = Date.now() - datejoined
        let final = parseInt(diff)/86400000 //the big number is the miliseconds of one day ...


        let userembed = new discord.MessageEmbed()
            .setAuthor(`${member.user.tag}`, member.user.displayAvatarURL())
            .setColor(color)
            .setTimestamp()
            .setFooter(version)
            .addField("**Username:**", `${member.user.tag}`, true)
            .addField("**Id:**", `\`${member.id}\``, true)
            .addField("**Nickname:**", member.displayName, true)
            .addField("**Status:**", member.presence.status, true)
            .addField("**Is Bot:**", member.user.bot, true)
            .addField("**Game:**", member.presence.activities.length >=1 ? member.presence.activities[0] : "None", true)
            .addField("**Account Created At:**", `${datecreated.getDate()}/${datecreated.getMonth()+1}/${datecreated.getFullYear()}`, true)
            .addField("**Joined the Server:**", `${final.toFixed(0)} Days before\n At **${datejoined.getDate()}/${datejoined.getMonth()+1}/${datejoined.getFullYear()}** `, true)
            .addField(`**Roles:**`, `${member.roles.cache.size-1}`, true)
        await message.channel.send(userembed)
    }
}