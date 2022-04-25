import React, { useEffect, useState } from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { setCurrentDialogThunkCreator } from '../../redux/dialogsReducer';
import { sendMessageCreator } from '../../redux/dialogsReducer';
import { connect } from 'react-redux';


const CurrentDialog = (props) => {
    const params = useParams()
    useEffect(() => props.setCurrentDialog(params.dialogId), [])

    const [input, setInput] = useState({
        message: '',
    })
    const changeHandler = (e) => {
        setInput({message: e.target.value})

    }
    
    console.log(params)
    return <div>
        <p>Диалог c {props.dialog.interlocutors[0]}</p>
        
        <button class = "button" onClick = {() => {alert('Клик!')}} >Назад...</button>
        {props.dialog.messages.map(message => <div>{message.sender}: {message.text}</div>)}
        <div><input placeholder = 'Введите сообщение' type = "text" class = "field" name = "email" onChange = {changeHandler} ></input></div>
        <button class = "button" onClick = {() => {props.sendMessage(input.message, params.dialogId)}} >Отправить.</button>
        {/* {props.messages} */}
    </div>
}


const mapStateToProps = (state) => {
    return {
        dialog: state.dialogs.currentDialog,
        //messages: state.dialogs.currentDialog.messages
        }
    
}

const mapDispatchToProps = (dispatch) => {
    return {
            setCurrentDialog: (dialogId) => {dispatch(setCurrentDialogThunkCreator(dialogId))},
            sendMessage: (message, dialogId) => {dispatch(sendMessageCreator(message, dialogId))},
        }
}

export default connect(mapStateToProps, mapDispatchToProps)(CurrentDialog)