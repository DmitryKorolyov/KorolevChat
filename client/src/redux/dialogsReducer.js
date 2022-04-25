import {dialogsAPI} from '../DAL/dialogsAPI'

const WS_CONNECT = 'WS_CONNECT'
const NEW_MESSAGE = 'NEW_MESSAGE'
const AUTH_RES = 'AUTH_RES'
const FIND_USER = 'FIND_USER'
const FINDED_USERS = 'FINDED_USERS'
const START_DIALOG_WITH = 'START_DIALOG_WITH'
const CREATED_DIALOG = 'CREATED_DIALOG'
const LOADED_DIALOGS = 'LOADED_DIALOGS'
const SEND_MESSAGE = 'SEND_MESSAGE'
const OPEN_DIALOG = 'OPEN_DIALOG'
const SET_CURRENT_DIALOG = 'SET_CURRENT_DIALOG'
const LOADED_DIALOG = 'LOADED_DIALOG'
const SET_CURRENT_DIALOG_WS = 'SET_CURRENT_DIALOG_WS'
const SET_LAST_READ_MESSAGE = 'SET_LAST_READ_MESSAGE'
const CLIENT_READ = 'CLIENT_READ'
const NEW_INTERLOCUTOR = 'NEW_INTERLOCUTOR'
const DIALOG_START_NOTIFY = 'DIALOG_START_NOTIFY'

const authStorageName = 'authLocalStore'

let initialState = {
    isConnected: false,
    findedUsers: [{
        email: '',
        id: ''}],
    dialogsList: [{
        id: '',
        interlocutors: []
        }],
    dialogsMessages: {},
    interlocutors:  {},
    currentDialog: {
        id: '',
        interlocutors: [],
        // messages: [{
        //     sender: '',
        //     text: '',
        //     date: ''
        // }],
    },
    messages: [{
        senderName: '',
        senderId: '',
        dialogId: '',
        messageId: '',
        text: '',
        order: '',
        id: 1
    }],
    lastReadMessages: {},
    lastReceivedMessages: {}
}

const dialogsReducer = (state = initialState, action) => {
    switch (action.type){
        case NEW_MESSAGE: {
            action.payload.order = state.dialogsMessages[action.dialogId].length + 1

            return {
                ...state,
                dialogsMessages: {
                    ...state.dialogsMessages,
                    [action.dialogId]: [
                        ...state.dialogsMessages[action.dialogId],
                        action.payload, 
                        
                    ]
                }
            }
        // return {
        //     ...state,
        //     currentDialog:{
        //         ...state.currentDialog,
        //         messages: [
        //             ...state.currentDialog.messages,
        //             {
        //                 sender: action.sender,
        //                 text: action.text,
        //                 date: action.date
        //             }
        //         ]
        //     }
        //                     }
        
        }
        case CLIENT_READ:
            return {
                ...state,
                lastReadMessages: {
                    ...state.lastReadMessages,
                    [action.dialogId]: {
                        messageId: action.messageId,
                        order: action.order
                    }
            }
            }
        case FINDED_USERS:
            return {
                ...state,
                findedUsers: [...action.users]
            }
            case CREATED_DIALOG:
            return {
                ...state,
                dialogsList: [...state.dialogsList, action.dialog]
            }
            case LOADED_DIALOGS:
                return {
                    ...state,
                    dialogsList: action.dialogs
                }
            //case SET_CURRENT_DIALOG:
            case LOADED_DIALOG:
                return{
                    ...state,
                    interlocutors: {
                        ...state.interlocutors,
                        [action.id]: action.interlocutors
                    },
                    dialogsMessages: {
                        ...state.dialogsMessages,
                        [action.id]: action.messages
                    },
                    lastReadMessages: {
                        ...state.lastReadMessages,
                        [action.id]: action.lastRead
                        
                    }
                }
            case NEW_INTERLOCUTOR:
                debugger
            return{
                ...state,
                interlocutors:{
                    ...state.interlocutors,
                    [action.dialogId]: [...state.interlocutors[action.dialogId], action.interlocutor]
                },
                currentDialog: {
                    ...state.currentDialog,
                    interlocutors: [...state.currentDialog.interlocutors, action.interlocutor],
                },
            }
            case 'OUTSIDE_DIALOG_ADDITION':
                return {
                    ...state,
                    dialogsList: [
                        {
                            id: action.dialogId,
                            interlocutors: [action.interlocutor],
                            isNewMessage: false
                        },
                        ...state.dialogsList
                    ]
                }
        default:
            return {...state}
    }
} 

export default dialogsReducer;


// export const conncetionStatusCreator = () => ({type: SET_CO})

export const WSConnectCreator = () => ({type: WS_CONNECT})

export const messageCreator = (message) => ({...message, type: NEW_MESSAGE})

export const authResCreator = (message) => ({type: AUTH_RES})

export const findUserCreator = (user) => ({user, type: FIND_USER})

export const findedUsersCreator = (users) => ({users, type: FINDED_USERS})

export  const addDialogsCreator = (dialogs) => ({dialogs, type: LOADED_DIALOGS})

export const addCreatedDialogCreator = (dialog) => ({dialog, type: CREATED_DIALOG})

export const openDialogCreator = (dialogId) => ({dialogId, type: OPEN_DIALOG})

//export const setCurrentDialogCreator = (currentDialog) => ({...currentDialog, type: SET_CURRENT_DIALOG})
export const setLoadedDialogCreator = (dialog) => ({...dialog, type: LOADED_DIALOG})

export const setCurrentDialogCreator = (id) => ({id, type: SET_CURRENT_DIALOG_WS})

export const sendMessageCreator = (message, dialogId) => ({message, dialogId, type: SEND_MESSAGE})

export const setLastReadCreator = (order, messageId, dialogId) => ({order, messageId, dialogId, type: SET_LAST_READ_MESSAGE})

export const dialogStartNotifyCreator = (interlocutorId, dialogId) => ({type: DIALOG_START_NOTIFY, interlocutorId, dialogId})






export const connectThunkCreator = () => async (dispatch) => {
    dispatch(WSConnectCreator())
    const authStorage = JSON.parse(localStorage.getItem(authStorageName))
    const dialogs = await dialogsAPI.receiveDialogs(authStorage.jwtToken)
    dispatch(addDialogsCreator(dialogs))

}

export const startDialogWithThunkCreator = (id) => async (dispatch) => {
    const authStorage = JSON.parse(localStorage.getItem(authStorageName))
    const newDialog = await dialogsAPI.createDialog(id, authStorage.jwtToken)
    dispatch(addCreatedDialogCreator(newDialog))
    dispatch(dialogStartNotifyCreator(id, newDialog.id))
}

export const loadDialogThunkCreator = (id) => async (dispatch) => {
    const authStorage = JSON.parse(localStorage.getItem(authStorageName))
    const currentDialog = await dialogsAPI.receiveDialogMessages(id, authStorage.jwtToken)

    dispatch(setLoadedDialogCreator(currentDialog))
    //dispatch(setCurrentDialogCreatorWS(currentDialog))
}

export const setCurrentDialogThunkCreator = (id) => (dispatch) => {
    dispatch(setCurrentDialogCreator(id))
    //dispatch(currentDialogIdCreator(id))
}


