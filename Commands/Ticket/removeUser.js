const discord = require ('discord.js')
const error = require('../../Utils/error')
const emojis = require('../../Configs/emojis.json')
const db = require('quick.db');
const {prefix,footerText,footerIcon,color,version} = require('../../Configs/botconfig.json')
const {suggestionChannelId} =  require('../../Managers/configManager')()
let Ticket = require("../../Classes/Ticket.js")

module.exports = {
    name: "removeUser",
    description:"Removes a user to a ticket.",
    aliases:["userRemove"],
    category:"Ticket",
    usage:`${prefix}removeUser <@User>`,
    permission: 1,
    execute: async (bot,message,args) => {
        let tickets = db.has("Tickets") ? db.get("Tickets") : []
        if(!tickets.some(ticket => ticket.channelID === message.channel.id)) return error.send(bot,message.channel,`This command can only be used under Ticket channels!`)

        if(args.length<1) return error.send(bot,message.channel,`Required argument missing!\n\n Usage !removeUser **<@User>**`)

        let userToAdd = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(member => member.name === args[0]) ||message.guild.members.cache.find(member => member.id === args[0])
        if(!userToAdd) return error.send(bot,message.channel,`User not found!\n\n Usage !removeUser **<@User>**`)

        await message.channel.updateOverwrite(userToAdd,{
            VIEW_CHANNEL: false,
            SEND_MESSAGES: false,
            ATTACH_FILES: false,
            READ_MESSAGE_HISTORY: false
        })
        let tick = bot.emojis.resolve(emojis["tick"])
        let added = new discord.MessageEmbed()
            .setColor(color)
            .setAuthor(`${userToAdd.user.tag}`,userToAdd.user.displayAvatarURL())
            .setDescription(`Successfully removed user ${userToAdd} from the ticket ${tick}`)
            .setTimestamp()
        await message.channel.send(added)
    }
}