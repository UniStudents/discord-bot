const discord = require ('discord.js')
const error = require('../../Utils/error')
const db = require('quick.db');
const emojis = require('../../Configs/emojis.json')
const {prefix,footerText,footerIcon,color,version} = require('../../Configs/botconfig.json')
const {suggestionChannelId} =  require('../../Managers/configManager')()
const config =  require('../../Managers/configManager')()



module.exports = {
    name: "removeUniTester",
    description:"Adds a user to UniTesters Team.",
    aliases:["removeBetaTester","uniTesterRemove","betaTesterRemove","removeUniTesters"],
    category:"🛠 Moderation",
    usage:`${prefix}removeUniTester <@User>`,
    permission: 8,
    execute: async (bot,message,args) => {
        let testers = db.has("BetaTesters.list") ? db.get("BetaTesters").list : {}
        let testersMax = db.has("BetaTesters.max") ? db.has("BetaTesters").max : config.betaTesters_settings.betaTestersMax
        let currentTestersAmount = Object.keys(testers).length
        if(args.length<1) return error.send(bot,message.channel,`Required argument missing!\n\n Usage !addUniTester **<@User>**`)
        let userToAdd = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(member => member.name === args[0]) ||message.guild.members.cache.find(member => member.id === args[0])
        if(!testers[userToAdd.id]) return error.send(bot,message.channel,`User ${userToAdd} is not in UniTester's team!`)
        let unitestersRole = message.guild.roles.cache.get(config.betaTesters_settings.betaTesterRoleId)
        if(!unitestersRole) return error.send(bot,message.channel,`UniTester role not found contact with an administrator!`)

        if(userToAdd.roles.cache.has(unitestersRole.id)) await userToAdd.roles.remove(unitestersRole)
        delete testers[userToAdd.id]
        db.set("BetaTesters.list",testers)
        let tick = bot.emojis.resolve(emojis["tick"])
        let added = new discord.MessageEmbed()
            .setColor(color)
            .setAuthor(`${userToAdd.user.tag}`,userToAdd.user.displayAvatarURL())
            .setDescription(`Successfully removed user ${userToAdd} from UniTester's team ${tick}`)
            .setTimestamp()
        await message.channel.send(added)
    }
}