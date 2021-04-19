const discord = require ('discord.js')
const error = require('../../Utils/error')
const db = require('quick.db');
const emojis = require('../../Configs/emojis.json')
const {prefix,footerText,footerIcon,color,version} = require('../../Configs/botconfig.json')
const {suggestionChannelId} =  require('../../Managers/configManager')()
const config =  require('../../Managers/configManager')()



module.exports = {
    name: "addUniTester",
    description:"Adds a user to UniTesters Team.",
    aliases:["addBetaTester","uniTesterAdd","betaTesterAdd","addUniTesters"],
    category:"🛠 Moderation",
    usage:`${prefix}addUniTester <@User>`,
    permission: 8,
    execute: async (bot,message,args) => {
        let testers = db.has("BetaTesters") ? db.get("BetaTesters").list : {}
        let testersMax = db.has("BetaTesters") ? db.has("BetaTesters").max : config.betaTesters_settings.betaTestersMax
        let testerAnswers = db.has("ApplicationsInfo") ? db.get("ApplicationsInfo") : {}
        let currentTestersAmount = Object.keys(testers).length
        if(currentTestersAmount>=testersMax) await error.send(bot, this.message.channel, `Max amount of UniTesters reached!\nMax amount of UniTesters is \`\`${testersMax}\`\`.`)
        if(args.length<1) return error.send(bot,message.channel,`Required argument missing!\n\n Usage !addUniTester **<@User>**`)
        let userToAdd = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(member => member.name === args[0]) ||message.guild.members.cache.find(member => member.id === args[0])
        if(testers[userToAdd.id]) return error.send(bot,message.channel,`User ${userToAdd} is already in UniTester's team!`)
        let unitestersRole = message.guild.roles.cache.get(config.betaTesters_settings.betaTesterRoleId)
        if(!unitestersRole) return error.send(bot,message.channel,`UniTester role not found contact with an administrator!`)

        if(!userToAdd.roles.cache.has(unitestersRole.id)) await userToAdd.roles.add(unitestersRole)
        testers[userToAdd.id] = {
            name: userToAdd.user.tag,
            id: userToAdd.id,
        }
        testerAnswers[userToAdd.id] = {}
        db.set("BetaTesters.list",testers)
        db.set("ApplicationsInfo",testerAnswers)
        let tick = bot.emojis.resolve(emojis["tick"])
        let added = new discord.MessageEmbed()
            .setColor(color)
            .setAuthor(`${userToAdd.user.tag}`,userToAdd.user.displayAvatarURL())
            .setDescription(`Successfully added user ${userToAdd} to the UniTester's team ${tick}`)
            .setTimestamp()
        await message.channel.send(added)
        //Welcome message
        let welcome = new discord.MessageEmbed()
            .setColor(color)
            .setAuthor(`${userToAdd.user.tag}`,userToAdd.user.displayAvatarURL())
            .setDescription(`Welcome ${userToAdd}`)
            .setTimestamp()
        let betaGeneral = message.guild.channels.cache.get(config.betaTesters_settings.betaTesterGeneralChannelId)
        if(!betaGeneral) return
        await betaGeneral.send(welcome)
        await betaGeneral.send(`${userToAdd}`).then(msg => msg.delete({timeout:200}))
    }
}