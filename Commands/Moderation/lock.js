const discord = require ('discord.js')
const error = require('../../Utils/error')
const db = require('quick.db');
const emojis = require('../../Configs/emojis.json')
const {prefix,footerText,footerIcon,color,version} = require('../../Configs/botconfig.json')
const {suggestionChannelId} =  require('../../Managers/configManager')()


module.exports = {
    name: "addUser",
    description:"Adds a user to a ticket.",
    aliases:["userAdd"],
    category:"Ticket",
    usage:`${prefix}addUser <@User>`,
    permission: 1,
    execute: async (bot,message,args) => {

    }
}