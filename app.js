const express = require('express')
const config = require('config')
const mongoose = require('mongoose')
const WebSocketServer = require('ws').Server
const WSMiddleware = require('./customModules/WebSocket/webSocketMiddleware')
const WSResponse = require('./customModules/WebSocket/ResponseEnvironment')

wss = new WebSocketServer({port: 9000})
const PORT = config.get('port') || 5000
const app = express()

app.use(require('cors')())
app.use(require('helmet')())

app.use("/api/auth", require('./routes/auth.routes'))
app.use("/api/dialogs", require('./routes/dialogs.routes'))


async function start(){
    try {
        await mongoose.connect(config.get('localMongoURI'), {
            useNewUrlParser : true,
            useUnifiedTopology : true
        })
        .then(console.log('MongoDB has started ...'))
        .catch((e) => console.log(e));
        app.listen(PORT, () => console.log(`App has been started on port ${PORT}`))
        
        wss.on('connection', function(ws) {
            const responseObject = new WSResponse(wss, ws)
            ws.on('message', function(request) {
                WSMiddleware.pass(JSON.parse(request), responseObject)

            })
        })
    }
    catch (e){
        console.log('Server Error', e.message)
    }
}

start()
