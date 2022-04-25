import React, {useRef} from "react";
import { connect } from "react-redux";
import { logoutThunkCreator } from "../../redux/authReducer";
import { messageCreator, connectThunkCreator, findUserCreator, startDialogWithThunkCreator } from "../../redux/dialogsReducer";
import { useEffect, useState } from "react";
import FindedUsers from "../FindedUsers/FindedUsers";
import DialogsList from "../DialogsList/DialogsList";
import css from './DialogsPage.module.css'
import Title from "../Title/Title";

const DialogsPage = (props) => {

    const [input, setInput] = useState({
        request: '',
    })
    
    const changeHandler = (e) => {
        setInput({request: e.target.value})
        props.findUser(e.target.value)
    }

    let currentComponent
    input.request.length != 0 ? currentComponent = <FindedUsers/> : currentComponent = <DialogsList/>




    return (
        <div>
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
                <label>&rsaquo;:<input placeholder = 'Поиск пользователя' type = "text" class = "field" name = "email" onChange = {changeHandler} className = {css.customInput}></input></label>
                <div className = {css.title}>Диалоги: </div>
                <div className = {css.dialogsWrapper}>{currentComponent}</div>
                {/* {props.findedUsers.map(user => <div onClick = {() => {props.startDialogWith(user.id)}}>{user.email}</div>)}
                
                <p>Диалоги:</p>
                {props.dialogs.map(dialog => <div>{dialog.interlocutors[0]}</div>)}
                <button class = "button" onClick = {() => {props.sendMessage('Пока фиксированное сообщение')}} >Отправить сообщение</button> */}
                
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
            findUser: (email) => {dispatch(findUserCreator(email))},
            startDialogWith: (id) => {dispatch(startDialogWithThunkCreator(id))},
            sendMessage: (msg) => {dispatch(messageCreator(msg))}
        }
}

export default connect(mapStateToProps, mapDispatchToProps)(DialogsPage)