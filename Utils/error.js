const discord = require('discord.js')
const {footerText,footerIcon,color,version} = require('../Configs/botconfig.json')
const emojis = require('../Configs/emojis.json')


module.exports ={
    send: async (bot,channel,message,time=0)=>{
        let errorEmoji = bot.emojis.resolve(emojis["error"])
        let error = new discord.MessageEmbed()
            .setColor(color)
            .setDescription(`${errorEmoji} ${message}`)
            .setFooter(footerText.replace("%version%",version))
            .setTimestamp();
          channel.send(error).then(msg=> {
              if(time>0) msg.delete(time)
          }).catch(e=>{
              //todo handle error with an error handler
          })
    }
}