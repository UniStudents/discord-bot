const error = require('../../Utils/error')
const emojis = require('../../Configs/emojis.json')
const {prefix,footerText,footerIcon,color,version} = require('../../Configs/botconfig.json')
const {bugReportChannelId,bugs} = require('../../Managers/configManager')()
const {sendMessageForm} = require('../../Managers/embedCreator');
const {getTimePreFormatted} = require("../../Utils/getTime");
const {getDatePreFormatted} = require("../../Utils/getTime");


module.exports = {
    name: "bugReport",
    description: "Make a bug report.",
    aliases: ["bug", "report"],
    category: "📝 Info",
    usage: `${prefix}bugReport <catergory> <bug report>`,
    permission: 1,
    execute: async (bot, message, args) => {
        if (args.length<2) return error.send(bot, message.channel, `Unknown category!\n\n**Available Categories: ** \n \`discord\` \n \`app\` \n \`site\` \n\n Usage !bugReport **<catergory>** <bug report>`)

        let logChannel = message.guild.channels.cache.get(bugReportChannelId);
        let categories = bugs['categories'];

        let found = categories.some(item => item === args[0]);
        if(!found) return error.send(bot, message.channel, `Unknown category!\n\n**Available Categories: ** \n \`discord\` \n \`app\` \n \`site\` \n\n Usage !bugReport <catergory> **<bug report>**`)


        let fields = new Map();
        let yesEmoji = bot.emojis.resolve(emojis['yesEmoji']);
        let noEmoji = bot.emojis.resolve(emojis['noEmoji']);
        fields.set("Category", `\`${args[0].toUpperCase()}\``);
        fields.set("Submitted at\n ", "**Date**: "+ getDatePreFormatted() + "\n **Time**: " + getTimePreFormatted())
        fields.set("Info", message.content.replace(message.content.split(" ")[0], "").replace(args[0], ""));

        await sendMessageForm(bot, message.channel, "Thanks for reporting a bug!", null, message.author.displayAvatarURL(), `${message.author.tag} Submitted a bug Report`);
        let embedMessage = await sendMessageForm(bot, logChannel, "", fields, message.author.displayAvatarURL(), `${message.author.tag} Submitted a bug Report`);
        await logChannel.send(`${message.author}`).then(message => message.delete({timout:200}))
        if (embedMessage !== null) {
            embedMessage.react(yesEmoji);
            embedMessage.react(noEmoji);
        }

    }
}