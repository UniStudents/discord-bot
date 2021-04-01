const welcome = require('../Configs/config.json')['welcomeChannelId'];
const discord = require('discord.js')
const emojis = require('../Configs/emojis.json');
const {sendMessageForm} = require('../Managers/embedCreator');
const {prefix} = require('../Configs/botconfig.json')
const {getTime} = require('../Utils/getTime');

module.exports = {
    name: "messageDelete",
    execute: async (bot) => {
        bot.on('messageDelete', async (message) => {
            let channel = message.channel;
            let deletedContent = message.content;
            let timeStamp = getTime();
            let fields = new Map()
            //Code to find who deleted the message
            const fetchedLogs = await message.guild.fetchAuditLogs({
                type: 'MESSAGE_DELETE'
            }).catch(() => ({
                entries: []
            }));
            const auditEntry = fetchedLogs.entries.first()
            const executor = auditEntry && auditEntry.executor ? message.guild.members.cache.get(auditEntry.executor.id) : 'Unknown';
            //Fields
            fields.set("Delete at",timeStamp)
            fields.set("Message",deletedContent)
            //Send the actual embed
            //todo change channel to logs
            sendMessageForm(
                bot,
                channel,
                `Message deleted in ${channel} by \`\`${executor.user.tag ? executor.user.tag : "Unknown"}\`\``,
                fields, message.author.displayAvatarURL(),
                `Message was by ${message.author.tag}`,
                message.author.displayAvatarURL()
            );
        })
    }
}

