const {prefix} = require('../Configs/botconfig.json')
const error = require('../Utils/error')
const db = require('quick.db');

module.exports = {
    name: "message",
    execute: async(bot) => {
        bot.on('message',(msg) => {
            let message = msg.content
            if(!message.startsWith(prefix)) return
            let args = message.slice(prefix.length).trim().split(' ')
            let cmdName = args.shift().toLowerCase()
            let commandToExecute = bot.commands.get(cmdName) || Array.from(bot.commands.values()).find(cmdFile => cmdFile.aliases && cmdFile.aliases.includes(cmdName))
            if(commandToExecute){
                msg.delete()
                let permissions = db.has("Permissions") ? db.get("Permissions") : {}
                if(!permissions[msg.author.id]){
                    db.set(`Permissions.${msg.author.id}`,{perm:1})
                }
                let userPerm = db.has(`Permissions.${msg.author.id}`) ? db.get(`Permissions.${msg.author.id}`).perm : 1
                if(userPerm >=  commandToExecute.permission){
                    commandToExecute.execute(bot,msg,args)
                }else{
                    error.send(bot,msg.channel,"You dont have permission to do that")
                }
            }
        })
    }
}