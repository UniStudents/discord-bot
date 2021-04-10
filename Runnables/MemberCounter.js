const config =  require('../Managers/configManager')()
const db = require('quick.db');


module.exports.start = (bot) => {
    //Every 5 minutes
    setInterval(()=>{
        let members = bot.channels.cache.get(config.counters.memberCounterChannelId)
        let betaTesters = bot.channels.cache.get(config.counters.betaTestersCounterChannelId)
        let testers = db.has("BetaTesters") ? db.get("BetaTesters").list : {}
        let testersMax = db.has("BetaTesters.max") ? db.has("BetaTesters").max : config.betaTesters_settings.betaTestersMax
        members.setName(`[${members.guild.memberCount}] Members`);
        betaTesters.setName(`[${ Object.keys(testers).length}/${testersMax}] UniTesters`);
    },5*60*1000)

}