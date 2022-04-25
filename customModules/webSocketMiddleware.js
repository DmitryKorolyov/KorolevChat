const WSMiddleware = require('./responsibilityChain')

const jwt = require('jsonwebtoken')
const config = require('config')

const User = require('../models/User')
const Dialog = require('../models/Dialog')
const Participant = require('../models/Participant')
const Message = require('../models/Message')

WSMiddleware.useIfType(
    'SEND_MESSAGE',
    async (req, res) => {
        console.log('SEND_MESSAGE-middleware')
        //проверка авторизации
        //console.log({type: 'NEW_MESSAGE', sender: res.getUserId(), text: req.message, date: req.date.toString()})
        const date = req.date.toString()
        console.log('Принято сообщение ' + req.message)
        const message = await new Message({
            roomId: res.getCurrentDialog(),
            userId: res.getUserId(),
            text: req.message,
            date
        })
        await message.save()

        const currentDialog = await Dialog.findById(message.roomId)
        currentDialog.lastMessage = message.id
        currentDialog.save()

        const nickName = await User.findById(res.getUserId()).select('email -_id')
        console.log(nickName)
        console.log({type: 'NEW_MESSAGE', dialogId: res.getCurrentDialog(), payload: {sender: nickName.email, text: req.message, date}})
        res.multicast(JSON.stringify({
            type: 'NEW_MESSAGE', 
            dialogId: res.getCurrentDialog(), 
            payload: {
                sender: nickName.email, 
                text: req.message, 
                date, 
                messageId: message.id}}))
    }
)

WSMiddleware.useIfType(
    'SET_LAST_READ_MESSAGE',
    async (req, res) => {
        participant = await Participant.findOne({$and: [
            {user: res.getUserId()},
            {room: req.dialogId}
        ]})
        participant.lastReadMessage = req.messageId
        await participant.save()
        console.log('последнее прочитанное сохранено' + req.messageId)
    }
)

WSMiddleware.useIfType(
    'SET_CURRENT_DIALOG_WS',
    async (req, res) => {
        const interlocutors = await Participant.find({room: req.id})
        console.log(interlocutors)
        let idList = []
        for (let interlocutorLabel in interlocutors){
            idList.push(interlocutors[interlocutorLabel].user.toString())
        }
        res.setCurrentDialog(req.id)
        res.setBroadcastConnections(idList)




        // res.send(JSON.stringify({type: 'NEW_MESSAGE', message:'Записано в кастомном middleware'}))
    }
)


WSMiddleware.useIfType(
    'FIND_USER',
    async (req, res) => {
        const users = await User.find({email: { $regex: req.user + '.*'}}).limit(10)
        if (users.length > 0){
            res.send(JSON.stringify({
                type: 'FINDED_USERS',
                users: users.map(
                    user => {
                        return {email: user.email, id: user.id}
                    }
                )
            }))
        }
    }
)

WSMiddleware.useIfType(
    'DIALOG_START_NOTIFY',
    async (req, res) => {
        console.log('DIALOG_START_NOTIFy')
        const me = await User.findById(res.getId())
        res.sendById(req.interlocutorId , JSON.stringify({
            type: 'OUTSIDE_DIALOG_ADDITION', 
            dialogId: req.dialogId,
            interlocutor: me.email,
            // time: Date.now().toString()
        }))
    }
)

WSMiddleware.useIfType(
    'ADD_INTERLOCUTOR',
    async (req, res) => {
        const dialog = await Dialog.findById(req.dialogId)
        console.log('КАК ЖЕ Я ЗАЕБАЛСЯ')
        console.log(dialog)

        if (res.getUserId() == dialog.creator){ 
            
            const newParticipant = await new Participant({
                user: req.userId,
                room: req.dialogId
            })
            await newParticipant.save()
            
            const newParticipantData = await User.findById(req.userId)
            dialog.interlocutors.push(newParticipantData.email)
            dialog.save()
            console.log('-=-=-=-=-=-===')
            console.log(dialog.interlocutors)
            res.addNewConnectionInOutsideBroadcasts(req.dialogId, newParticipant.user)
            console.log('ФЛАГ')
            res.multicast(JSON.stringify({type: 'ADD_INTERLOCUTOR_OK', dialogId: req.dialogId, interlocutor: newParticipantData.email}))
        }
        else res.send(JSON.stringify({type: 'ERROR', errorInfo: 'ТОЛЬКО СОЗДАТЕЛЬ БЕСЕДЫ МОЖЕТ ДОБАВЛЯТЬ УЧАСТНИКОВ'}))
    }
)



WSMiddleware.useIfType(
    'AUTH_RES',//ПЕРЕИМЕНОВАТЬ В ИНИЦИАЛИЗАЦИЮ
    async (req, res) => {
        const decrypted = jwt.verify(req.jwtToken, config.get('JWTSecret'))
        res.associateConnection(decrypted.userId)
        //
        let dialogsIdList = []
        const dialogs = await Participant.find({user: decrypted.userId})
        for (dialogLabel in dialogs) {
            dialogsIdList.push(dialogs[dialogLabel].room.toString())
        }
        res.enableConnectionForDialogs(dialogsIdList)
        res.send(JSON.stringify({type: 'NEW_SERVER_MESSAGE', message:'Соединение ассоциировано'}))
    }
)




module.exports = WSMiddleware

