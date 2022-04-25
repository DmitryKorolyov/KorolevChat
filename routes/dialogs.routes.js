const {Router} = require('express')
const Room = require('../models/Room')
const Dialog = require('../models/Dialog')
const Message = require('../models/Message')
const Participant = require ('../models/Participant')
const User = require('../models/User')
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const auth = require('../customModules/auth.middleware')

router = new Router()

router.post(
    '/create',
    jsonParser,
    auth,
    async (req, res) => {
        try {
            const dialogCreator = await User.findById(req.user.userId)
            const interlocutor = await User.findById(req.body.id)
            
            const possiblyExisting = await Dialog.findOne({ interlocutors: [dialogCreator.email, interlocutor.email] })
            console.log(possiblyExisting)
            if (possiblyExisting){
                res.status(400).json({message: 'Такой диалог уже существует!'})
            }
            else {
                const dialog = await new Dialog({
                     interlocutors: [dialogCreator.email, interlocutor.email],
                    createTime: Date.now(),
                    creator: req.user.userId
                    })

                const creatorParticipant = await new Participant({
                    user: dialogCreator.id,
                    room: dialog.id,
                    // lastReadMessage: ""
                }) 
                
                console.log('interlocutorId: ' + req.body.id)
                
                

                const interlocutorParticiant = await new Participant({
                    user: interlocutor.id,
                    room: dialog.id,
                    // lastReadMessage: ""
                }) 

                await dialog.save()
                await creatorParticipant.save()
                await interlocutorParticiant.save()
                
                console.log('interlocutor:')
                console.log(interlocutor)
                // res.json({id: dialog.id, interlocutors: [interlocutor.email]})
                res.json({
                    id: dialog.id,
                    interlocutors: dialog.interlocutors.filter(interlocutor => interlocutor != dialogCreator.email)})

            }
        }
        catch(e) {
            // await Dialog.collection.drop()
            // await Participant.collection.drop()
            // await User.collection.drop()
            // await Message.collection.drop()
            res.status(500).json({message: e.message})
            console.log(`Ошибка ${e}`)
        }
    }

)

router.get(
    '/',
    auth,
    async (req, res) => {
        try{
            
            const user = await User.findById(req.user.userId).select('email -_id')
            
            const dialogs = await Participant.find({user: req.user.userId}).select('room -_id')
            
            const idList = dialogs.map(record => record.room)
            
            const responseDialogs = await Promise.all(idList.map(
                async (dialogId) => {
                    const currentDialog = await Dialog.findById(dialogId).select("interlocutors createTime id")
                    const currentParticipant = await Participant.findOne({$and: [
                        {user: req.user.userId},
                        {room: dialogId}
                    ]})
                    const messages = await Message.find({roomId: dialogId})
                    
                    const messageIDs = messages.map(record => record.id)
                    
                    let lastMessageOrder
                    let lastMessageDate
                                        
                    if (currentParticipant.lastReadMessage){
                        lastMessageOrder = messageIDs.indexOf(currentParticipant.lastReadMessage.toString()) + 1
                        lastMessageWithDate = await Message.findById(currentParticipant.lastReadMessage).select('date -_id')
                    }
                    else {
                        
                        lastMessageOrder = 0
                        lastMessageWithDate = {date: currentDialog.createTime}
                    }
                    
                    // console.log(lastMessageWithDate)
                    // console.log(lastMessageOrder)
                    
                    // currentDialog.interlocutors.splice(currentDialog.interlocutors.indexOf(user.email), 1)
                    return {
                        id: currentDialog.id,
                        interlocutors: currentDialog.interlocutors.filter(interlocutor => interlocutor != user.email), 
                        lastMessage: currentDialog.lastMessage,
                        lastMessageDate: Number(lastMessageWithDate.date),
                        isNewMessage: lastMessageOrder !== messageIDs.length}
                }
            ))
                // )).then(dialogs => res.json(dialogs))
            // console.log(responseDialogs)
            responseDialogs.sort((prev, next) => next.lastMessageDate - prev.lastMessageDate)
            console.log(responseDialogs)
            res.json(responseDialogs)
        }
        catch(e){

        }
    }
)

router.get(
    '/messages',
    jsonParser,
    auth,
    async (req, res) => {
        try {
            const included = await Participant.findOne({$and: [
                {user: req.user.userId},
                {room: req.query.id}
            ]})
            if (!included) {
                res.status(400).json({message: 'Вы не являетесь участником данной беседы!'})
            }

            const messageObjects = await Message.find({roomId: req.query.id})

            // console.log('messageObjects')
            
            // console.log(messageObjects)
            
            const participants = await Participant.find({room: req.query.id})
            // console.log('================')
            // console.log(participants)
            // console.log('================')
            let nicknames = {}

            for (let participant in participants){
                let user = await User.findById(participants[participant].user)
                nicknames[user.id] = user.email
            }
            let interlocutors = []
            for (let nickname in nicknames){
                if (nickname != req.user.userId)
                interlocutors.push(nicknames[nickname])
            }

            let order
            if (included.lastReadMessage){
                const lastReadMessage =  await Message.findById(included.lastReadMessage)
                const messagesIdList = messageObjects.map( msg => msg.id)
            // ЭКСПЕРИМЕНТАЛЬНО
                order = messagesIdList.indexOf(lastReadMessage.id) + 1
                }
            else order = 0

            //     // РАБОЧАЯ ВЕРСИЯ
            //         if (messagesIdList.indexOf(lastReadMessage.id) !== -1) {
            //         order = messagesIdList.indexOf(lastReadMessage.id) + 1
            //     }
            //     else order = 0
            // }
            // else order = 0



            
            console.log("lastRead - " + included)
            res.json({
                id: req.query.id,
                interlocutors,
                messages: messageObjects.map((message, i) => {
                    return{
                        text: message.text, 
                        date: message.date, 
                        sender: nicknames[message.userId],
                        messageId: message.id,
                        order: i + 1, 
                    }
                }),
                lastRead: {
                    messageId:included.lastReadMessage,
                    order  
                }
            })
            // const messages = messageObjects.map(msgObj => {})
            // res.json({messages})
        }
        catch(e) {
            // await Dialog.collection.drop()
            // await Participant.collection.drop()
            //res.status(500).json({message: e.message})
            console.log(`!!! ОШИБОЧКА !!! ${e}`)
        }
    }

)


module.exports = router