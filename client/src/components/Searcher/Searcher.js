import React, {useState} from "react"
import {FindedUsers} from "../FindedUsers/FindedUsers"
import { connect } from "react-redux"
import  css from './Searcher.module.css'
import { findUserCreator } from "../../redux/dialogsReducer"
import { addInterlocutorCreator } from "../../redux/WSMiddleware"

const Searcher = (props) => {
    console.log(props.alreadyAdded)
    const [input, setInput] = useState({
        request: '',
    })
    const changeHandler = (e) => {
        setInput({request: e.target.value})
        props.findUser(e.target.value)

    }

    return <div>
        <label>&rsaquo;:<input placeholder = 'Поиск пользователя' type = "text" class = "field" name = "email" onChange = {changeHandler} className = {css.customInput}></input></label>
        <FindedUsers 
            findedUsers = {props.findedUsers.filter(user => (props.alreadyAdded.includes(user.email)) ? false : true)}
            addInDialog = {(userId) => {props.addInDialog(props.dialogId, userId)}}
            />
        
    </div>
}

const mapStateToProps = (state, {alreadyAdded, dialogId}) => {
    return {
        findedUsers: state.dialogs.findedUsers,
        dialogId
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        findUser: (email) => {dispatch(findUserCreator(email))},
        addInDialog: (dialogId, userId) => {dispatch(addInterlocutorCreator(dialogId, userId))}
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Searcher)