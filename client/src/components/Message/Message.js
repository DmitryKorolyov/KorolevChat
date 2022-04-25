import React, { useEffect, useState, useRef } from 'react'
import { connect } from "react-redux"
import { useParams } from 'react-router-dom'
import { WithObservation } from '../../HOCs/withObservation'
import { setLastReadCreator } from '../../redux/dialogsReducer'
import css from './Message.module.css'


const PresentationalMessage = ({current, prev, next, me}) => {
    const normalizeTime = (num) => num.length == 2 ? num : '0' + num  
    const getTime = (timeStamp) => {
        const date = new Date(Number(timeStamp))
        return `${normalizeTime(date.getHours().toString())}:${normalizeTime(date.getMinutes().toString())}`
    }

    if ((current.sender !== prev.sender) && (current.sender !== next.sender)) {
        return <fieldset className = {`${css.message} ${css.single} ${(current.sender == me) ? css.own : css.outer}`}>
                    <legend className = {css.messageSender} align = "center">{current.sender}</legend>
                    {current.text}
                    <div className = {css.date}>{getTime(current.date)}</div>
            </fieldset>
    }
    else if ((current.sender !== prev.sender) && (current.sender == next.sender)) {
        return <fieldset className = {`${css.message} ${css.first} ${(current.sender == me) ? css.own : css.outer}`}>
                    <legend className = {css.messageSender} align = "center">{current.sender}</legend>
                    {current.text}
                    <div className = {css.date}>{getTime(current.date)}</div>
            </fieldset>
    }
    else if ((current.sender == prev.sender) && (current.sender == next.sender)) {
        return <fieldset className = {`${css.message} ${css.middle} ${(current.sender == me) ? css.own : css.outer}`} >
                    {current.text}
                    <div className = {css.date}>{getTime(current.date)}</div>
            </fieldset>
    }
    else {
        return <fieldset className = {`${css.message} ${css.last} ${(current.sender == me) ? css.own : css.outer}`} >
                    {current.text}
                    <div className = {css.date}>{getTime(current.date)}</div>
        </fieldset>
    }
}



// const PresentationalMessage2 = (props) => {
//     const getTime = (timeStamp) => {
//         const date = new Date(Number(timeStamp))
//         return `${date.getHours()}:${date.getMinutes()}`
//     }

//     if (typeof prev == 'undefined'){
//         prev = {sender: undefined}
//     }
//     if (typeof next == 'undefined'){
//         next = {sender: undefined}
//     }

//     return <fieldset className = {`${}`}>

//     </fieldset>
// }







const ContainerMessage = (props) => {
        // if (props.current.order > props.lastReadMessage) {
        if (props.unread){
            return WithObservation(
                PresentationalMessage,
                (() => {props.setLastRead(props.current.order, props.current.messageId, props.dialogId)}),
                {unread: css.unread, read: css.read},
                2500
                )(props)
        }
        else return <PresentationalMessage {...props} />
}

const mapStateToProps = (state, ownProps) => {
    return {
        lastReadMessage: state.dialogs.lastReadMessages[ownProps.dialogId].order
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setLastRead: (order, messageId, dialogId) => {dispatch(setLastReadCreator(order, messageId, dialogId))}
    }
}

export const Message = connect(mapStateToProps, mapDispatchToProps)(ContainerMessage)

// export const ObservableMessage = connect(mapStateToProps, mapDispatchToProps)(WithObservation(PresentationalMessage, () => {PresentationalMessage.setLastRead(PresentationalMessage.order)}))