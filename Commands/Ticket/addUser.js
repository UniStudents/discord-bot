const discord = require ('discord.js')
const error = require('../../Utils/error')
const db = require('quick.db');
const emojis = require('../../Configs/emojis.json')
const {prefix,footerText,footerIcon,color,version} = require('../../Configs/botconfig.json')
const {suggestionChannelId} =  require('../../Managers/configManager')()
let Ticket = require("../../Classes/Ticket.js")

module.exports = {
    name: "addUser",
    description:"Adds a user to a ticket.",
    aliases:["userAdd"],
    category:"Ticket",
    usage:`${prefix}addUser <@User>`,
    permission: 8,
    execute: async (bot,message,args) => {
        let tickets = db.has("Tickets") ? db.get("Tickets") : []
        if(!tickets.some(ticket => ticket.channelID === message.channel.id)) return error.send(bot,message.channel,`This command can only be used under Ticket channels!`)

        if(args.length<1) return error.send(bot,message.channel,`Required argument missing!\n\n Usage !addUser **<@User>**`)

        let userToAdd = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(member => member.name === args[0]) ||message.guild.members.cache.find(member => member.id === args[0])
        if(!userToAdd) return error.send(bot,message.channel,`User not found!\n\n Usage !addUser **<@User>**`)

        await message.channel.updateOverwrite(userToAdd,{
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true,
            ATTACH_FILES: true,
            READ_MESSAGE_HISTORY: true
        })

        let tick = bot.emojis.resolve(emojis["tick"])
        let added = new discord.MessageEmbed()
            .setColor(color)
            .setAuthor(`${userToAdd.user.tag}`,userToAdd.user.displayAvatarURL())
            .setDescription(`Successfully added user ${userToAdd} to the ticket ${tick}`)
            .setTimestamp()
        await message.channel.send(added)
        await message.channel.send(`${userToAdd}`).then(message => message.delete({timout:200}))

    }
}