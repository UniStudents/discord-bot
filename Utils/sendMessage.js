const {footerText,footerIcon,color,version} = require('../Configs/botconfig.json')
const discord = require('discord.js')

function sendMessageForm(bot, channel, message, emoji, title) {
    let formEmoji = bot.emojis.resolve(emoji);
    let response = new discord.MessageEmbed()
        .setColor(color)
        .setTitle(title)
        .setFooter(footerText.replace("%version%",version))
        .setDescription(`${formEmoji} ${message}`)
        .setTimestamp();

    channel.send(response);
}

module.exports = {
    sendMessageForm: sendMessageForm
}