const discord = require ('discord.js')
const error = require('../../Utils/error')
const db = require('quick.db');
const emojis = require('../../Configs/emojis.json')
const {prefix,footerText,footerIcon,color,version} = require('../../Configs/botconfig.json')
const {suggestionChannelId} =  require('../../Managers/configManager')()


module.exports = {
    name: "ouf",
    description:"",
    aliases:["oof"],
    category:"🛠 Moderation",
    usage:`${prefix}ouf`,
    permission: 8,
    execute: async (bot,message,args) => {
        let messageToReact = message.channel.messages.fetch({ limit: 10 }).then(messages => {
            if(!messages) return
            let lastMessage = messages.filter(message=> !message.content.startsWith("!")).first();

            if (!lastMessage.author.bot) {
                lastMessage.react("🇴")
                lastMessage.react("🇺")
                lastMessage.react("🇫")
            }
        }).catch(e=>{
            //the message was deleted or something went wrong
        });

    }
}