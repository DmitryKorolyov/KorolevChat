import React from "react";
import { connect } from "react-redux";
import { startDialogWithThunkCreator } from "../../redux/dialogsReducer";
import css from './FindedUsers.module.css'

export const FindedUsers = (props) => {
    return <div>
        <p>Найденные пользователи: </p>
        {props.findedUsers.map(user => <div className = {css.user} onClick = {() => {props.addInDialog(user.id)}}>{user.nickname}</div>)}
    </div>
}

const mapStateToProps = (state) => {
    return {
            findedUsers: state.dialogs.findedUsers
        }
    
}

const mapDispatchToProps = (dispatch) => {
    return {
            addInDialog: (id) => {dispatch(startDialogWithThunkCreator(id))},
        }
}

export default connect(mapStateToProps, mapDispatchToProps)(FindedUsers)