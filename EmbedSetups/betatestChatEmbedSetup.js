const config =  require('../Managers/configManager')()
const discord = require('discord.js')
const {prefix,color,footerText,version,footerIcon} = require('../Configs/botconfig.json')
const emojis = require('../Configs/emojis.json')


module.exports.setup = async (bot) =>{
    let channel = bot.channels.cache.get(config.betaTesters_settings.betaTesterChannelId)
    if(!channel) return
    let message = channel.messages.cache.get(config.betaTesters_settings.betaTesterMessageId)
    if(!message) return

    let unipi = bot.emojis.resolve(emojis["unipi"])
    let betaTestChat = new discord.MessageEmbed()
        .setTitle(`**UniStudent - Become a beta tester**`)
        .setColor(color)
        .setDescription(`Για να αποκτήσεις το ρόλο του UniTester κάνε 🔧 σε αυτό το μήνυμα.\n\nΌλα τα υπόλοιπα άφησε τα πάνω μας. ${unipi}`)
        .setFooter(footerText.replace("%version%",version),message.author.displayAvatarURL())
        .setTimestamp();
    if(message.embeds.length<1 || message.embeds[0].description !== betaTestChat.description){
        message = await message.edit(betaTestChat).catch(e => {})
        await message.react(`🔧`)
    }
}