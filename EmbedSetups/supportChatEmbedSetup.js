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
        .setTitle(`**UniStudent - Δημιουργία Αναφοράς**`)
        .setColor(color)
        .setDescription(`Σε ευχαριστούμε πολύ για το ενδιαφέρον σου για το UniStudents!\nΕάν έχεις κάποια απορία ή χρειάζεσαι βοήθεια μη διστάσεις να δημιουργήσεις μια νέα αναφορά.\n\nΑπλα κανε react με ${ticket} και ένας από τους διαθέσιμους διαχειριστές θα έρθει σε επικοινωνία μαζί σου το συντομότερο δυνατό.`)
        .setFooter(footerText.replace("%version%",version),message.author.displayAvatarURL())
        .setTimestamp();
    if(message.embeds.length<1 || message.embeds[0].description !== supportChat.description){
        message = await message.edit(supportChat).catch(e => {})
        await message.react(ticket)
    }
}