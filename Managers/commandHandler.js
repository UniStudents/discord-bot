const discord = require ('discord.js')
const searchUtils = require('../Utils/searchUtils')

module.exports = {
    run: async (client)=>{
        //todo handle error with error handler
        let files = await searchUtils.searchFiles("../Commands/**").catch(e=>{})
        if(!files) return
        files.forEach(path => {
            if (path.endsWith(".js")){
                let tmpCommand = require(path)
                if(tmpCommand["name"]){
                    client.commands.set(tmpCommand["name"].toLowerCase(),tmpCommand)
                }
            }
        })
    }
}
