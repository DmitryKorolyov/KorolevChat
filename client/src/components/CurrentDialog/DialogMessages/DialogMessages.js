import React, { useReducer } from "react"
import { connect } from "react-redux"
import { useRef, useEffect, useState } from "react"
import css from './DialogMessages.module.css'
import {Message} from "../../Message/Message"
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
    

    // useEffect(() => {if (toUnreadRef.current) toUnreadRef.current.scrollIntoView({block: "center", behavior: "smooth"})}, [/*props.dialog*/])

    // // ЭКСПЕРИМЕНТАЛЬНО
    // useEffect(() => {setMemorizedLastReadOrder(props.lastReadOrder)}, [])

    useEffect(() => {        
        if(props.dialog.length > 1){
            
            const observer = new IntersectionObserver(([entry], observer) => {
                if (entry.isIntersecting){
                    entry.target.scrollIntoView({block: "center", behavior: (document.documentElement.clientWidth < 700) ? "auto" : "smooth"})
                    
                    
                    // observer.unobserve(entry.target)

                }
                
                else if (props.dialog.length !== props.lastReadOrder && isScrolled && downButtonRef.current.className !== css.downButtonActive/*&& props.dialog[-1].sender !== props.me*/) {
                    downButtonRef.current.className = css.downButtonActive
                    // ЭКСПЕРИМЕНТАЛЬНО
                    let forUnreadBtnObserver = new IntersectionObserver(([entry], observer) => {
                        if(entry.isIntersecting){
                            downButtonRef.current.className = css.downButtonPassive
                            observer.unobserve(entry.target)            
                        }
                    })
                    forUnreadBtnObserver.observe(endRef.current)
                    ////////////////////
                    // setMemorizedLastReadOrder(props.lastReadOrder)
                    // ЭКСП
                    setMemorizedLastReadOrder(prev => props.lastReadOrder)
                }
                observer.unobserve(entry.target)
            },
            {
                root: null,
                threshold: 0.1
            }
            )
            // if (props.dialog.length > 1) observer.observe(endRef.current.previousElementSibling.previousElementSibling)
            observer.observe(endRef.current.previousElementSibling.previousElementSibling)
            // if (!isScrolled) {
            if (!isScrolled) {
                toUnreadRef.current.className = (props.dialog.length !== memorizedLastReadOrder && props.dialog.length !== 2) ? css.withUnread : css.noUnread
                toUnreadRef.current.scrollIntoView({block: "center", behavior: "smooth"})
                //ЧТО ТО ОЧЕНЬ ВАЖНОЕ. ПОТОМ РАСКОМЕНТИРОВАТЬ!!!
                setInterval( () => {setIsScrolled(true)}, 1000)
                    
            }
        }
    },[props.dialog])

    // useEffect(() => {
    //     setMemorizedLastReadOrder( prev => (typeof(prev) == undefined) ? prev : props.lastReadOrder)
    //     // debugger
    //     // if (memorizedLastReadOrder == null) setMemorizedLastReadOrder(props.lastReadOrder)
    // }, props.lastReadOrder)

    const getMessages = (data, from, to) => {
        const setupMessage = (message, index, messages) => <Message 
                current = {message}
                prev = {messages[index - 1] || {sender: undefined}}
                next = {messages[index + 1] || {sender: undefined}}
                dialogId = {props.dialogId}
                me = {props.me}
                // unread = {(index > (memorizedLastReadOrder - 1)) ? true : false}
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
    ////////////////////////////////////////////////
    const handler = (event) => {
        if (event.key == 'Enter') {
            event.preventDefault()
            sendMessage()
        }
    }
    // const [isViewResized, setViewSizeStatus] = useState(true)
    // const [firstInputFocus, setFirstInputFocus] = useState(false)

    const [isViewResized, startObserving] = useResizeObserver(() => {toUnreadRef.current.scrollIntoView({block: "center", behavior: "auto"})}, document.documentElement)

    useEffect(() => {
        
        window.addEventListener('keydown', handler)

        startObserving()
        // const resizeObserver = new ResizeObserver(entries => {
        //     setViewSizeStatus(prev => !prev)
        //     toUnreadRef.current.scrollIntoView({block: "center", behavior: "auto"})
        // })
        // resizeObserver.observe(document.documentElement);

}, [startObserving])

    const componentWrapperRef = useRef()

    ////////////////////////////////////////////////
    return <div ref = {componentWrapperRef} className = {(isViewResized && document.documentElement.clientWidth < 700) ? css.smartphoneInputFocus : css.componentWrapper}>
        <div ref = {dialogWindowRef} className = {css.messages}>
            {getMessages(props.dialog, 0, memorizedLastReadOrder)}
            <div ref = {toUnreadRef} className = {css.noUnread}>Новые сообщения</div>
            {getMessages(props.dialog, memorizedLastReadOrder, props.dialog.length)}
            <div ref = {endRef}></div>
            {/* {`${memorizedLastReadOrder} - ${props.dialog.length} - ${props.lastReadOrder}`} */}
            {/* {isViewResized ? 'true' : 'false'} */}
            <div ref = {downButtonRef} className = {css.downButtonPassive} onClick = {downButtonHandler} >[новое сообщение]</div>    
        </div>
        {/* <div><input placeholder = 'Введите сообщение' type = "text" class = "field" name = "email" onChange = {changeHandler}></input></div> */}
        <div id = {css.inputWrapper}>
        <label className = {css.alignTop}>&rsaquo;:</label>
        <textarea 
            ref = {inputRef}
            // onFocus = {() => {setFirstInputFocus(true)}}
            // onBlur = {() => {alert('блюр')}}  
            placeholder = 'Введите сообщение' 
            spellcheck="false" 
            className = {css.textField} 
            name = "email" 
            onChange = {changeHandler}> 
        </textarea>
            {/* {`${memorizedLastReadOrder} - ${props.dialog.length} - ${props.lastReadOrder}`} */}
            <div id = {css.sendButton} onClick = {sendMessage/*toUnreadRef.current.scrollIntoView({block: "center", behavior: "smooth"})*/} >&#187;</div> 
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