const error = require('../../Utils/error')
const emojis = require('../../Configs/emojis.json')
const {prefix,footerText,footerIcon,color,version} = require('../../Configs/botconfig.json')
const {bugReportChannelId} = require('../../Managers/configManager')()
const {sendMessageForm} = require('../../Managers/embedCreator');


module.exports = {
    name: "bugReport",
    description:"Make a bug report.",
    aliases:["bug","report"],
    category:"📝 Info",
    usage:`${prefix}bugReport`,
    permission: 1,
    execute: async (bot, message, args) => {
        if (args.length !== 0) {

            let bugReportChannel = message.guild.channels.cache.get(bugReportChannelId);
            let bugReportEmoji = bot.emojis.resolve(emojis['bugReport']);
            let fields = new Map();
            fields.set('Bug reported by ', message.author);
            fields.set(`Report ${bugReportEmoji}`, message.content.replace(message.content.split(" ")[0],""))

            await sendMessageForm(bot, bugReportChannel, "", fields, message.author.displayAvatarURL(), `${message.author.tag} Submitted a bug Report`)
        }
        else {
            return error.send(bot, message.channel, `Required argument missing!\n\n Usage !suggestion **<suggestion text>**`)
        }
    }
}
