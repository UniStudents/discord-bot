const {prefix,color} = require('../Configs/botconfig.json')
const discord = require('discord.js')
const config = require('../Managers/configManager')()
const error = require('../Utils/error')
const path = require('path')
const db = require('quick.db');
const request = require(`request`);
const fs = require(`fs`);
const generalUtils = require("../Utils/generalUtils")
const emojis = require('../Configs/emojis.json')

//Saffron instance
const saffron = require("@poiw/saffron")
const {is} = require("cheerio/lib/api/traversing");



module.exports = {
    name: "message",
    execute: async(bot) => {
        bot.on('message',async (msg) => {
            parseMiddleware(msg,bot)
            msg = await linkCheck(msg).catch(e=>{ })
            if(!msg) return
            let message = msg.content
            if(!message.startsWith(prefix)) return
            let args = message.slice(prefix.length).trim().split(' ')
            let cmdName = args.shift().toLowerCase()
            let commandToExecute = bot.commands.get(cmdName) || Array.from(bot.commands.values()).find(cmdFile => cmdFile.aliases && cmdFile.aliases.map(alias => alias.toLowerCase()).includes(cmdName.toLowerCase()))
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

async function parseMiddleware(message,bot){
    let errorMessage = "Unknown"
    if(!message.author.bot && message.attachments.first() && message.attachments.first().name.endsWith(".json") && message.channel.id === config.parsers_settings.channelId){

        let load = bot.emojis.resolve(emojis["loading_dark"])
        let embed = new discord.MessageEmbed()
            .setColor(color)
            .setAuthor(`${message.author.tag}`,message.author.displayAvatarURL())
            .setDescription(`Processing ${load}`)
            .setTimestamp()
        let awaitEmbed = await message.channel.send(embed)
        let fileName = await download(message.attachments.first().url)
        if(!fileName) return awaitEmbed.delete()
        let fileraw =  await fs.readFileSync(fileName)
        //console.log("test")
        let file;
        try{
            file = await JSON.parse(fileraw)
            console.log(file)
        }catch (e){
            await error.send(bot,message.channel,`Malformed JSON file\n**More Info:**\n${e}`)
            return awaitEmbed.delete()
        }
        if(!file || (!file.urls && !file.url)) return awaitEmbed.delete()
        let parsed;
        parsed = await  saffron.parse(file).catch(e=> {
            console.log(e)
            errorMessage=e
        })

        if(!parsed || parsed instanceof Error || errorMessage instanceof Error) {
            await error.send(bot,message.channel,`Malformed JSON file or some provided data are wrong\n**More Info:**\n${errorMessage.message}`)
            console.log(errorMessage)
            return awaitEmbed.delete()
        }
        let resultPath = path.resolve(__dirname,`../Configs/Downloads/result.json`)
        await fs.writeFileSync(resultPath,JSON.stringify(parsed,null,4))
        await message.channel.send(`Result`,{
            files: [`${resultPath}`]
        })
        await awaitEmbed.delete()

    }

}
async function download(url){
    return new Promise(((resolve, reject) => {
        let fileName = path.resolve(__dirname,`../Configs/Downloads/parserExample_${Date.now()}.json`)
         request.get(url)
            .on('error', console.error)
            .pipe(fs.createWriteStream(fileName))
            .on("finish",()=>{
                resolve(fileName)
            });
    }))
}

async function linkCheck(msg){
    if(!msg) return
    let logsChannel = msg.guild.channels.cache.get(config.logsChannelId);
    if(msg.author.bot) return msg
    var expression = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
    var regex = new RegExp(expression);
    let whitelisted_channels = config.linksCheckSettings.whiteListedChannels
    let whitelisted_links = config.linksCheckSettings.whiteListedLinks
    let sentence_links = msg.content.split(regex).filter(word=> regex.test(word))
    let userPerm = db.has(`Permissions.${msg.author.id}`) ? db.get(`Permissions.${msg.author.id}`).perm : 1
    if(!config.linksCheckSettings.useGoogleWebRiskApi){
        if(!sentence_links.every(link => whitelisted_links.some(whiteLink => link.trim() === whiteLink.trim() || link.trim().includes(whiteLink.trim()) )) && !whitelisted_channels.some(id => id === msg.channel.id) && userPerm <= config.linksCheckSettings.bypassPerm){
            await msg.delete()
            return null
        }
    }else {
        if(userPerm > config.linksCheckSettings.bypassPerm) return msg
        let isSafeArray = (await Promise.all(sentence_links.map(link => generalUtils.isLinkSafe(link)))).map(array => {
            let {threat} = array[0]
            return threat ? threat : null
        } )
        if(isSafeArray.some(item=> item != null)){
            msg.delete()
            let threats = []
            sentence_links.forEach(link => {
                if(isSafeArray[sentence_links.indexOf(link)] != null){
                    threats.push(Object.assign({},isSafeArray[sentence_links.indexOf(link)],{link: link}))
                }
            })

            let threatLink = new discord.MessageEmbed()
                .setDescription(`Malicious link deleted in ${msg.channel}\n\n ${threats.map(threat=> `**${threat["link"]}** => \`\`${threat["threatTypes"][0]}\`\`\n`).join("")}`)
                .setAuthor(`${msg.author.tag}`, msg.author.displayAvatarURL())
                .setColor(color)
                .addField("Message By", `${msg.author}`)
                .setTimestamp();
            await logsChannel.send(threatLink)
            return null
        }
    }
    return msg
}