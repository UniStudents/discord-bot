const discord = require ('discord.js')
const error = require('../../Utils/error')
const utils = require('../../Utils/generalUtils')
const db = require('quick.db');
const emojis = require('../../Configs/emojis.json')
const Pagination = require('../../Utils/ForkedLibrary/index.js')
const {prefix,footerText,footerIcon,color,version} = require('../../Configs/botconfig.json')
const {suggestionChannelId} =  require('../../Managers/configManager')()


module.exports = {
    name: "betatesters",
    description:"Displays all the available commands",
    aliases:["betatester","unitester","unitesters"],
    category:"📝 Info",
    usage:`${prefix}betatesters (user/id)`,
    permission: 8,
    execute: async (bot,message,args) => {
        if(args.length>1) return  error.send(bot,message.channel,`Too many arguments!\n\nUsage !betatester (user/id)`)
        let testers = db.has("BetaTesters.list") ? db.get("BetaTesters").list : {}
        let testerAnswers = db.has("ApplicationsInfo") ? db.get("ApplicationsInfo") : {}
        if(args.length === 1) {
            let betaTester = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(member => member.name === args[0]) || message.guild.members.cache.find(member => member.id === args[0])
            if (!betaTester) return error.send(bot, message.channel, `User not found!\n\nUsage !betatester **(user/id)**`)
            let testerInfo = testerAnswers[betaTester.id] || {}
            if(!testers[betaTester.id] || !testerAnswers[betaTester.id]) return error.send(bot, message.channel, `User is not part of UniTesters!`)
            let testerInfoEmbed = new discord.MessageEmbed()
                .setColor(color)
                .setDescription("UniTester Information")
                .setTimestamp()
                .setFooter(footerText.replace("%version%", version), footerIcon)
            for (let [key, value] of Object.entries(testerInfo)) {
                testerInfoEmbed.addField(`${key}`, `\`\`\`${value}\`\`\``)
            }
            return await message.channel.send(testerInfoEmbed)
        }
        //Pagination Logic
        let embeds = []
        let tester_chunked = utils.chunk_inefficient(5,Object.keys(testers));
        let count = 0
        tester_chunked.forEach(id_arrays =>{
            let desc = "**__UniTesters__**\n" +id_arrays.map(id => {
                let member = message.guild.members.cache.find(member => member.id === id)
                if(member){
                    count++
                    return `\`\`${count}\`\` - ${member}`
                }
            }).join("\n")
            embeds.push(new discord.MessageEmbed().setDescription(desc));
        })
        if(embeds.length<1) return error.send(bot, message.channel, `There is no UniTesters to display!`)
        let embed = new Pagination.Embeds()
            .setArray(embeds)
            .setAuthorizedUsers([message.author.id])
            .setChannel(message.channel)
            .setPage(1)
            .setTimeout(60*1000)
            .setDisabledNavigationEmojis(['all'])
            .addFunctionEmoji(`${emojis["arrowLeft"]}`, (_, instance) => {
                instance.setPage(instance.page >1 ? instance.page-1 : 1)
                instance.setFooter(`Requested by ${message.author.username} | Page ${instance.page} of ${instance.pages}`,message.author.displayAvatarURL())
            })
            .addFunctionEmoji(`${emojis["arrowRight"]}`, (_, instance) => {
                instance.setPage(instance.page <instance.pages ? instance.page+1 : instance.pages)
                instance.setFooter(`Requested by ${message.author.username} | Page ${instance.page} of ${instance.pages}`,message.author.displayAvatarURL())
            })
            .setColor(color)
            .setTimestamp()
            .setFooter(`Requested by ${message.author.username} | Page 1 of ${embeds.length}`,message.author.displayAvatarURL())
            .on('expire', (t,instance) => {
                let msg = instance.clientAssets.message
                let expire = bot.emojis.resolve(emojis["expire"])
                const expired = new discord.MessageEmbed()
                    .setColor(`#00000`)
                    .setFooter(footerText.replace("%version%",version),message.author.displayAvatarURL())
                    .setDescription(`${expire} Betatesters Command **Expired** ${message.author} ${expire}\n\nYou can request a new one\nUsage !betatesters`)
                    .setTimestamp()
                msg.edit(expired).then(message => message.delete({timeout:10*1000}))

            })

        // Methods below are for customising all embeds
        await embed.build();

    }
}