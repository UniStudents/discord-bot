const discord = require ('discord.js')
const error = require('../Utils/error')
const db = require('quick.db');
const emojis = require('../Configs/emojis.json')
const {prefix,footerText,footerIcon,color,version} = require('../Configs/botconfig.json')
const {suggestionChannelId} =  require('../Managers/configManager')()
const config =  require('../Managers/configManager')()

module.exports.start = async (bot,user) => {
    let testers = db.has("BetaTesters.list") ? db.get("BetaTesters").list : {}
    let applications = db.has("BetaTesters.applications") ? db.get("BetaTesters").applications : {}
    if(testers[user.id] || applications[user.id]) return;
    let applyCategory = bot.channels.cache.find(channel => channel.id === config.betaTesters_settings.betaTesterParentCategory)
    if(!applyCategory || applyCategory.guild.id !== user.guild.id) throw new Error("TicketCategory Not Found")
    let channel = await user.guild.channels.create(`application-${user.id}`)
    await this.channel.setParent(applyCategory.id)
    //Perms
    let guild_roles = user.guild.roles
    let rolesToOverwritePermsAllow = config.betaTesters_settings.betaAccessRoles.map(roleId =>{
        if(guild_roles.cache.has(roleId)){
            return {
                id: guild_roles.cache.get(roleId).id,
                allow: ['VIEW_CHANNEL','SEND_MESSAGES','ATTACH_FILES','READ_MESSAGE_HISTORY']
            }
        }
    })
    let extraPerms = [{
        id: user.id,
        allow: ['VIEW_CHANNEL','SEND_MESSAGES','ATTACH_FILES','READ_MESSAGE_HISTORY']
    },{
        id: config.ticket_settings.everyoneRoleId,
        deny: ['VIEW_CHANNEL','SEND_MESSAGES','ATTACH_FILES','READ_MESSAGE_HISTORY']
    }]
    //Merge Arrays
    rolesToOverwritePermsAllow = extraPerms.concat(rolesToOverwritePermsAllow)
    await channel.overwritePermissions(rolesToOverwritePermsAllow)
    //Questions
    let testersQuestions = db.has("BetaTesters.questions") ? db.get("BetaTesters").questions : []
    let answer = new Map();
   // Collector
    const filter = m => m.id === user.id;
    const collector = channel.createMessageCollector(filter, { idle: 5*60*1000 , max: testersQuestions.length});
    collector.on('collect', m => {
        console.log(`Collected ${m.content}`);
    });

    collector.on('end', collected => {
        console.log(`Collected ${collected.size} items`);
    });
    //todo create EmbedSetup for Application | add on Reaction endCollector | saveApplication | make TranScript


}

function saveApplication(applications,user,channel,lastMessage){
    applications[user.id] ={
        channelID: channel.id,
        authorID: user.id,
        lastMessageID: lastMessage.id
    }

}