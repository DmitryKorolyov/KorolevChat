const express = require('express')
const config = require('config')
const mongoose = require('mongoose')
const WebSocketServer = require('ws').Server
const WSMiddleware = require('./customModules/webSocketMiddleware')


wss = new WebSocketServer({port: 9000})


const PORT = config.get('port') || 5000

const app = express()

app.use(require('cors')())
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

// var allowCrossDomain = function(req, res, next) {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Methods', 'GET, POST');
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
//     next();

//     // intercept OPTIONS method
//     if ('OPTIONS' == req.method) {
//         res.send(200);
//     } else {
//         next();
//     }
// };
// app.use(allowCrossDomain);

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
            console.log('ПОДКЛЮЧЕНИЕ!!!')
            let responseObject = {
                WSServer: wss,
                connection: ws,
                broadcastConnections: [],
                associateConnection: (id) => {
                    ws.id = id
                },
                getId: () => ws.id,
                setCurrentDialog: (id) => {
                    ws.currentDialogId = id
                },
                getCurrentDialog: () => {
                    return ws.currentDialogId
                },
                enableConnectionForDialogs: (dialogsList) => {
                    wss.clients.forEach(connection => {
                        // console.log('===')
                        // console.log(connection)
                        if (dialogsList.includes(connection.currentDialogId)){
                            console.log('+++')
                            connection.broadcastConnections.push(ws)
                        }
                    })
                },
                addNewConnectionInBroadcast:(connection) => {ws.broadcastConnections.push(connection)},
                // ЭКСПЕРИМЕНТАЛЬНО //
                addNewConnectionInOutsideBroadcasts: (dialog, userId) => {

                    let connectionForAdd 
                    wss.clients.forEach(connection => {if (connection.id == userId) connectionForAdd = connection
                    })

                    if (connectionForAdd) ws.broadcastConnections.forEach(connection => {connection.push(connectionForAdd)})
                    // wss.clients.forEach((connection) => {
                    //     if (connection.currentDialogId == dialog) connection.broadcastConnections.push(connectionForAdd)
                    // })
                },
                //////////////////////
                getUserId: () => {
                    return ws.id
                },
                setBroadcastConnections: (broadcastIdList) => {
                    ws.broadcastConnections = []
                    wss.clients.forEach((connection) => {
                        if (broadcastIdList.includes(connection.id)){
                            ws.broadcastConnections.push(connection)
                        }
                    })
                    // console.log('broadcastConnections:')
                    // console.log(ws.broadcastConnections)
                },
                send: (data) => {ws.send(data)},
                sendById: (id, data) => {
                    wss.clients.forEach(
                        (connection) => {
                            if (connection.id == id) {
                                connection.send(data)
                            }
                    })
                },
                multicast: (message) => {
                    ws.broadcastConnections.forEach(connection => connection.send(message))
                }
            }
            ws.on('message', function(request) {
                WSMiddleware.pass(JSON.parse(request), responseObject)
                // wss.clients.forEach(client => {
                //     client.send(JSON.stringify({
                //         senderName: 'Тестовое имя',
                //         senderId: 'Тестовый ID',
                //         text: 'Если ты читаешь этот текст, то все работает...',
                //         type: 'MESSAGE'
                //     }))
                // });
            })
        })
    }
    catch (e){
        console.log('Server Error', e.message)
    }
}

start()
