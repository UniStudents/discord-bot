const config =  require('../Managers/configManager')()
const discord = require('discord.js')
const {prefix,color,footerText,version,footerIcon} = require('../Configs/botconfig.json')
const emojis = require('../Configs/emojis.json')


module.exports.setup = async (bot) =>{
    let channel = bot.channels.cache.get(config.support_settings.supportChannelId)
    if(!channel) return
    let message = channel.messages.cache.get(config.support_settings.supportMessageId)
    if(!message) return

    let ticket = bot.emojis.resolve(emojis["ticket"])
    let supportChat = new discord.MessageEmbed()
        .setTitle(`**UniStudents Ticket Creation**`)
        .setColor(color)
        .setDescription(`Thank you for showing interest on UniStudents!\nIf you have a question or you need something\nfeel free to open a ticket!\n\n${ticket} Just react bellow and the first available staff will contact you asap!`)
        .setFooter(footerText.replace("%version%",version),message.author.displayAvatarURL())
        .setTimestamp();
    if(message.embeds.length<1 || message.embeds[0].description !== supportChat.description){
        message = await message.edit(supportChat).catch(e => {})
        await message.react(ticket)
    }
}