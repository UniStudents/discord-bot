const discord = require ('discord.js')
const {prefix,color,footerText,version,footerIcon} = require('../../Configs/botconfig.json')
const error = require('../../Utils/error')
const emojis = require('../../Configs/emojis.json')

module.exports = {
    name: "edit",
    description:"Edits a specific message based on its ID",
    aliases:["editraw"],
    category:"📝 Info",
    usage:`${prefix}edit <messageID> <text>`,
    permission: 8,
    execute: async (bot,message,args) => {
        if(args.length<1) return error.send(bot,message.channel,`Required argument missing!\n\n Usage: !edit **<messageId>** <text>`)
        let channelID = message.channel.id
        let messageID = args[0]
        if(args.length<2) return error.send(bot,message.channel,`Required argument missing!\n\n Usage: !edit <messageId> **<text>**`)
        let text = args.slice(1).join(" ")
        let channel = await bot.channels.fetch(channelID).catch(e=>{});
        if(!channel) return error.send(bot,message.channel,`Channel not found!\n\n Usage: !edit **<messageId>** <text>`)
        let messageToEdit = await channel.messages.fetch(messageID).catch(e=>{});
        if(!messageToEdit) return error.send(bot,message.channel,`Message not found!\n\n Usage: !edit **<messageId>** <text>`)
        await messageToEdit.edit(text);
    }
}