const config =  require('../Managers/configManager')()
const db = require('quick.db');


module.exports.start = (bot) => {
    //Every 5 minutes
    setInterval(()=>{
        let members = bot.channels.cache.get(config.counters.memberCounterChannelId)
        let betaTesters = bot.channels.cache.get(config.counters.betaTestersCounterChannelId)
        let testers = db.has("BetaTesters") ? db.get("BetaTesters").list : []
        let testersMax = db.has("BetaTesters") ? db.has("BetaTesters").max : 10
        members.setName(`[${members.guild.memberCount}] Members`);
        betaTesters.setName(`[${testers.length}/${testersMax}] Beta Testers`);
    },5*60*1000)

}