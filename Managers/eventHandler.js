const discord = require ('discord.js')
const searchUtils = require('../Utils/searchUtils')

module.exports = {
    run: async (client)=>{
        //todo handle error with error handler
        let files = await searchUtils.searchFiles("../Events/*").catch(e=>{})
        if(!files) return
        let counter = 0
        console.log("---------Events---------")
        files.forEach(path => {
            let tempEvents = require(path)
            client.events.set(tempEvents['name'],tempEvents)
            tempEvents.execute(client).then(() =>{
                console.log(`[${counter}]: ${tempEvents.name} loaded successfully!`)
                counter++
            }).catch(err => {
                console.log(err)
            })

        })
    }
}
