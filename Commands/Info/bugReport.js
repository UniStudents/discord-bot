const error = require('../../Utils/error')
const emojis = require('../../Configs/emojis.json')
const {prefix,footerText,footerIcon,color,version} = require('../../Configs/botconfig.json')
const {bugReportChannelId} = require('../../Managers/configManager')()
const {sendMessageForm} = require('../../Managers/embedCreator');
const {bugs} = require('../../Configs/bugconfig.json');
const {getTimePreFormatted} = require("../../Utils/getTime");
const {getDatePreFormatted} = require("../../Utils/getTime");


module.exports = {
    name: "bugReport",
    description: "Make a bug report.",
    aliases: ["bug", "report"],
    category: "📝 Info",
    usage: `${prefix}bugReport`,
    permission: 1,
    execute: async (bot, message, args) => {
        if (args.length !== 0 || args.length < 2) {
            let logChannel = message.guild.channels.cache.get(bugReportChannelId);
            let categories = bugs['categories'];
            let found;

            categories.forEach((item) => {
                if (args[0] === item) {
                    found = true;
                }
            })

            if (found) {
                let fields = new Map();
                let yesEmoji = bot.emojis.resolve(emojis['yesEmoji']);
                let noEmoji = bot.emojis.resolve(emojis['noEmoji']);
                fields.set("Category", args[0]);
                fields.set("Submitted at", getDatePreFormatted() + " " + getTimePreFormatted())
                fields.set("Reporter ID", message.author.id);
                fields.set("Info", message.content.replace(message.content.split(" ")[0], "").replace(args[0], ""));

                await sendMessageForm(bot, message.channel, "Thanks for reporting a bug!", null, message.author.displayAvatarURL(), `${message.author.tag} Submitted a bug Report`);
                let embedMessage = await sendMessageForm(bot, logChannel, "", fields, message.author.displayAvatarURL(), `${message.author.tag} Submitted a bug Report`);

                if (embedMessage !== null) {
                    embedMessage.react(yesEmoji);
                    embedMessage.react(noEmoji);
                }


            } else {
                return error.send(bot, message.channel, `Unknown category!\n\n**Available Categories: ** \n [discord] \n [app] \n [site]\n\n Usage !bugReport **<catergory>** **<bug report>**`)
            }


        } else {
            return error.send(bot, message.channel, `Required argument missing!\n\n Usage !bugReport **<catergory>** **<bug report>**`)
        }
    }
}