class ResponseEnvironment {
    constructor(wss, ws){
        this.wss = wss
        this.ws = ws
        this.broadcastConnections = []
    }

    associateConnection = (id) => {
        this.ws.id = id
    }

    getId = () => this.ws.id

    setCurrentDialog = (id) => {
        this.ws.currentDialogId = id
    }

    getCurrentDialog = () => {
        return this.ws.currentDialogId
    }

    enableConnectionForDialogs = (dialogsList) => {
        this.wss.clients.forEach(connection => {
            if (dialogsList.includes(connection.currentDialogId)){
                connection.broadcastConnections.push(this.ws)
            }
        })
    }

    addNewConnectionInBroadcast = (connection) => {this.ws.broadcastConnections.push(connection)}
    
    addNewConnectionInOutsideBroadcasts = (dialog, userId) => {
        let connectionForAdd 
        this.wss.clients.forEach(connection => {if (connection.id == userId) connectionForAdd = connection
        })
        if (connectionForAdd) this.ws.broadcastConnections.forEach(connection => {connection.push(connectionForAdd)})

    }
    
    getUserId = () => {
        return this.ws.id
    }

    setBroadcastConnections = (broadcastIdList) => {
        this.ws.broadcastConnections = []
        this.wss.clients.forEach((connection) => {
            if (broadcastIdList.includes(connection.id)){
                this.ws.broadcastConnections.push(connection)
            }
        })

    }
    send = (data) => {this.ws.send(data)}
    
    sendById = (id, data) => {
        this.wss.clients.forEach(
            (connection) => {
                if (connection.id == id) {
                    connection.send(data)
                }
        })
    }

    multicast = (message) => {
        this.ws.broadcastConnections.forEach(connection => connection.send(message))
    }

}

module.exports = ResponseEnvironment