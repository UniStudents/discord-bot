const messages = require(`../Configs/fetchMessages.json`)
const db = require('quick.db');



module.exports.fetch = function (bot) {


    //PreSet Messages
    let tickets = db.has("Tickets") ? db.get("Tickets") : []
    let fetchMessagesPromises = messages.map(message =>fetch(message["channelID"],message["messageID"],bot))
    let ticketPromises = tickets.map(ticket => fetch(ticket["channelID"],ticket["initialMessageID"],bot))
    let promises = [].concat.apply([], [ticketPromises,fetchMessagesPromises]);
    return Promise.all(promises)
}

async function fetch(channelID,messageID,bot){
  let channel = await bot.channels.fetch(channelID).catch(e=>{});
  if(!channel) return 0
  let message = await channel.messages.fetch(messageID).catch(e=>{});
  if(!message) return 0;
  return  1
}