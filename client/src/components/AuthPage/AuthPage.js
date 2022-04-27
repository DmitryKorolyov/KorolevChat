import React, { useReducer } from 'react'
import { useState } from 'react'
import css from './AuthPage.module.css'
import {connect} from 'react-redux'
import { registerThunkCreator, loginThunkCreator } from '../../redux/authReducer'
import { ConsoleInput } from '../ConloseInput/ConsoleInput'
import AuthType from './AuthType/AuthType'
import Title from '../Title/Title'
import Notice from '../Notice/Notice'
import withErrorHandler from '../../HOCs/withErrorHandler'
import {consentCreator} from '../../redux/authReducer'

export const AuthPage = (props) => {
    const initialState = {
        authorizeMethod: '',
        nickname: '',
        password: ''
        
    }
    const reducer = (state, action) => {
        switch (action.type){
            case 'AUTHORIZE_METHOD':
                return {
                    ...state,
                    authorizeMethod: action.method
                }
            case 'NICKNAME':
                return {
                    ...state,
                    nickname: action.nickname
                }
            case 'PASSWORD':
                return {
                    ...state,
                    password: action.password
                }
        }
    }

    const [state, dispatch] = useReducer(reducer, initialState)
    return (
        <div className = {`${css.wrapper} `}>
            <div className = {`${css.glitchText} ${css.KorolevChat}`}>
                <br></br>
                <Title style ={css.titleLine} />
                <br></br>
            </div>
            {props.userId}
            <div>
                {(state.authorizeMethod == '') && (state.nickname == '') && <AuthType enter = {(method) => {dispatch({type: 'AUTHORIZE_METHOD', method})}}/>}
                {(state.authorizeMethod == 'Регистрация')  && (!props.consent) && <Notice
                    title = 'ПРЕДУПРЕЖДЕНИЕ'
                    text = 'В связи с развитием интернета и появлением огромнейшего объёма информации трудно уследить за её правильностью. Поэтому создатели сайтов используют дисклеймеры, чтобы защитить себя от возможных обвинений и претензий со стороны других лиц.Владельцы сайта не несут ответственности за правильность информации, размещённой другими пользователями.А если сайт предназначен только для лиц старше определённого возраста, то дисклеймер будет такой:Внимание! Наполнение сайта предназначено для лиц старше Х лет.'
                    buttonLabel = 'Продолжить'
                    handleClick = {() => {props.giveConsent()}}
                />}
                {(state.authorizeMethod !== '') && (state.nickname == '') && (props.consent || state.authorizeMethod == 'Вход') && <ConsoleInput 
                    title = {state.authorizeMethod == 'Вход' ? "Введите имя пользователя" : "Придумайте имя пользователя учетной записи"}
                    enter = {(nickname) => {dispatch({type:'NICKNAME', nickname})}} 
                />}
                {(state.authorizeMethod !== '') && (state.nickname !== '') && (state.password == '') && (props.consent || state.authorizeMethod == 'Вход') && <ConsoleInput
                    isPassword = {true}
                    title = {state.authorizeMethod == 'Вход' ? "Введите пароль" : "Придумайте пароль пользователя учетной записи"}
                    enter = {(password) => {
                        dispatch({type:'PASSWORD', password})                        
                        state.authorizeMethod == 'Вход' ? props.login(state.nickname, password) : props.register(state.nickname, password) 
                        }} 
                />}

            </div>
        </div>
    )
}

let mapStateToProps = (state) => {
    return {
        token: state.auth.jwtToken,
        userId: state.auth.userId,
        consent: state.auth.consent
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        register: (nickname, password) => {
            dispatch(registerThunkCreator(nickname, password))
        },
        login: (nickname, password) => {
            dispatch(loginThunkCreator(nickname, password))
        },
        giveConsent: () => {dispatch(consentCreator())}
    }
}

export const AuthPageContainer = withErrorHandler(connect(mapStateToProps, mapDispatchToProps)(AuthPage))
