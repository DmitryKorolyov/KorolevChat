import { authResCreator, messageCreator, findedUsersCreator } from "./dialogsReducer";
import raiseErrorCreator from "./errorReducer"

const WS_CONNECT = 'WS_CONNECT'
const AUTH_RES = 'AUTH_RES'
const FIND_USER = 'FIND_USER'
const FINDED_USERS = 'FINDED_USERS'
const SEND_MESSAGE = 'SEND_MESSAGE'
const SET_CURRENT_DIALOG_WS = 'SET_CURRENT_DIALOG_WS'
const SET_LAST_READ_MESSAGE = 'SET_LAST_READ_MESSAGE'
const CLIENT_READ = 'CLIENT_READ'
const ADD_INTERLOCUTOR = 'ADD_INTERLOCUTOR'
const ADD_INTERLOCUTOR_OK = 'ADD_INTERLOCUTOR_OK'
const DIALOG_START_NOTIFY = 'DIALOG_START_NOTIFY'
const ERROR = 'ERROR'

export const addInterlocutorCreator = (dialogId, userId) => ({type: ADD_INTERLOCUTOR, dialogId, userId})
const outsideDialogAdditionCreator = (interlocutor, dialogId) => ({type: 'OUTSIDE_DIALOG_ADDITION', interlocutor, dialogId})

const WSMiddlewareCreator = () => {
    let socket = null
    
    const onOpen = store => (event) => {
        console.log('websocket open', event.target.url)
        store.dispatch(authResCreator())
    }

    const onClose = store => () => {
      console.log('соединение закрыто')

      }
    
      const onMessage = store => (event) => {
        const payload = JSON.parse(event.data)
    
        switch (payload.type) {
          case 'NEW_MESSAGE':
            console.log(payload)
            store.dispatch(messageCreator(payload))
            break
          case FINDED_USERS:
            console.log(payload.users)
            store.dispatch(findedUsersCreator(payload.users))
            break
          case ADD_INTERLOCUTOR_OK:
            debugger
            store.dispatch({type: "NEW_INTERLOCUTOR", dialogId: payload.dialogId, interlocutor: payload.interlocutor})
            break
          case 'OUTSIDE_DIALOG_ADDITION':
            store.dispatch(outsideDialogAdditionCreator(payload.interlocutor, payload.dialogId))
          case ERROR:
            store.dispatch(raiseErrorCreator(payload.errorInfo))
          default:
            break
        }
      }
    
      return store => next => action => {
        switch (action.type) {
          case WS_CONNECT:
            if (socket !== null) {
              console.log('ЗАХОДИТ')
              socket.close()
            }
    
            socket = new WebSocket('ws://192.168.1.51:9000')
          
            socket.onmessage = onMessage(store)
            socket.onclose = onClose(store)
            socket.onopen = onOpen(store)
            socket.onerror = (e) => {console.log(e)}
            console.log(store.getState())
    
            break
          case 'WS_DISCONNECT':
            if (socket !== null) {
              socket.close()
            }
            socket = null
            console.log('websocket closed')
            break
          case AUTH_RES:
            socket.send(JSON.stringify({type: AUTH_RES, jwtToken: store.getState().auth.jwtToken}))
            break
          case FIND_USER:
            action.user !== '' ? socket.send(JSON.stringify({...action})) : store.dispatch(findedUsersCreator([]))
            break
          case SET_CURRENT_DIALOG_WS:
            socket.send(JSON.stringify({...action}))
            break
            case SEND_MESSAGE:
              console.log(action)
            socket.send(JSON.stringify({...action, date: Date.now()}))
              break
            case SET_LAST_READ_MESSAGE: 
              const state = store.getState()
              if (action.order > state.dialogs.lastReadMessages[action.dialogId].order) {
                console.log('В WS MIDDLEWARE:')
                console.log(action.order)
                store.dispatch({type: CLIENT_READ, order: action.order, messageId: action.messageId, dialogId: action.dialogId})
                socket.send(JSON.stringify({...action}))
              }
              break
            case ADD_INTERLOCUTOR:
              socket.send(JSON.stringify(action))
              break
            case DIALOG_START_NOTIFY:
              socket.send(JSON.stringify(action))
          default:
            console.log('the next action:', action)
            return next(action)
        }
      }
}
    
export default WSMiddlewareCreator()