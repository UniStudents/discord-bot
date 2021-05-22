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
    guild
    acceptMessageID
    constructor(message, user) {
        this.author = user;
        this.createdAt = Date.now();
        this.name = `beta-${this.author.id}`
        this.guild = message.guild;
    }

    saveApplication() {
        db.push("Applications",{
            name : this.name,
            createdAt: this.createdAt,
            channelID: this.channel.id,
            guildID: this.guild.id,
            author: this.author,
            initialMessageID: this.initialMessage.id,
            acceptMessageID: null
        })
    }
   async create(bot) {
       let applications = db.has("Applications") ? db.get("Applications") : []
       let testers = db.has("BetaTesters") ? db.get("BetaTesters").list : {}
       let testersMax = db.has("BetaTesters.max") ? db.has("BetaTesters").max : config.betaTesters_settings.betaTestersMax
       //Clear none used applications from db
       applications = applications.filter(application => Array.from(this.guild.channels.cache.keys()).includes(application.channelID));
       await db.set("Applications",applications)
       //Max ticket logic
       if(applications.length >= config.betaTesters_settings.maxBetaApplications || testers>=testersMax || applications.some(application => application.author.id === this.author.id) ){
           return false
       }

       let applicationCategory = bot.channels.cache.find(channel => channel.id === config.betaTesters_settings.betaTesterParentCategory)
       if(!applicationCategory || applicationCategory.guild.id !== this.guild.id) throw new Error("TicketCategory Not Found")
       this.channel = await applicationCategory.guild.channels.create(`${this.name}`)
       await this.channel.setParent(applicationCategory.id)
       //Permissions overwrite
       let guild_roles = this.guild.roles
       let rolesToOverwritePermsAllow = config.betaTesters_settings.betaAccessRoles.map(roleId =>{
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
       await this.channel.overwritePermissions(rolesToOverwritePermsAllow)
       //Inform user
       let mentionMessage = `${this.author}`
       let applicationDelete = bot.emojis.resolve(emojis["noEmoji"])
       let applicationMessage = new discord.MessageEmbed()
           .setColor(color)
           .setAuthor(`${this.author.tag}`,this.author.displayAvatarURL())
           .setDescription(`Hello  ${this.author} 👋,\n\nΦαίνεται πως θα ήθελες να γίνεις μέλος την ομάδας των UniTesters.\nTο μονο που χρειάζεται να κανεις είναι να απαντήσεις στις παρακάτω ερωτήσεις\n\nΜπορείς οποιαδήποτε στιγμή να αντίδράσεις με ένα ${applicationDelete} για να κλήσεις το application.`)
           .setTimestamp()
           .setFooter(footerText.replace("%version%",version))
       this.initialMessage = await this.channel.send(applicationMessage)
       await this.initialMessage.react(applicationDelete)
       await this.channel.send(mentionMessage).then(message => message.delete({ timeout: 200 }))
       return true
    }

    startCollector(bot){
        let testersQuestions = db.has("BetaTesters.questions") ? db.get("BetaTesters").questions : []
        let answer = new Map();
        // Collector
        const filter = msg => msg.author.id === this.author.id;
        //todo change idle to 5minutes
        const collector = this.channel.createMessageCollector(filter, { idle: 5*60*1000 , max: testersQuestions.length});
        let counter = 0
        let applicationMessage = new discord.MessageEmbed()
            .setColor(color)
            .setAuthor(`${this.author.tag}`,this.author.displayAvatarURL())
            .setDescription(`${testersQuestions[counter]}`)
            .setTimestamp()
            .setFooter(footerText.replace("%version%",version))
        this.channel.send(applicationMessage)
        collector.on('collect', msg => {
            answer.set(testersQuestions[counter],msg.content)
            counter++
            if(counter<testersQuestions.length) {
                applicationMessage.setDescription(testersQuestions[counter])
                this.channel.send(applicationMessage)
            }
        });

        collector.on('end', async (collected,reason) => {
            if(reason.toLowerCase() === "limit" || reason.toLowerCase() === "max"){
                let lastQuestion = new discord.MessageEmbed()
                    .setColor(color)
                    .setAuthor(`UniTester Application`,this.author.displayAvatarURL())
                    .setDescription(`Είσαι σίγουρος πως θέλεις να υποβάλεις την αίτηση σου ?`)
                    .setTimestamp()
                    .setFooter(footerText.replace("%version%",version))
                let lastQuestionMessage = await this.channel.send(lastQuestion)
                startMessageValidation(lastQuestionMessage,bot,answer,this.author,this.channel).catch(e=>{
                    //console.log(e)
                })
            }else{
                this.channel.delete("Application deleted due to inactivity")
            }
        });
    }

}

async function startMessageValidation(message,bot,answer,member,channel){
    let yesEmoji = bot.emojis.resolve(emojis["yesEmoji"])
    let noEmoji = bot.emojis.resolve(emojis["noEmoji"])
    await message.react(yesEmoji)
    await message.react(noEmoji)
    const filter = (reaction, user) => {
        return user.id === member.id && reaction.message.id === message.id;
    };
    const collector = message.createReactionCollector(filter, { max: 1,time: 5*60*1000 });
    collector.on('collect', (reaction, user) => {

        if(reaction.emoji.id === yesEmoji.id){
            channel.updateOverwrite(member,{
                VIEW_CHANNEL: false,
                SEND_MESSAGES: false,
                ATTACH_FILES: false,
                READ_MESSAGE_HISTORY: false
            })
            logAnalytics(bot,answer,member,channel)
        }else{
            channel.delete("Application deleted by user")
        }
    });

    collector.on('end', (collected,reason) => {
        if(reason.toLowerCase() !== "limit"){
            channel.overwritePermissions(extraPerms)
            logAnalytics(bot,answer,member,channel)
        }
    });
}

async function logAnalytics(bot,answers,member,channel){
    let yesEmoji = bot.emojis.resolve(emojis["yesEmoji"])
    let noEmoji = bot.emojis.resolve(emojis["noEmoji"])
    await channel.bulkDelete(100,true)
    let analytics = new discord.MessageEmbed()
        .setColor(color)
        .setAuthor(`UniTester Application`,member.displayAvatarURL())
        .setTimestamp()
        .setFooter(footerText.replace("%version%",version))
    answers.forEach((value, key)=>{
        analytics.addField(key,`\`\`\`${value}\`\`\``)
    })
    channel.send(analytics)
    let accept = new discord.MessageEmbed()
        .setColor(color)
        .setAuthor(`UniTester Application`,member.displayAvatarURL())
        .setDescription(`**Application by:** ${member} - ${member.tag}`)
        .setTimestamp()
        .setFooter(footerText.replace("%version%",version))
    let acceptMessage = await channel.send(accept)
    await acceptMessage.react(yesEmoji)
    await acceptMessage.react(noEmoji)
    //Change accept message
    let applications = db.has("Applications") ? db.get("Applications") : []
    applications = applications.map(application =>{
        if(application.channelID === channel.id ){
            application.acceptMessageID = acceptMessage.id
        }
        return application
    })
    await db.set("Applications",applications)
    let testers = db.has("ApplicationsInfo") ? db.get("ApplicationsInfo") : {}
    testers[member.id] = await Object.fromEntries(answers)
    db.set("ApplicationsInfo",testers)

}