import React, { useCallback, useEffect, useRef, useState } from "react"
import { connect } from "react-redux"
import { Link, NavLink, Routes, useParams, useNavigate } from "react-router-dom"
import {Message, ObservableMessage} from "../Message/Message"
import { loadDialogThunkCreator, setCurrentDialogThunkCreator, sendMessageCreator } from "../../redux/dialogsReducer"
import css from "./CurrentDialog.module.css"
import { WithObservation } from '../../HOCs/withObservation'
import DialogMessages from "./DialogMessages/DialogMessages"
import { Route } from "react-router-dom"

import FindedUsers from '../FindedUsers/FindedUsers'
import Searcher from "../Searcher/Searcher"
import { useResizeObserver } from "../../customHooks/useResizeObserver"


const CurrentDialogContainer = (props) => {
    const params = useParams()
    

    let idFromProps = props.currentDialog.id
    let dialog = Boolean(props.dialogsMessages[params.dialogId])

    useEffect(() => {props.setCurrentDialog(params.dialogId)}, [idFromProps])
    useEffect(() => {props.loadDialog(params.dialogId)}, [dialog])
    if (Boolean(props.dialogsMessages[params.dialogId])) return <CurrentDialogPresentation
        me = {props.me}
        // dialog = {props.dialogsMessages[params.dialogId]} 
        // lastReadOrder = {(props.lastReadMessages.hasOwnProperty(params.dialogId)) ? props.lastReadMessages[params.dialogId].order: null}
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
        // lastReadMessages: state.dialogs.lastReadMessages
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
    // НУЖНОЕ
    // const toUnreadRef = useRef()
    // const endRef = useRef()
    // const downButtonRef = useRef()
    // const dialogWindowRef = useRef()
    const menuButtonRef = useRef()
    // СКОРЕЕ ВСЕГО НЕВАЖНОЕ
    // useEffect(() => {if (toUnreadRef.current) toUnreadRef.current.scrollIntoView({block: "center", behavior: "smooth"})}, [props.dialog])
    // useEffect(() => {
    //     console.log('---')
    //     console.log()
    //     console.log(dialogWindowRef.current.clientHeight)
    //     console.log(dialogWindowRef.current)
        
    //     // if (dialogWindowRef.current.scrollHeight - dialogWindowRef.current.scrollTop - (dialogWindowRef.current.scrollHeight - (dialogWindowRef.current.scrollTop + dialogWindowRef.current.clientHeight))  === dialogWindowRef.current.clientHeight)
    //     //     endRef.current.scrollIntoView({block: "center", behavior: "smooth"})
    // })


    const [memorizedLastReadOrder, setMemorizedLastReadOrder] = useState(props.lastReadOrder)

    const [isScrolled, setIsScrolled] = useState(false)

    const [isMenuRequested, toggleMenuStatus] = useState(false)

    const [prevMessagesWindowHeigth, setPrevMessagesWindowHeigth] = useState(0)
    // ВАЖНОЕ
    // useEffect(() => {    

        
    //     const observer = new IntersectionObserver(([entry], observer) => {
    //         if (entry.isIntersecting){
    //             entry.target.scrollIntoView({block: "center", behavior: "smooth"})
    //             observer.unobserve(entry.target)
    //         }
    //         else if (props.dialog.length !== props.lastReadOrder && isScrolled /*&& props.dialog[-1].sender !== props.me*/) downButtonRef.current.className = css.downButtonActive
    //     })
    //     observer.observe(endRef.current.previousElementSibling.previousElementSibling)
        
        
    //     if (!isScrolled) {
    //         toUnreadRef.current.className = (props.dialog.length !== memorizedLastReadOrder) ? css.withUnread : css.noUnread
    //         toUnreadRef.current.scrollIntoView({block: "center", behavior: "smooth"})
    //         setInterval( () => {setIsScrolled(true)}, 1000)
    //     }
        

    // },[props.dialog])


    // НЕПОНЯТНО, ВАЖНОЕ ИЛИ НЕТ...
    // useEffect(() => {
    //     setMemorizedLastReadOrder( prev => (typeof(prev) == undefined) ? prev : props.lastReadOrder)
    //     console.log(props.lastReadOrder)
    //     // debugger
    //     // if (memorizedLastReadOrder == null) setMemorizedLastReadOrder(props.lastReadOrder)
    // }, props.lastReadOrder)
    
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

    // ВАЖНОЕ
    // const downButtonHandler = () => {
    //     toUnreadRef.current.scrollIntoView({block: "center", behavior: "smooth"})
    //     downButtonRef.current.className = css.downButtonPassive
    // }



    window.onclick = function(event) {
        if (event.target == menuButtonRef.current) toggleMenuStatus(true)
        else toggleMenuStatus(false)
                  
        }
    
    const wrapperRef = useRef()
    const [isViewResized, startObserving] = useResizeObserver(() => {}, document.documentElement)
    useEffect(() => {startObserving()}, [startObserving])

    // if (Boolean(props.dialog)){
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
                    {/* НУЖНОЕ */}
                    {/* <div ref = {dialogWindowRef} className = {css.messages}>
                        {getMessages(props.dialog, 0, memorizedLastReadOrder)}
                        <div ref = {toUnreadRef} className = {css.noUnread}>Новые сообщения</div>
                        {getMessages(props.dialog, memorizedLastReadOrder, props.dialog.length)}
                        <div ref = {endRef}></div>
                        <div ref = {downButtonRef} className = {css.downButtonPassive} onClick = {downButtonHandler} >[Новое сообщение]</div>    
                        </div>
                    <div><input placeholder = 'Введите сообщение' type = "text" class = "field" name = "email" onChange = {changeHandler}></input></div>
                    <button class = "button" onClick = {() => {props.sendMessage(input.message);toUnreadRef.current.scrollIntoView({block: "center", behavior: "smooth"})}} >Отправить.</button> */}
                
                </div>
            
    // }
    // else{ return <div>Загрузка...</div>}
}

