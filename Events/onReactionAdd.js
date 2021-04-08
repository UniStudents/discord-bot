const discord = require('discord.js')
const fetchMessages = require('../Managers/MessageFetcher')
const memberRunnable = require('../Runnables/MemberCounter')
let Ticket = require("../Classes/Ticket.js")
const config =  require('../Managers/configManager')()
const db = require('quick.db');




const activities = [
    "with your grades",
    "with your progress"
]

module.exports = {
    name: "messageReactionAdd",
    execute: async (bot) => {
        bot.on('messageReactionAdd',(reaction,user) => {
            if(reaction.message.channel.type ==="dm" || user.bot) return
            //Handle Support reactions
            if(reaction.message.id === config.support_settings.supportMessageId){
                reaction.users.remove(user)
                ticketSupportFunction(reaction,user,bot)
            }
            //Close ticket
            let tickets = db.has("Tickets") ? db.get("Tickets") : []
            if(tickets.some(ticket => ticket.initialMessageID === reaction.message.id)){
                reaction.message.channel.delete("Ticket deleted by user")
                //todo add transScript send to user and logs
            }

        })
    }
}

function ticketSupportFunction(reaction,user,bot){
    let ticket = new Ticket(reaction.message,user)
    ticket.create(bot,reaction.message.guild,null).then(isCreated=>{
        if(isCreated){
            ticket.saveTicket()
        }
    })
}