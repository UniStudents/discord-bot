const {logsChannelId} = require('../Managers/configManager')();
const discord = require('discord.js')
const emojis = require('../Configs/emojis.json');
const {sendMessageForm} = require('../Managers/embedCreator');
const {getDatePreFormatted,getTimePreFormatted} = require('../Utils/getTime');


module.exports = {
    name: "messageUpdate",
    execute: async (bot) => {
        bot.on('messageUpdate', async (oldMessage, newMessage) => {
            let channel = newMessage.guild.channels.cache.get(logsChannelId);
            if(!oldMessage || !newMessage || oldMessage.author.bot || !oldMessage.content || !newMessage.content || !channel || oldMessage.content === newMessage.content) return
            let fields = new Map();
            let description = `Message Edited in ${newMessage.channel}`;
            fields.set("Edited at","**Date: **"+getDatePreFormatted() + "\n **Time: **" + getTimePreFormatted());
            fields.set("Message before ", oldMessage.content)
            fields.set("Message after ", newMessage.content)


            await sendMessageForm(bot, channel ,description, fields, newMessage.author.displayAvatarURL(), `${newMessage.author.tag} Edit a message`)
        })
    }
}