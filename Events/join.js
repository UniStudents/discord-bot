const config = require('../Managers/configManager')();
const discord = require("discord.js");
const emojis = require('../Configs/emojis.json');
const {sendMessageForm} = require("../Managers/embedCreator");
const fetcher = require("../Configs/fetchMessages.json");
const {color, version, footerIcon, footerText} = require("../Configs/botconfig.json");

module.exports = {
    name: "guildMemberAdd",
    execute: async (bot) => {
        bot.on('guildMemberAdd', (guildMember) => {
            guildMember.roles.add(config.defaultRole)

            let messageId = fetcher.find((object) => object.channelID === config.welcomeChannelId);
            if (!messageId) return;

            let message = guildMember.guild.channels.cache.get(config.welcomeChannelId).messages.cache.get(messageId.messageID);


            let welcomeEmbed = new discord.MessageEmbed()
                .setColor(color)
                .setDescription(`**Welcome To Unistudents Server**\n\n some text \n\n\n Please take some time to read`)
                .setFooter(footerText.replace("%version%",version))
                .setTimestamp()

            message.edit(welcomeEmbed).catch(error => console.log(error));

        })
    }
}
