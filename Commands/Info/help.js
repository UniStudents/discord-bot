const discord = require ('discord.js')
const error = require('../../Utils/error')
const utils = require('../../Utils/generalUtils')
const db = require('quick.db');
const emojis = require('../../Configs/emojis.json')
const Pagination = require('../../Utils/ForkedLibrary/index.js')
const {prefix,footerText,footerIcon,color,version} = require('../../Configs/botconfig.json')
const {suggestionChannelId} =  require('../../Managers/configManager')()


module.exports = {
    name: "help",
    description:"Displays all the available commands",
    aliases:["helpCommand"],
    category:"📝 Info",
    usage:`${prefix}help (command)`,
    permission: 1,
    execute: async (bot,message,args) => {
        let specificCommand = null
        if(args.length>1) return  error.send(bot,message.channel,`Too many arguments!\n\n Usage !help (command)`)
        if(args.length === 1){
            specificCommand = args[0].toLowerCase()
            let command = bot.commands.get(specificCommand) || Array.from(bot.commands.values()).find(cmdFile => cmdFile.aliases && cmdFile.aliases.includes(specificCommand))
            if(!command) return  error.send(bot,message.channel,`Command not found!\n\n Usage !help (command)`)
            let cmdInfo = new discord.MessageEmbed()
                .setColor(color)
                .addField(`**Command Name**:`, `\`\`${prefix}${command.name}\`\``,true)
                .addField("**Category**:", `\`\`${command.category}\`\``,true)
                .addField("**Permission**",`\`\`${command.permission}\`\``,true)
                .addField("**Aliases**",`\`\`${command.aliases}\`\``,)
                .addField(`**Command Usage**:`, `\`\`${command.usage}\`\``,)
                .addField("**Description**",`${command.description}`)
                .setTimestamp()
                .setFooter(footerText.replace("%version%",version),footerIcon)
            return await message.channel.send(cmdInfo)
        }
        //Pagination Logic
        let embeds = []
        let commands_sorted = utils.chunk_inefficient_sorted(4,"category",Array.from(bot.commands.values()));
        commands_sorted.forEach(array_commands =>{
             let desc = "**__Commands__**\n" +array_commands.map(command => `\`\`${prefix}${command.name}\`\` - ${command.description}`).join("\n")
            embeds.push(new discord.MessageEmbed().setDescription(desc));
        })
       let embed = new Pagination.Embeds()
            .setArray(embeds)
            .setAuthorizedUsers([message.author.id])
            .setChannel(message.channel)
            .setPage(1)
            .setTimeout(60*1000)
            .setDisabledNavigationEmojis(['all'])
            .addFunctionEmoji(`${emojis["arrowLeft"]}`, (_, instance) => {
                instance.setPage(instance.page >1 ? instance.page-1 : 1)
                instance.setFooter(`Requested by ${message.author.username} | Page ${instance.page} of ${instance.pages}`,message.author.displayAvatarURL())
            })
           .addFunctionEmoji(`${emojis["arrowRight"]}`, (_, instance) => {
               instance.setPage(instance.page <instance.pages ? instance.page+1 : instance.pages)
               instance.setFooter(`Requested by ${message.author.username} | Page ${instance.page} of ${instance.pages}`,message.author.displayAvatarURL())
           })
           .setColor(color)
           .setTimestamp()
           .setFooter(`Requested by ${message.author.username} | Page 1 of ${embeds.length}`,message.author.displayAvatarURL())
           .on('expire', (t,instance) => {
               let msg = instance.clientAssets.message
               let expire = bot.emojis.resolve(emojis["notification"])
               const expired = new discord.MessageEmbed()
                   .setColor(`#00000`)
                   .setFooter(footerText.replace("%version%",version),message.author.displayAvatarURL())
                   .setDescription(`${expire} Help Command **Expired** ${message.author} ${expire}\n\nYou can request a new one\nUsage !help`)
                   .setTimestamp()
               msg.edit(expired).then(message => message.delete({timeout:10*1000}))

           })


        // Methods below are for customising all embeds
        await embed.build();

    }
}