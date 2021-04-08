const discord = require ('discord.js')
const error = require('../../Utils/error')
const db = require('quick.db');
const emojis = require('../../Configs/emojis.json')
const {prefix,footerText,footerIcon,color,version} = require('../../Configs/botconfig.json')
const {suggestionChannelId} =  require('../../Managers/configManager')()


module.exports = {
    name: "permission",
    description:"Checks or sets User permission.",
    aliases:["perm","permlvl"],
    category:"🛠 Moderation",
    usage:`${prefix}permission <@User> (permissionLevel)`,
    permission: 10,
    execute: async (bot,message,args) => {
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(member => member.name === args[0]) ||message.guild.members.cache.find(member => member.id === args[0])
        if(!member) return error.send(bot,message.channel,`User not found!!\n\n Usage !permission **<@User>** (lvl)`)
        let memberPerm = db.has(`Permissions.${member.id}`) ? db.get(`Permissions.${member.id}`).perm : 1
        let permToSet = args.length>1 ? args[1] : null
        if(!permToSet){
            let userembed = new discord.MessageEmbed()
                .setAuthor(`${member.user.username}`, member.user.displayAvatarURL())
                .setColor(color)
                .setTimestamp()
                .setFooter(footerText.replace("%version%",version),message.author.displayAvatarURL())
                .setDescription(`**User: ** ${member} has access in commands that\n require permission level **${memberPerm}** and lower!`)
           return await message.channel.send(userembed)
        }
        if (args[0].match(/^[A-Za-z]+$/)) return error.send(bot,message.channel,`Only numerical values are allowed!\n\n Usage !permission <@User> **(lvl)**`)
        permToSet = parseInt(permToSet)
        if(permToSet>10 || permToSet<0) return error.send(bot,message.channel,`Permission number must be a number between 1-10`)
        if(db.has(`Permissions.${member.id}.perm`)) db.set(`Permissions.${member.id}.perm`,permToSet)
        let tick = bot.emojis.resolve(emojis["tick"])
        let success = new discord.MessageEmbed()
            .setColor(color)
            .setDescription(`${tick} Successfully Update Permissions ${tick}\n\n**User:** ${member}\n**PermLvl:** ${permToSet}`)
            .setFooter(footerText.replace("%version%",version),message.author.displayAvatarURL())
            .setTimestamp();
        await message.channel.send(success)


    }
}