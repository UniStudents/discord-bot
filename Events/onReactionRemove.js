const discord = require('discord.js')
const fetchMessages = require('../Managers/MessageFetcher')
const memberRunnable = require('../Runnables/MemberCounter')
let Ticket = require("../Classes/Ticket.js")
const config =  require('../Managers/configManager')()
const db = require('quick.db');


module.exports = {
    name: "messageReactionRemove",
    execute: async (bot) => {
        bot.on('messageReactionRemove',(reaction,user) => {
            if(reaction.message.channel.type ==="dm" || user.bot) return
            //Announcement Role Handler Remove
            if(reaction.message.id === config.welcome_settings.welcomeMessageId) {
                handleAnnouncement(reaction,user,bot)
            }

        })
    }
}



function handleAnnouncement(reaction,user,bot){
    let annRole = reaction.message.guild.roles.cache.get(config.welcome_settings.announcementsRoleId)
    let member = reaction.message.guild.members.cache.get(user.id)
    if(!member || !annRole) return
    if(member.roles.cache.has(annRole.id)){
        member.roles.remove(annRole)
    }
}