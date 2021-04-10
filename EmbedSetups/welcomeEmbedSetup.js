const config =  require('../Managers/configManager')()
const discord = require('discord.js')
const {prefix,color,footerText,version,footerIcon} = require('../Configs/botconfig.json')
const emojis = require('../Configs/emojis.json')


module.exports.setup = async (bot,member) =>{
    let channel = bot.channels.cache.get(config.welcome_settings.welcomeChannelId)
    if(!channel) return
    let message = channel.messages.cache.get(config.welcome_settings.welcomeMessageId)
    if(!message) return

    let welcome = new discord.MessageEmbed()
        .setColor(color)
        .setAuthor(`${member.user.tag}`,member.user.displayAvatarURL())
        .setDescription(`Καλώς ήρθες στο Discord του UniStudents **${member.user}**\n\n*Tip: Κάνε react :bell: για να μη χάνεις τα νέα μας*`)
        .setFooter(footerText.replace("%version%",version),message.author.displayAvatarURL())
        .setTimestamp();
        message = await message.edit(welcome).catch(e => {})
        await message.react(`🔔`)
        await channel.send(`${member}`).then(msg => msg.delete({timeout:200}))
}