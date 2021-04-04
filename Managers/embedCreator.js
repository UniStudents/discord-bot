const {footerText,footerIcon,color,version} = require('../Configs/botconfig.json')
const discord = require('discord.js')


module.exports = {
    sendMessageForm: async (bot, channel, message = "", fields, footerIcon, authorText = "") => {
        let response = new discord.MessageEmbed()
            .setColor(color)
            .setDescription(message)
            .setAuthor(authorText ? authorText : "",footerIcon ? footerIcon : null)
            .setFooter(footerText.replace("%version%",version))
            .setTimestamp();

        if (fields != null) {
            fields.forEach((value, key) => {
                response.addField(key, value);
            })
        }
        return await channel.send(response).catch();

    },
    createBasicEmbed: (desc ,authorText="", authorIcon ="") => {
        let response = new discord.MessageEmbed()
            .setColor(color)
            .setDescription(`${desc}`)
            .setFooter(footerText.replace("%version%",version), footerIcon ? footerIcon : null)
            .setTimestamp();
        if(authorText && authorIcon) response.setAuthor(authorText ? authorText : "",authorIcon ? authorIcon : null)
        return response;
    }

}
