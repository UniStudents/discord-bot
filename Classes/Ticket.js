'use strict';
const discord = require('discord.js')
const db = require('quick.db');
const error = require('../Utils/error')
const emojis = require('../Configs/emojis.json')
const {color,footerText,version,} = require('../Configs/botconfig.json')
const config = require('../Managers/configManager')()




module.exports = class Ticket {
    channel
    name
    initialMessage
    subject
    guild
    constructor(message) {
        this.message = message;
        this.author = message.author;
        this.ticketCreatedAt = Date.now();
        this.name = `ticket-${this.author.id}`
        this.guild = message.guild.id;
    }
    //Save Ticket into Db
    saveTicket() {
        db.push("Tickets",{
            name : this.name,
            createdAt: this.ticketCreatedAt,
            channelID: this.channel.id,
            guildID: this.guild,
            author: this.author,
            subject: this.subject,
            initialMessageID: this.initialMessage.id
        })

    }
    //Create Ticket Function
    async create(bot,guild,subject){
        let tickets = db.has("Tickets") ? db.get("Tickets") : []
        if(tickets.some(ticket => ticket.name === `${this.name}`)){
            let ticket = tickets.find(ticket => ticket.name === `${this.name}`)
            if(guild.channels.cache.has(ticket.channelID)) {
                await error.send(bot, this.message.channel, "You already have an opened ticket\nMax amount of tickets is \`\`1\`\`.")
                return false
            }else{
                db.delete("Tickets",ticket)
            }
        }
        this.subject =subject;
        let ticketCategory = bot.channels.cache.find(channel => channel.id === config.ticket_settings.ticketCategoryId)
        if(!ticketCategory || ticketCategory.guild !== this.message.guild) throw new Error("TicketCategory Not Found")
        this.channel = await guild.channels.create(`${this.name}`)
        await this.channel.setParent(ticketCategory.id)
        let guild_roles = this.message.guild.roles
        let rolesToOverwritePermsAllow = config.ticket_settings.ticketAccessRoles.map(roleId =>{
            if(guild_roles.cache.has(roleId)){
                return {
                    id: guild_roles.cache.get(roleId).id,
                    allow: ['VIEW_CHANNEL','SEND_MESSAGES','ATTACH_FILES','READ_MESSAGE_HISTORY']
                }
            }
        })
        let extraPerms = [{
            id: this.message.author.id,
            allow: ['VIEW_CHANNEL','SEND_MESSAGES','ATTACH_FILES','READ_MESSAGE_HISTORY']
        },{
            id: config.ticket_settings.everyoneRoleId,
            deny: ['VIEW_CHANNEL','SEND_MESSAGES','ATTACH_FILES','READ_MESSAGE_HISTORY']
        }]
        //Merge Arrays
        rolesToOverwritePermsAllow = extraPerms.concat(rolesToOverwritePermsAllow)
        console.log(rolesToOverwritePermsAllow)
        await this.channel.overwritePermissions(rolesToOverwritePermsAllow)
        //Send Info Messages
        let tick = bot.emojis.resolve(emojis["tick"])
        let embed = new discord.MessageEmbed()
           .setColor(color)
           .setAuthor(`${this.message.author.tag}`,this.message.author.displayAvatarURL())
           .setDescription(`Hello ${this.message.author},\n\nYour ticket created successfully! ${tick}\nChannel: ${this.channel}`)
           .setTimestamp()
           .setFooter(footerText.replace("%version%",version))
        await this.message.channel.send(embed)
        let mentionMessage =  config.ticket_settings.ticketAccessRoles.map(roleId=> `<@&${roleId}>`).join(" ") + ` ${this.message.author}`
        let supportMessage = new discord.MessageEmbed()
            .setColor(color)
            .setAuthor(`${this.message.author.tag}`,this.message.author.displayAvatarURL())
            .setDescription(`Dear ${this.message.author},\n\nThank you for reaching out to our support team!\nOur staff will be with you as soon as possible`)
            .addField("Your Subject", this.subject)
            .setTimestamp()
            .setFooter(footerText.replace("%version%",version))
        this.initialMessage = await this.channel.send(supportMessage)
        await this.channel.send(mentionMessage).then(message => message.delete({ timeout: 200 }))
        return true

    }
}