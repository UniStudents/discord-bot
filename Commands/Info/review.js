const error = require('../../Utils/error')
const emojis = require('../../Configs/emojis.json')
const {prefix,footerText,footerIcon,color,version} = require('../../Configs/botconfig.json')
const {reviewChannelID} = require('../../Managers/configManager')()
const {sendMessageForm} = require('../../Managers/embedCreator');
const {getTimePreFormatted} = require("../../Utils/getTime");
const {getDatePreFormatted} = require("../../Utils/getTime");


module.exports = {
    name: "review",
    description: "Make a review!",
    aliases: ["feedback"],
    category: "📝 Info",
    usage: `${prefix}review`,
    permission: 1,
    execute: async (bot, message, args) => {
        if (!args[0]) return error.send(bot, message.channel, `Required argument missing!\n\n Usage !review **<star number>** (comment)`);

        let comment = args.length >=2 ? args.slice(1).join(" ") : null;

        if (args[0].match(/^[A-Za-z]+$/)) return error.send(bot, message.channel, `The star number must be a number!\n\n Usage !review **<star number>** <comment>`);

        await sendMessageToUser(bot, message.channel);
        await sendFeedBack(bot, message.guild.channels.cache.get(reviewChannelID), message.author, parseInt(args[0]), comment);

    }
}

async function sendMessageToUser(bot, channel) {
    let successEmoji = bot.emojis.resolve(emojis['tick']);
    await sendMessageForm(bot, channel, `Thanks for your feedback! ${successEmoji}`, null, null);
}

async function sendFeedBack(bot, channel, author, starCount, comment) {

    let ratingEmoji = bot.emojis.resolve(emojis['rating']);
    let review = Array(5).fill("").map(x => `${ratingEmoji}`).join(" ")
    let fields = new Map();
    fields.set("Review By ",author.tag);
    fields.set("Review ", review);
    if(comment) fields.set("Comment ", comment);


    await sendMessageForm(bot, channel, "", fields, author.displayAvatarURL(), "New Review");

}