import {authorizeAPI} from '../DAL/authAPI'
import {raiseErrorCreator} from './errorReducer'

const AUTHORIZE = 'AUTHORIZE'
const LOADING_STATUS_CHANGING = 'LOADING_STATUS_CHANGING'
const AUTH_STATUS = 'AUTH_STATUS'
const CONSENT_GIVEN = 'CONSENT_GIVEN'

const authStorageName = 'authLocalStore'

let initialState = {
    isAuthenticated: false,
    jwtToken: '',
    userId: '',
    loading: false,
    nickname: '',
    consent: false
}

const authReducer = (state = initialState, action) => {
    switch (action.type){
        case AUTHORIZE: {
        let stateCopy = {...state,
                            jwtToken: action.token,
                            userId: action.userId,
                            nickname: action.nickname
                        };
        return stateCopy
        }
        case LOADING_STATUS_CHANGING: {
            return {...state, loading: action.status}
        }
        case AUTH_STATUS:
            return {...state, isAuthenticated: action.status}
        case CONSENT_GIVEN:
            return {
                ...state,
                consent: true
            }
        default:
            return {...state}
    }
} 

export default authReducer

export const authDataCreator = (token, userId, nickname) => ({type: AUTHORIZE, token, userId, nickname})

export const loadingStatusCreator = (status) => ({type: LOADING_STATUS_CHANGING, status})

export const authStatusCreator = (status) => ({type: AUTH_STATUS, status})

export const consentCreator = () => ({type: CONSENT_GIVEN})


export const registerThunkCreator = (nickname, password) => {
    return async (dispatch) => {
        const data = await authorizeAPI.register(nickname, password)
        if (data.type == 'ERROR'){
            return dispatch(raiseErrorCreator(data.errorInfo))
        }
        dispatch(authDataCreator(data.token, data.userId, data.nickname))
        dispatch(authStatusCreator(true))
        localStorage.setItem(authStorageName, JSON.stringify({
            userId: data.userId,
            jwtToken: data.token,
            nickname: data.nickname
        }))
        
    }
}

export const loginThunkCreator = (nickname, password) => {
    return async (dispatch) => {
        const data = await authorizeAPI.login(nickname, password)
        if (data.type == 'ERROR'){
            return dispatch(raiseErrorCreator(data.errorInfo))
        }
        
        dispatch(authDataCreator(data.token, data.userId, data.nickname))
        dispatch(authStatusCreator(true))
        localStorage.setItem(authStorageName, JSON.stringify({
            userId: data.userId,
            jwtToken: data.token,
            nickname: data.nickname
        }))
    }
}

export const logoutThunkCreator = () => {
    return async (dispatch) => {
        dispatch(authStatusCreator(false))
        dispatch(authDataCreator(null, null))
        localStorage.removeItem(authStorageName)
    }
}

export const initializeAppThunkCreator = () => {
    return async (dispatch) => {
        dispatch(loadingStatusCreator(true))
        const data = JSON.parse(localStorage.getItem(authStorageName))
        if (data && data.jwtToken) {
            dispatch(authDataCreator(data.jwtToken, data.userId, data.nickname))
            dispatch(authStatusCreator(true))
        }
        else{
            dispatch(authStatusCreator(false))
        }
        dispatch(loadingStatusCreator(false))
    }
}

