import React, { useCallback, useEffect, useRef, useState } from "react"
import { connect } from "react-redux"
import { Link, NavLink, Routes, useParams, useNavigate } from "react-router-dom"
import {Message, ObservableMessage} from "../Message/Message"
import { loadDialogThunkCreator, setCurrentDialogThunkCreator, sendMessageCreator } from "../../redux/dialogsReducer"
import css from "./CurrentDialog.module.css"
import DialogMessages from "./DialogMessages/DialogMessages"
import { Route } from "react-router-dom"

import FindedUsers from '../FindedUsers/FindedUsers'
import { useResizeObserver } from "../../customHooks/useResizeObserver"


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
    else return <div>Загрузка...</div>
}

const mapStateToProps = (state) => {
    return {
        currentDialog: state.dialogs.currentDialog,
        // ВАЖНОЕ
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


    const [memorizedLastReadOrder, setMemorizedLastReadOrder] = useState(props.lastReadOrder)

    const [isScrolled, setIsScrolled] = useState(false)

    const [isMenuRequested, toggleMenuStatus] = useState(false)

    const [prevMessagesWindowHeigth, setPrevMessagesWindowHeigth] = useState(0)

    
    const [input, setInput] = useState({
        message: '',
    })

    const changeHandler = (e) => {
        setInput({message: e.target.value})
    }

    const getMessages = (data, from, to) => {
        const setupMessage = (message, index, messages) => <Message 
                current = {message}
                prev = {messages[index - 1] || {sender: undefined}}
                next = {messages[index + 1] || {sender: undefined}}
                dialogId = {props.dialogId}
                me = {props.me}
                unread = {(index > memorizedLastReadOrder - 1) ? true : false}
            />

        let messages = []
        for (let i = from; i < to; i ++) {
            messages.push(setupMessage(data[i], i, data))
        }

        return messages
    }





    window.onclick = function(event) {
        if (event.target == menuButtonRef.current) toggleMenuStatus(true)
        else toggleMenuStatus(false)
                  
        }
    
    const wrapperRef = useRef()
    const [isViewResized, startObserving] = useResizeObserver(() => {}, document.documentElement)
    useEffect(() => {startObserving()}, [startObserving])

        return  <div ref = {wrapperRef} className = {isViewResized && document.documentElement.clientWidth < 700 ? css.smartphoneInputFocusWrapper : css.wrapper}>
                    <div className = {css.dialogHeaderWrapper}>
                    <div id = {css.backButton} onClick = {() => {navigate(-1)}}>&crarr;</div>
                    {/* {isViewResized ? 'true' : 'false'} */}
                    <div id = {css.interlocutorsTitle}>{props.interlocutors.join(",")}</div>
                        <div className = {css.dropDownContainer}>
                            <div ref = {menuButtonRef} className = {`${css.menuButton} ${isMenuRequested && css.activatedMenuButton}`}>&#9776;</div>
                            {isMenuRequested && <div className = {css.dropDownContent}>
                                <div className = {css.menuItem}><NavLink className = {css.link} to = "addnewuser/">[+] Добавить...</NavLink></div>
                                {/* <div className = {css.menuItem}><Link to = "deleteuser/">[&#65794;] Исключить...</Link></div>
                                <div className = {css.menuItem}>[&#9997;] Покинуть</div>
                                <div className = {css.menuItem}>[&times;] Покинуть</div> */}
                            </div>}
                        </div>
                    </div>
                    {/* <DialogMessages {...props} /> */}
                    <Routes>
                        <Route path = "/" element = {<DialogMessages dialogId = {props.dialogId}/>}/>
                        <Route path = "/addnewuser/" element = {<Searcher dialogId = {props.dialogId} alreadyAdded = {[...props.interlocutors, props.me] } />}/>
                    </Routes>
                
                </div>
            

}

