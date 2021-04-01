const discord = require ('discord.js')
const searchUtils = require('../Utils/searchUtils')

module.exports = {
    run: async (client)=>{
        //todo handle error with error handler
        let files = await searchUtils.searchFiles("../Commands/**").catch(e=>{})
        if(!files) return
        let counter = 1;
        console.log("---------Commands---------")

        files.forEach(path => {
            if (path.endsWith(".js")){
                let tmpCommand = require(path)
                if(tmpCommand["name"]){
                    console.log(`[${counter}]: ${tmpCommand.name} loaded successfully!`)
                    client.commands.set(tmpCommand["name"].toLowerCase(),tmpCommand)
                    counter++
                }
            }
        })
    }
}
