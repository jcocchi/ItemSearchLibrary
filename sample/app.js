const builder = require('botbuilder')
const restify = require('restify')
const itemSearchLib = require('../code/lib/index')
const searchFunc = require('./searchFunction')
const searchParams = require('./searchParameters')

// Set up bot
const connector = new builder.ChatConnector()
const bot = new builder.UniversalBot(connector)

// Set up restify
const server = restify.createServer()
const port = process.env.PORT || 3978
server.listen(port, () => {
  console.log(`restify listening on port ${port}`)
})
server.post('/api/messages', connector.listen())

// Set up item search library
const options = {
  searchParameters: searchParams,
  searchFunction: searchFunc
}
bot.library(itemSearchLib.createLibrary(options))

// Create dialog flow
bot.dialog('/', [
  (session, result, next) => {
    session.send('Hi! Welcome to the ice cream bot. I can help you search for the perfect summer treat!')

    itemSearchLib.itemSearchDialog(session)
  },
  (session, args, next) => {
    session.endDialog('Goodbye')
  }
])
