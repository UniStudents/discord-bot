const discord = require ('discord.js')
const error = require('../../Utils/error')
const emojis = require('../../Configs/emojis.json')
const {prefix,footerText,footerIcon,color,version} = require('../../Configs/botconfig.json')
const {suggestionChannelId} = require('../../Managers/configManager')()
const {sendMessageForm} = require('../../Managers/embedCreator');


module.exports = {
    name: "suggestion",
    description:"Make a suggestion.",
    aliases:["sg","suggest"],
    category:"📝 Info",
    usage:`${prefix}suggestion <suggestion text>`,
    permission: 1,
    execute: async (bot, message, args) => {
        if (args.length !== 0) {
            let suggestionChannel = await message.guild.channels.cache.get(suggestionChannelId);
            let fields = new Map();
            let yesEmoji = bot.emojis.resolve(emojis['yesEmoji']);
            let noEmoji = bot.emojis.resolve(emojis['noEmoji']);
            let suggestionEmoji = bot.emojis.resolve(emojis['suggestion']);
            fields.set('Suggested by ', message.author);
            fields.set(`Suggestion ${suggestionEmoji}`, message.content.replace(message.content.split(" ")[0],""))

            let embedMessage = await sendMessageForm(bot, suggestionChannel , "" , fields, message.author.displayAvatarURL(), `${message.author.tag} Submitted a suggestion`)

            if (embedMessage != null) {
                embedMessage.react(yesEmoji);
                embedMessage.react(noEmoji);
            }
        }
        else {
            return error.send(bot, message.channel, `Required argument missing!\n\n Usage !suggestion **<suggestion text>**`)
        }
    }
}
