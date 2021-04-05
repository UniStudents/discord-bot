const messages = require(`../Configs/fetchMessages.json`)
const db = require('quick.db');



module.exports.fetch = async function (bot) {
    let i = 0
    //PreSet Messages
    messages.forEach(message => {
        bot.channels.fetch(message["channelID"]).then(channel=>{
            if(message["messageID"]) return channel.messages.fetch(message["messageID"])
        }).catch(e=>{
            //console.log(e)
        })
    })
    //Tickets
    let tickets = db.has("Tickets") ? db.get("Tickets") : []
    tickets.forEach(ticket =>{
        bot.channels.fetch(ticket["channelID"]).then(channel=>{
            channel.messages.fetch(ticket["initialMessageID"])
        }).catch(e=>{
            //console.log(e)
        })
    })
}