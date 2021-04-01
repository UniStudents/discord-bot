const {footerText,footerIcon,color,version} = require('../Configs/botconfig.json')
const discord = require('discord.js')


module.exports = {
    sendMessageForm: (bot, channel, message, fields, footerIcon,authorText = "",authorIcon = "") => {
        let response = new discord.MessageEmbed()
            .setColor(color)
            .setAuthor(authorText ? authorText : "",authorIcon ? authorIcon : null)
            .setDescription(`${message}`)
            .setFooter(footerText.replace("%version%",version), footerIcon ? footerIcon : null)
            .setTimestamp();

        if(fields !=null) {
            fields.forEach((value, key) => {
                response.addField(key, value);
            })
        }
        channel.send(response).catch();
        return response;
    }

}
