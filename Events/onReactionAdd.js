const discord = require('discord.js')
const fetchMessages = require('../Managers/MessageFetcher')
const memberRunnable = require('../Runnables/MemberCounter')
let Ticket = require("../Classes/Ticket.js")
let Application = require("../Classes/Application")
const emojis = require('../Configs/emojis.json')
const {prefix,footerText,footerIcon,color,version} = require('../Configs/botconfig.json')


const config =  require('../Managers/configManager')()
const db = require('quick.db');


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


            //Handle Application reactions
            if(reaction.message.id === config.betaTesters_settings.betaTesterMessageId){
                reaction.users.remove(user)
                applicationFunction(reaction,user,bot)
            }
            let applications = db.has("Applications") ? db.get("Applications") : []
            if(applications.some(application => application.initialMessageID === reaction.message.id && reaction.message.id === application.initialMessageID )){
                reaction.message.channel.delete("Application deleted by user")
            }
            //handle accept
            if(applications.some(application => application.acceptMessageID === reaction.message.id)){
                let application = applications.find(application => application.acceptMessageID === reaction.message.id)
                if(!application) return
                let member = reaction.message.guild.members.cache.find(member => member.id === application.author.id)
                handleBetaAccept(reaction,member,bot)
            }
            //Announcement Role Handler
            if(reaction.message.id === config.welcome_settings.welcomeMessageId) {
                handleAnnouncement(reaction,user,bot)
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

function applicationFunction(reaction,user,bot){
    let application = new Application(reaction.message,user)
    application.create(bot,reaction.message.guild).then(isCreated=>{
        if(isCreated){
            application.saveApplication()
            application.startCollector(bot)
        }
    })
}


async function handleBetaAccept(reaction,user,bot){
    let yesEmoji = bot.emojis.resolve(emojis["yesEmoji"])
    let testers = db.has("BetaTesters") ? db.get("BetaTesters").list : {}
    if(!user) return reaction.message.channel.delete("Application deleted by an Admin")
    if(reaction.emoji.id === yesEmoji.id){
        let unitestersRole = user.guild.roles.cache.get(config.betaTesters_settings.betaTesterRoleId)
        if(!user.roles.cache.has(unitestersRole.id)) await user.roles.add(unitestersRole)
        testers[user.id] = {
            name: user.user.tag,
            id: user.id,
        }
        db.set("BetaTesters.list",testers)
        let tick = bot.emojis.resolve(emojis["tick"])
        let added = new discord.MessageEmbed()
            .setColor(color)
            .setAuthor(`${user.user.tag}`,user.user.displayAvatarURL())
            .setDescription(`Successfully added user ${user} to the UniTester's team ${tick}`)
            .setTimestamp()
        await reaction.message.channel.send(added)
        //Welcome message
        let welcome = new discord.MessageEmbed()
            .setColor(color)
            .setAuthor(`${user.user.tag}`,user.user.displayAvatarURL())
            .setDescription(`Welcome ${user}`)
            .setTimestamp()
        let betaGeneral = user.guild.channels.cache.get(config.betaTesters_settings.betaTesterGeneralChannelId)
        if(!betaGeneral) return
        await betaGeneral.send(welcome)
        await betaGeneral.send(`${user}`).then(msg => msg.delete({timeout:200}))
        setTimeout(()=>{
            reaction.message.channel.delete("Application deleted by an Admin")
        },10*1000)
    }else{
         reaction.message.channel.delete("Application deleted by an Admin")
    }

}



function handleAnnouncement(reaction,user,bot){
    let annRole = reaction.message.guild.roles.cache.get(config.welcome_settings.announcementsRoleId)
    let member = reaction.message.guild.members.cache.get(user.id)
    if(!member || !annRole) return
    if(!member.roles.cache.has(annRole.id)){
        member.roles.add(annRole)
    }
}