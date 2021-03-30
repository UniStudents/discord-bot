const discord = require('discord.js')

const activities = [
    "with your grades",
    "with your progress"
]

module.exports = {
    name: "ready",
    execute: async (bot) => {
        bot.on('ready',() => {
            setInterval(() => {
                const index = Math.floor(Math.random() * (activities.length - 1) + 1)
                bot.user.setActivity(activities[index])
            }, 10000)
        })
    }
}