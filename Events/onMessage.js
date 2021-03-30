const {prefix} = require('../Configs/botconfig.json')
const error = require('../Utils/error')

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
                commandToExecute.execute(bot,msg,args)
                /*if(!permissions[msg.author.id]){
                    permissions = utils.saveUserToJson(permissions,msg.author)
                }
                //todo handle it with sql
                if(permissions[msg.author.id]["perm"] >=  commandToExecute.permission){
                    commandToExecute.execute(bot,msg,args)
                }else{
                    error.send(bot,msg.channel,"You dont have permission to do that")
                }*/
            }
        })
    }
}