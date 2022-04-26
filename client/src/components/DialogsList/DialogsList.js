import React from "react"
import { connect } from "react-redux"
import { openDialogCreator } from "../../redux/dialogsReducer"
import css from "./DialogsList.module.css"
import { useNavigate } from "react-router-dom"

const DialogsList = (props) => {
    const navigate = useNavigate()
    return <div> 
            {props.dialogs.map(dialog => <div 
                onClick = {() => {navigate(`/dialogs/current/${dialog.id}`)}} 
                className = {`${css.dialog} ${dialog.isNewMessage && css.withNewMessage}`}>{dialog.interlocutors.join(",")}</div>)}
        </div>
}


const mapStateToProps = (state) => {
    return {
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