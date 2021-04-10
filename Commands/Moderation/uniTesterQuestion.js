const discord = require ('discord.js')
const error = require('../../Utils/error')
const db = require('quick.db');
const emojis = require('../../Configs/emojis.json')
const {prefix,footerText,footerIcon,color,version} = require('../../Configs/botconfig.json')
const {suggestionChannelId} =  require('../../Managers/configManager')()
const config =  require('../../Managers/configManager')()



module.exports = {
    name: "unitesterQuestions",
    description:"Adds a user to UniTesters Team.",
    aliases:["unitesterQuestion","questions","question"],
    category:"🛠 Moderation",
    usage:`${prefix}unitesterQuestions <option> <text/id>`,
    permission: 8,
    execute: async (bot,message,args) => {
        let testersQuestions = db.has("BetaTesters.questions") ? db.get("BetaTesters").questions : []
        let options = ["add","remove","list"]
        if(args.length<1 || !options.some(option => option!==args[0])) return error.send(bot,message.channel,`Unknown Option!\n\n**Available Categories: ** \n \`add\` \n \`remove\` \n \`list\`\n\nUsage !unitesterQuestions **<option>** <text>`)
        let option = args[0].toLowerCase()
        let tick = bot.emojis.resolve(emojis["tick"])
        switch (option){
            case "list":
                let desc = testersQuestions.map((question,index) => `\`${index}\` - ${question}`).join("\n")
                let list = new discord.MessageEmbed()
                    .setColor(color)
                    .setDescription(`**UniTester Questions**\n${desc.length < 2 ? "None" : desc}`)
                    .setTimestamp()
                message.channel.send(list)
                break;
            case "add":
                if(args.length<2) return error.send(bot,message.channel,`Specify a question to add!\n\n Usage !unitesterQuestions add **<text>**`)
                let question = args.slice(1).join(" ")
                testersQuestions.push(question)
                let added = new discord.MessageEmbed()
                    .setColor(color)
                    .setAuthor(`${message.author.tag}`,message.author.displayAvatarURL())
                    .setDescription(`Successfully added question ${tick}\n\n**Question: ** ${question}`)
                    .setTimestamp()
                message.channel.send(added)
                break;
            case "remove":
                if(args.length<2 || args[1].match(/^[A-Za-z]+$/)) return error.send(bot,message.channel,`Only numerical values are allowed!\n\n Usage !unitesterQuestions remove **<questionID>**`)
                if(parseInt(args[1]) > (testersQuestions.length-1)) return error.send(bot,message.channel,`Unknown Question!\n\n Usage !unitesterQuestions remove **<questionID>**`)
                let removed = new discord.MessageEmbed()
                    .setColor(color)
                    .setAuthor(`${message.author.tag}`,message.author.displayAvatarURL())
                    .setDescription(`Successfully removed question ${tick}\n\n**Question: ** ${testersQuestions[parseInt(args[1])]}`)
                    .setTimestamp()
                message.channel.send(removed)
                testersQuestions.splice(parseInt(args[1]),1)
                break

        }
        db.set("BetaTesters.questions",testersQuestions)

    }
}