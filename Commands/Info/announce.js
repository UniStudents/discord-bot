/**
 * @authors unistudents development team
 * @copyright unistudents
 * @file announce.js
 * @contact info@unistudents.gr
 * @type {module:"discord.js"}
 *
 * This file has been created by the group
 * of developers of the organization
 * unistudents in order to develop
 * the bot that runs on the server
 * located on the platform called
 * discord.
 *
 * This file as well as all other files of
 * this bot are open source and can be read
 * by users who look at it and find it
 * interesting.
 *
 * If there is any issue with this file algorithm,
 * please contact us and we will make every effort
 * to resolve the issue or feel free to contribute
 * if you want too.
 */

const discord = require ('discord.js')
const {prefix,color,footerText,version} = require('../../Configs/botconfig.json')
const error = require('../../Utils/error')
const emojis = require('../../Configs/emojis.json')

module.exports = {
    // bot options/details.
    name: "announce",
    description:"Make an announcement.",
    aliases:["an"],
    category:"📝 Info",
    usage:`${prefix}announce <channel> <announce text>`,
    permission: 5,

    /**
     * This function causes the server bot to send an announcement
     * to a specific channel. The announcement that this bot will
     * send can be anything defined by the one calling this function.
     *
     * The format of the announcements as will be seen in the discord
     * is defined by the MessageEmbed method provided by the platform.
     *
     * For more information's about the algorithm below please feel free
     * to visit the webpage of discord api:
     *      https://discord.js.org/#/docs/main/stable/general/welcome
     *
     * @param bot The bot we want to refer to.
     * @param message The announcement that we want the bot to send to the predefined channel where the announcements are sent.
     * @param args The parameters that the bot can receive from the discord platform.
     * @returns {Promise<void>}
     */
    execute: async (bot,message,args) => {
        let channelToAnnounce = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || Array.from(message.guild.channels.cache.values()).find(channel => channel.name === args[0])
        if(!channelToAnnounce) return error.send(bot,message.channel,`Required argument missing!\n\n Usage: !announce **<channel>** <announce text>`)

        let whatToAnnounce = args.slice(1).join(' ')
        if(!whatToAnnounce) return error.send(bot,message.channel,`Required argument missing!\n\n Usage: !announce <channel> **<announce text>**`)

        let announce = bot.emojis.resolve(emojis["notification"])
        let embedMessage = new discord.MessageEmbed()
            .setTitle(`**${channelToAnnounce.name.toUpperCase()}**`)
            .setColor(color)
            .setDescription(`${whatToAnnounce}\n\n${announce} Announcement by: ${message.author}`)
            .setFooter(footerText.replace("%version%",version),message.author.displayAvatarURL())
            .setTimestamp();
        await channelToAnnounce.send(embedMessage)
    }
}