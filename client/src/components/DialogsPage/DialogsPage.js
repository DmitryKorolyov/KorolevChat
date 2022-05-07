import React from "react";
import { connect } from "react-redux";
import { logoutThunkCreator } from "../../redux/authReducer";
import { messageCreator, connectThunkCreator, findUserCreator, startDialogWithThunkCreator } from "../../redux/dialogsReducer";
import { useState } from "react";
import FindedUsers from "../FindedUsers/FindedUsers";
import DialogsList from "../DialogsList/DialogsList";
import css from './DialogsPage.module.css'
import Title from "../Title/Title";
import withErrorHandler from "../../HOCs/withErrorHandler";

const DialogsPage = (props) => {
    const [input, setInput] = useState({
        request: '',
    })
    const changeHandler = (e) => {
        setInput({request: e.target.value})
        props.findUser(e.target.value)
    }

    let currentComponent
    // input.request.length !== 0 ? currentComponent = <FindedUsers/> : currentComponent = <DialogsList/>
    
    return (
        <div className = {css.container}>
            <header className = {css.header}>
                <div className = {css.titleContainer}>
                    <Title className = {css.title} style = {css.titleSize} />
                </div>
                <div className = {css.buttonContainer}>
                <div className = {css.button} onClick = {() => {props.logout()}} >[выйти]</div>
                </div>
            </header>
            <div className = {css.topBevel}></div>
            <main className = {css.wrapper}>
                <label>&rsaquo;:<input placeholder = 'Поиск пользователя' type = "text" class = "field" name = "nickname" onChange = {changeHandler} className = {css.customInput}></input></label>
                <div className = {css.title}>{input.request.length !== 0 ? 'Найденные пользователи:' : 'Диалоги:'} </div>
                <div className = {css.dialogsWrapper}>{input.request.length !== 0 ? currentComponent = <FindedUsers/> : currentComponent = <DialogsList/>}</div>
            </main>
            <div className = {css.bottomBevel}></div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
            id: state.auth.userId,
            message: state.dialogs,
            findedUsers: state.dialogs.findedUsers,
            dialogs: state.dialogs.dialogs
        }
}

const mapDispatchToProps = (dispatch) => {
    return {
            logout: () => {dispatch(logoutThunkCreator())},
            connect: () => {dispatch(connectThunkCreator())},
            findUser: (nickname) => {dispatch(findUserCreator(nickname))},
            startDialogWith: (id) => {dispatch(startDialogWithThunkCreator(id))},
            sendMessage: (msg) => {dispatch(messageCreator(msg))}
        }
}

export default withErrorHandler(connect(mapStateToProps, mapDispatchToProps)(DialogsPage))