const discord = require('discord.js')
const client = new discord.Client()
const {prefix,token} = require('./Configs/botconfig.json')
const commandHandler = require('./Managers/commandHandler')
const eventHandler = require('./Managers/eventHandler')


//Collections
client.commands = new discord.Collection();
client.events = new discord.Collection();

//Handlers
//todo handle it with error Handler
commandHandler.run(client).catch(e => {});
eventHandler.run(client).catch(e => { console.log(e)});



client.login(token).then (() => {
    console.log('Login accepted.')
}).catch(err => {
    console.log(`Error ${err}`)
})