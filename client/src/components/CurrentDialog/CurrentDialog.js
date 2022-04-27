import React, { useEffect, useRef, useState } from "react"
import { connect } from "react-redux"
import { NavLink, Routes, useParams, useNavigate } from "react-router-dom"
import {Message} from "./DialogMessages/Message/Message"
import { loadDialogThunkCreator, setCurrentDialogThunkCreator, sendMessageCreator } from "../../redux/dialogsReducer"
import css from "./CurrentDialog.module.css"
import DialogMessages from "./DialogMessages/DialogMessages"
import { Route } from "react-router-dom"
import { useResizeObserver } from "../../customHooks/useResizeObserver"
import Searcher from "../Searcher/Searcher"
import { Preloader } from "../Preloader/Preloader"

const CurrentDialogContainer = (props) => {
    const params = useParams()
    let idFromProps = props.currentDialog.id
    let dialog = Boolean(props.dialogsMessages[params.dialogId])

    useEffect(() => {props.setCurrentDialog(params.dialogId)}, [idFromProps])

    useEffect(() => {props.loadDialog(params.dialogId)}, [dialog])

    if (Boolean(props.dialogsMessages[params.dialogId])) return <CurrentDialogPresentation
        me = {props.me}
        dialogId = {params.dialogId}
        interlocutors = {props.interlocutors[params.dialogId]} 
        sendMessage = {(message) => {props.sendMessage(message, params.dialogId)}}
    />
    else return <Preloader/>
}

const mapStateToProps = (state) => {
    return {
        currentDialog: state.dialogs.currentDialog,
        interlocutors: state.dialogs.interlocutors,
        dialogsMessages: state.dialogs.dialogsMessages,
        me: state.auth.nickname,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setCurrentDialog: (dialogId) => {dispatch(setCurrentDialogThunkCreator(dialogId))},
        loadDialog: (dialogId) => {dispatch(loadDialogThunkCreator(dialogId))},
        sendMessage: (message, dialogId) => {dispatch(sendMessageCreator(message, dialogId))}
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CurrentDialogContainer)


const CurrentDialogPresentation = (props) => {
    const navigate = useNavigate()
    const menuButtonRef = useRef()
    const [isMenuRequested, toggleMenuStatus] = useState(false)
    const wrapperRef = useRef()
    const [isViewResized, startObserving] = useResizeObserver(() => {}, document.documentElement)

    window.onclick = function(event) {
        if (event.target == menuButtonRef.current) toggleMenuStatus(true)
        else toggleMenuStatus(false)       
    }

    useEffect(() => {startObserving()}, [startObserving])

        return  <div ref = {wrapperRef} className = {isViewResized && document.documentElement.clientWidth < 700 ? css.smartphoneInputFocusWrapper : css.wrapper}>
                    <div className = {css.dialogHeaderWrapper}>
                    <div id = {css.backButton} onClick = {() => {navigate(-1)}}>&crarr;</div>
                    <div id = {css.interlocutorsTitle}>{props.interlocutors.join(",")}</div>
                        <div className = {css.dropDownContainer}>
                            <div ref = {menuButtonRef} className = {`${css.menuButton} ${isMenuRequested && css.activatedMenuButton}`}>&#9776;</div>
                            {isMenuRequested && <div className = {css.dropDownContent}>
                                <div className = {css.menuItem}><NavLink className = {css.link} to = "addnewuser/">[+] Добавить...</NavLink></div>
                            </div>}
                        </div>
                    </div>
                    <Routes>
                        <Route path = "/" element = {<DialogMessages dialogId = {props.dialogId}/>}/>
                        <Route path = "/addnewuser/" element = {<Searcher dialogId = {props.dialogId} alreadyAdded = {[...props.interlocutors, props.me] } />}/>
                    </Routes>
                </div>
}

