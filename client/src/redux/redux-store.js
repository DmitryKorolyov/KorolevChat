import { applyMiddleware, combineReducers, createStore } from 'redux'
import authReducer from './authReducer'
import thunkMiddleware from 'redux-thunk'
import dialogsReducer from './dialogsReducer'
import webSocketMiddleware from './WSMiddleware'
import errorReducer from './errorReducer'

const reducers = combineReducers({
    'auth': authReducer,
    'dialogs': dialogsReducer,
    'error': errorReducer
})

const middleware = [thunkMiddleware, webSocketMiddleware]

const store = createStore(reducers, applyMiddleware(...middleware))

export default store