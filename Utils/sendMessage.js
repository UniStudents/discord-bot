const {footerText,footerIcon,color,version} = require('../Configs/botconfig.json')
const discord = require('discord.js')

function sendMessageForm(bot, channel, message, title, fields, fieldValues, author) {

    let response = new discord.MessageEmbed()
        .setColor(color)
        .setTitle(title)
        .setDescription(`${message}`)
        .setFooter(footerText.replace("%version%",version), author.avatarURL())
        .setTimestamp();

    fields.forEach((fieldName,index) => {
        response.addField(fieldName, fieldValues[index]);
    })
    channel.send(response).catch();

    return response;
}

module.exports = {
    sendMessageForm: sendMessageForm
}