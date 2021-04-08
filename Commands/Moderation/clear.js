const discord = require ('discord.js')
const error = require('../../Utils/error')
const db = require('quick.db');
const emojis = require('../../Configs/emojis.json')
const {prefix,footerText,footerIcon,color,version} = require('../../Configs/botconfig.json')
const {suggestionChannelId} =  require('../../Managers/configManager')()


module.exports = {
    name: "clear",
    description:"Adds a user to a ticket.",
    aliases:["purge"],
    category:"🛠 Moderation",
    usage:`${prefix}addUser <@User>`,
    permission: 5,
    execute: async (bot,message,args) => {
        let messagesToDelete = args.length>0 && !args[0].match(/^[A-Za-z]+$/) ? args[0] : null
        if(!messagesToDelete) return error.send(bot,message.channel,`Only numerical values are allowed!\n\n Usage !purge **<amount>**`)
        messagesToDelete = parseInt(messagesToDelete);
        if(messagesToDelete<2 || messagesToDelete>100) return error.send(bot,message.channel,`Required argument missing!\nPlease provide a number between 2 and 100 for the number of messages to delete.`)
        message.channel.bulkDelete(messagesToDelete,true).then(messages =>{
            let tick = bot.emojis.resolve(emojis["tick"])
            let clear = new discord.MessageEmbed()
                .setColor(color)
                .setAuthor(`${message.author.tag}`,message.author.displayAvatarURL())
                .setDescription(`${tick} Successfully deleted **${messages.size}** messages! ${tick}`)
                .setFooter(footerText.replace("%version%",version),message.author.displayAvatarURL())
                .setTimestamp();
            message.channel.send(clear).then(message => message.delete({timeout:5*1000}))
        }).catch(e=>{
            console.log(e)
            error.send(bot,message.channel,`Couldn't delete messages because of:\n\n${e}`)
        })

    }
}