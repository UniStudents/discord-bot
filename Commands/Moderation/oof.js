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
        let messageToReact = message.channel.messages.fetch({ limit: 1 }).then(messages => {
            console.log(messages)
            if(!messages) return
            let lastMessage = messages.first();
            console.log(lastMessage.content)

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