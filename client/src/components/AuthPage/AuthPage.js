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
import { raiseErrorCreator } from '../../redux/errorReducer'

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
                    title = 'ВНИМАНИЕ!'
                    text = 'ДАННЫЙ РЕСУРС РАЗРАБОТАН ИСКЛЮЧИТЕЛЬНО В ОБРАЗОВАТЕЛЬНЫХ ЦЕЛЯХ. РАЗРАБОТЧИК НЕ ГАРАНТИРУЕТ КОНФИДЕНЦИАЛЬНОСТЬ ПРЕДОСТАВЛЯЕМОЙ ИНФОРМАЦИИ И ТАЙНУ ПЕРЕПИСКИ. ВЫ, КАК ПОЛЬЗОВАТЕЛЬ ДАННОГО РЕСУРСА, НЕСЕТЕ ЛИЧНУЮ ОТВЕТСТВЕННОСТЬ ЗА РАЗМЕЩАЕМУЮ НА ДАННОМ РЕСУРСЕ ИНФОРМАЦИЮ. НАЖИМАЯ КНОПКУ "продолжить", ВЫ СОГЛАШАЕТЕСЬ С ИЗЛОЖЕННЫМИ ВЫШЕ УСЛОВИЯМИ, А ТАКЖЕ ПОДТВЕРЖДАЕТЕ, ЧТО ВАМ БОЛЬШЕ ВОСЕМНАДЦАТИ ЛЕТ. В ПРОТИВНОМ СЛУЧАЕ, НЕМЕДЛЕННО ПОКИНЬТЕ СТРАНИЦУ.'
                    buttonLabel = 'продолжить'
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
                        state.authorizeMethod == 'Вход' && props.login(state.nickname, password) /* : props.register(state.nickname, password)*/
                     }}
                />}
                {(state.authorizeMethod == 'Регистрация') && (state.nickname !== '') && (state.password !== '') && <ConsoleInput
                    isPassword = {true}
                    title = "Повторите пароль"
                    enter = {(password) => {
                        state.password == password ? props.register(state.nickname, password) : props.raiseError('Пароли не совпадают')
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
        giveConsent: () => {dispatch(consentCreator())},
        raiseError: (errorInfo) => {dispatch(raiseErrorCreator(errorInfo))}
    }
}

export const AuthPageContainer = withErrorHandler(connect(mapStateToProps, mapDispatchToProps)(AuthPage))
