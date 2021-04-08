const discord = require ('discord.js')
const error = require('../../Utils/error')
const emojis = require('../../Configs/emojis.json')
const {prefix,footerText,footerIcon,color,version} = require('../../Configs/botconfig.json')
const {suggestionChannelId} =  require('../../Managers/configManager')()
let Ticket = require("../../Classes/Ticket.js")

module.exports = {
    name: "ticket",
    description:"Creates a ticket!",
    aliases:["createTicket"],
    category:"Ticket",
    usage:`${prefix}ticket <subject>`,
    permission: 1,
    execute: async (bot,message,args) => {
        const subject = args.join(" ");
        if(!subject){
            await error.send(bot,message.channel,`Required argument missing!\n\n Usage !ticket **<subject>**`)
            return
        }
        let ticket = new Ticket(message)
        let isCreated = await ticket.create(bot,message.guild,subject)
        if(isCreated){
            ticket.saveTicket()
        }
        //todo add close ticket with/without Timer
    }
}