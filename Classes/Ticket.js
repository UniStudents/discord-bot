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
    command
    constructor(message,user=null) {
        if(!user) {
            this.message = message;
            this.author = message.author;
            this.ticketCreatedAt = Date.now();
            this.name = `ticket-${this.author.id}`
            this.guild = message.guild;
            this.command = true
        }else{
            this.message = message;
            this.author = user;
            this.ticketCreatedAt = Date.now();
            this.name = `ticket-${this.author.id}`
            this.guild = message.guild;
            this.command = false
        }
    }

    //Save Ticket into Db
    saveTicket() {
        db.push("Tickets",{
            name : this.name,
            createdAt: this.ticketCreatedAt,
            channelID: this.channel.id,
            guildID: this.guild.id,
            author: this.author,
            subject: this.subject,
            initialMessageID: this.initialMessage.id
        })

    }
    //Create Ticket Function
    async create(bot,guild,subject){
        let tickets = db.has("Tickets") ? db.get("Tickets") : []
        //Clear none used tickets from db
        tickets = tickets.filter(ticket => Array.from(guild.channels.cache.keys()).includes(ticket.channelID));
        await db.set("Tickets",tickets)
        //Max ticket logic
        if(tickets.length >= config.ticket_settings.maxTickets){
         if(this.command) await error.send(bot, this.message.channel, `Max amount of opened tickets reached. Try again later!\nMax amount of opened tickets is \`\`${config.ticket_settings.maxTickets}\`\`.`)
            return false
        }
        //Max ticket per user logic
        if(tickets.some(ticket => ticket.author.id === this.author.id)){
            let userOpenedTicket = tickets.filter(ticket => ticket.author.id === this.author.id)
            if(userOpenedTicket.length >= config.ticket_settings.ticketsPerUser){
                if(this.command) await error.send(bot, this.message.channel, `You already have an opened ticket\nMax amount of tickets is \`\`${config.ticket_settings.ticketsPerUser}\`\`.`)
                return false
            }
        }

        this.subject =subject;
        let ticketCategory = bot.channels.cache.find(channel => channel.id === config.ticket_settings.ticketCategoryId)
        if(!ticketCategory || ticketCategory.guild.id !== this.guild.id) throw new Error("TicketCategory Not Found")
        this.channel = await guild.channels.create(`${this.name}`)
        await this.channel.setParent(ticketCategory.id)
        let guild_roles = this.guild.roles
        let rolesToOverwritePermsAllow = config.ticket_settings.ticketAccessRoles.map(roleId =>{
            if(guild_roles.cache.has(roleId)){
                return {
                    id: guild_roles.cache.get(roleId).id,
                    allow: ['VIEW_CHANNEL','SEND_MESSAGES','ATTACH_FILES','READ_MESSAGE_HISTORY']
                }
            }
        })
        let extraPerms = [{
            id: this.author.id,
            allow: ['VIEW_CHANNEL','SEND_MESSAGES','ATTACH_FILES','READ_MESSAGE_HISTORY']
        },{
            id: config.ticket_settings.everyoneRoleId,
            deny: ['VIEW_CHANNEL','SEND_MESSAGES','ATTACH_FILES','READ_MESSAGE_HISTORY']
        }]
        //Merge Arrays
        rolesToOverwritePermsAllow = extraPerms.concat(rolesToOverwritePermsAllow)
        //console.log(rolesToOverwritePermsAllow)
        await this.channel.overwritePermissions(rolesToOverwritePermsAllow)
        //Send Info Messages
        let tick = bot.emojis.resolve(emojis["tick"])
        let embed = new discord.MessageEmbed()
           .setColor(color)
           .setAuthor(`${this.author.tag}`,this.author.displayAvatarURL())
           .setDescription(`Hello ${this.author},\n\nYour ticket created successfully! ${tick}\nChannel: ${this.channel}`)
           .setTimestamp()
           .setFooter(footerText.replace("%version%",version))
        if(this.command) await this.message.channel.send(embed)
        let mentionMessage =  config.ticket_settings.ticketAccessRoles.map(roleId=> `<@&${roleId}>`).join(" ") + ` ${this.author}`
        let ticketDelete = bot.emojis.resolve(emojis["ticketDelete"])
        let supportMessage = new discord.MessageEmbed()
            .setColor(color)
            .setAuthor(`${this.author.tag}`,this.author.displayAvatarURL())
            .setDescription(`Dear ${this.author},\n\nThank you for reaching out to our support team!\nOur staff will be with you as soon as possible\n\nReact bellow with ${ticketDelete} to close your ticket any time`)
            .setTimestamp()
            .setFooter(footerText.replace("%version%",version))
        if(this.subject) supportMessage.addField("Your Subject", this.subject)
        this.initialMessage = await this.channel.send(supportMessage)
        await this.initialMessage.react(ticketDelete)
        await this.channel.send(mentionMessage).then(message => message.delete({ timeout: 200 }))
        return true

    }
}