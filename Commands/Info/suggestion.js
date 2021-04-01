const discord = require ('discord.js')
const error = require('../../Utils/error')
const emojis = require('../../Configs/emojis.json')
const {prefix,footerText,footerIcon,color,version} = require('../../Configs/botconfig.json')
const {suggestionChannelId} = require('../../Configs/config.json');

module.exports = {

    name: "suggestion",
    description:"Make a suggestion.",
    aliases:["sg","suggest"],
    category:"📝 Info",
    usage:`${prefix}suggestion`,
    permission: 1,
    execute: async (bot, message, args) => {
        if (args.length !== 0) {
            let suggestionChannel = message.guild.channels.cache.get(suggestionChannelId);
            await sendToSuggestionCh(bot, suggestionChannel, message.content.replace("!suggestion", ""), message.author.username+" Submit a Suggestion", emojis['suggestion'], message.author)
        }
        else {
            return error.send(bot, message.channel, `Required argument missing!\n\n Usage !suggestion **<suggestion text>**`)
        }
    }
}

//toDO delete the function below. Make it using the sendMessage Function.
async function sendToSuggestionCh(bot, channel, message, title, emoji, author) {

    let emojiToUse = bot.emojis.resolve(emoji);
    let yesEmoji = bot.emojis.resolve(emojis['yesEmoji'])
    let noEmoji = bot.emojis.resolve(emojis['noEmoji'])
    let response = new discord.MessageEmbed()
        .setColor(color)
        .setTitle(title)
        .addField('Suggested By','@'+author.username)
        .addField(`Suggestion ${emojiToUse}`,message)
        .setFooter(footerText.replace("%version%",version),author.avatarURL())
        .setTimestamp();


    let botMessage = await channel.send(response).catch();
    botMessage.react(yesEmoji);
    botMessage.react(noEmoji);
}
