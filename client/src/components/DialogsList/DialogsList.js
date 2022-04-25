import React from "react"
import { connect } from "react-redux"
import { NavLink } from "react-router-dom"
import { openDialogCreator } from "../../redux/dialogsReducer"
import css from "./DialogsList.module.css"
import { useNavigate } from "react-router-dom"

const DialogsList = (props) => {
    
    const navigate = useNavigate()
    
    
    return <div> 
            {/* <p className = {css.title}>Диалоги: </p> */}
            {/* {props.dialogs.map(dialog => <NavLink to = {'/dialogs/current/' + dialog.id} ><div className = {css.dialog}>{ dialog.interlocutors.join(",")}</div></NavLink>)} */}
            {props.dialogs.map(dialog => <div 
                onClick = {() => {navigate(`/dialogs/current/${dialog.id}`)}} 
                // className = {`${css.dialog} ${dialog.isNewMessage && css.withNewMessage}`}>{ (dialog.interlocutors.join(",").length > 44) ? `${dialog.interlocutors.join(",").slice(0, 44)}...` : dialog.interlocutors.join(",")}</div>)}
                className = {`${css.dialog} ${dialog.isNewMessage && css.withNewMessage}`}>{dialog.interlocutors.join(",")}</div>)}
        </div>
}


const mapStateToProps = (state) => {
    return {
        // lastReadMessages: state.dialogs.lastReadMessages,
        dialogs: state.dialogs.dialogsList.map(dialog => ({
            ...dialog,
            isNewMessage: state.dialogs.lastReadMessages[dialog.id]
            ? (state.dialogs.lastReadMessages[dialog.id].order !== state.dialogs.dialogsMessages[dialog.id].length)
            : dialog.isNewMessage
            })
        ),
        
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
            openDialog: (id) => {dispatch(openDialogCreator(id))},
        }
}

export default connect(mapStateToProps, mapDispatchToProps)(DialogsList)