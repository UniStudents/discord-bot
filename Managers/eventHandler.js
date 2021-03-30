const discord = require ('discord.js')
const searchUtils = require('../Utils/searchUtils')

module.exports = {
    run: async (client)=>{
        //todo handle error with error handler
        let files = await searchUtils.searchFiles("../Events/*").catch(e=>{})
        if(!files) return
        files.forEach(path => {
            let tempEvents = require(path)
            client.events.set(tempEvents['name'],tempEvents)
            tempEvents.execute(client).catch(err => {
                console.log(err)
            })
        })
    }
}
