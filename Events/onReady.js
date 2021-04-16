const discord = require('discord.js')
const fetchMessages = require('../Managers/MessageFetcher')
const memberRunnable = require('../Runnables/MemberCounter')
const embedSetupSupport = require('../EmbedSetups/supportChatEmbedSetup')
const embedSetupBeta = require('../EmbedSetups/betatestChatEmbedSetup')




const activities = [
    "with your grades",
    "with your progress"
]

module.exports = {
    name: "ready",
    execute: async (bot) => {
        bot.on('ready', () => {
            fetchMessages.fetch(bot).then(fetchedMessages =>{
                let loaded = fetchedMessages.reduce((a, b) => a + b, 0)
                console.log(`Successfully fetched ${loaded} Messages`)
                embedSetupSupport.setup(bot)
                embedSetupBeta.setup(bot)
            })
            //SetupSupport message
            memberRunnable.start(bot)
            setInterval(() => {
                const index = Math.floor(Math.random() * (activities.length - 1) + 1)
                bot.user.setActivity(activities[index])
            }, 10000)

        })
    }
}