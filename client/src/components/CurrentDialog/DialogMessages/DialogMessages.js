import React from "react"
import { connect } from "react-redux"
import { useRef, useEffect, useState } from "react"
import css from './DialogMessages.module.css'
import {Message} from "./Message/Message"
import { sendMessageCreator } from "../../../redux/dialogsReducer"
import { useResizeObserver } from "../../../customHooks/useResizeObserver"

const DialogMessages = (props) => {
    const inputRef = useRef()
    const toUnreadRef = useRef()
    const endRef = useRef()
    const downButtonRef = useRef()
    const dialogWindowRef = useRef()

    const [memorizedLastReadOrder, setMemorizedLastReadOrder] = useState(props.lastReadOrder)
    const [isScrolled, setIsScrolled] = useState(false)
    

    useEffect(() => {        
        if(props.dialog.length > 1){
            //При получении нового сообщения лента может находиться в двух состояниях:
            //  1). Диалог пролистан книзу, последнее сообщение находится в области видимости, а значит при добовлении в ленту нового сообщения,
            //  ее следует отмотать вниз, чтобы клиент увидел новое сообщение
            //  2). Клиент отмотал диалог к интересующим его сообщениям. В области видимости окна диалога находятся уже прочитанные сообщения,
            //  а не конец диалога. В таком случае следует уведомлять клиента о получении новых сообщений, но не отматывать диалог к ним.
            const observer = new IntersectionObserver(([entry], observer) => {
                if (entry.isIntersecting){
                    //Смартфон не всегда корректно отрабатывает пролистывание со значением "smooth"
                    entry.target.scrollIntoView({block: "center", behavior: (document.documentElement.clientWidth < 700) ? "auto" : "smooth"})
                }
                // В случае если диалог отмотан и приходит новое сообщение, активной становится кнопка, отвечающая за пролистывание к непрочитанным сообщениям
                // Наблюдатель на endRef необходим для обеспечения сокрытия кнопки "[новое сообщение]" в случае пролистывания диалога вниз самим клиентом 
                else if (props.dialog.length !== props.lastReadOrder && isScrolled && downButtonRef.current.className !== css.downButtonActive && props.dialog[-1].sender !== props.me) {
                    downButtonRef.current.className = css.downButtonActive
                    let forUnreadBtnObserver = new IntersectionObserver(([entry], observer) => {
                        if(entry.isIntersecting){
                            downButtonRef.current.className = css.downButtonPassive
                            observer.unobserve(entry.target)            
                        }
                    })
                    forUnreadBtnObserver.observe(endRef.current)
                    setMemorizedLastReadOrder(prev => props.lastReadOrder)
                }
                observer.unobserve(entry.target)
            },
            {
                root: null,
                threshold: 0.1
            }
            )
            // На момент получения нового сообщения последнее сообщение становится предпоследним
            // В таком случае, если оно находится в области видимости, происходит перемотка ленты к новому сообщению
            observer.observe(endRef.current.previousElementSibling.previousElementSibling)
            // Перемотка к непрочитанным сообщениям при открытии диалога
            if (!isScrolled) {
                toUnreadRef.current.className = (props.dialog.length !== memorizedLastReadOrder && props.dialog.length > 3) ? css.withUnread : css.noUnread
                toUnreadRef.current.scrollIntoView({block: "center", behavior: "smooth"})
                setInterval( () => {setIsScrolled(true)}, 1000)
                    
            }
        }
    },[props.dialog])

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

    const downButtonHandler = () => {
        toUnreadRef.current.scrollIntoView({block: "center", behavior: "smooth"})
        downButtonRef.current.className = css.downButtonPassive
    }

    const [input, setInput] = useState({
        message: '',
    })

    const changeHandler = (e) => {
        setInput({message: e.target.value})
    }

    const sendMessage = () => {
        props.sendMessage(inputRef.current.value)
        inputRef.current.value = null
        setInput({message: null})
        inputRef.current.focus()
    }

    const handler = (event) => {
        if (event.key == 'Enter') {
            event.preventDefault()
            sendMessage()
        }
    }

    const [isViewResized, startObserving] = useResizeObserver(() => {toUnreadRef.current.scrollIntoView({block: "center", behavior: "auto"})}, document.documentElement)

    useEffect(() => {
        
        window.addEventListener('keydown', handler)

        startObserving()

    }, [startObserving])

    const componentWrapperRef = useRef()

    return <div ref = {componentWrapperRef} className = {(isViewResized && document.documentElement.clientWidth < 700) ? css.smartphoneInputFocus : css.componentWrapper}>
        <div ref = {dialogWindowRef} className = {css.messages}>
            {getMessages(props.dialog, 0, memorizedLastReadOrder)}
            <div ref = {toUnreadRef} className = {css.noUnread}>Новые сообщения</div>
            {getMessages(props.dialog, memorizedLastReadOrder, props.dialog.length)}
            <div ref = {endRef}></div>
            <div ref = {downButtonRef} className = {css.downButtonPassive} onClick = {downButtonHandler} >[новое сообщение]</div>    
        </div>
        <div id = {css.inputWrapper}>
        <label className = {css.alignTop}>&rsaquo;:</label>
        <textarea 
            ref = {inputRef}
            placeholder = 'Введите сообщение' 
            spellcheck="false" 
            className = {css.textField} 
            name = "nickname" 
            onChange = {changeHandler}> 
        </textarea>
            <div id = {css.sendButton} onClick = {sendMessage} >&#187;</div> 
        </div>
    </div>
}

const mapStateToProps = (state, {dialogId}) => {
    return {
        interlocutors: state.dialogs.interlocutors[dialogId],
        dialog: state.dialogs.dialogsMessages[dialogId],
        lastReadOrder: (state.dialogs.lastReadMessages.hasOwnProperty(dialogId)) ? state.dialogs.lastReadMessages[dialogId].order: null,
        me: state.auth.nickname,
        dialogId
    }
}

const mapDispatchToProps =(dispatch) => {
    return {
        sendMessage: (message, dialogId) => {dispatch(sendMessageCreator(message, dialogId))}
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DialogMessages)