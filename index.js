const discord = require('discord.js')
const client = new discord.Client()
const {prefix,devToken,token} = require('./Configs/botconfig.json')
const commandHandler = require('./Managers/commandHandler')
const eventHandler = require('./Managers/eventHandler')

const env = process.env.NODE_ENV ? process.env.NODE_ENV.toString().trim() : "development"
const runToken = env === "development" ? devToken : token



//Collections
client.commands = new discord.Collection();
client.events = new discord.Collection();

//Handlers
//todo handle it with error Handler
commandHandler.run(client).catch(e => {console.log(e)});
eventHandler.run(client).catch(e => { console.log(e)});




client.login(runToken).then (() => {
    console.log('Login accepted.')
}).catch(err => {
    console.log(`Error ${err}`)
})