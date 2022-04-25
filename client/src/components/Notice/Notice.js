import React, { useEffect, useRef, useState } from "react"
import css from './Notice.module.css'

const Notice = (props) => {
    const [isTextShown, setTextStatus] = useState(false)
    let text = props.text
    let id
    const addSimbol = () => {
        if(text){
            textRef.current.textContent = textRef.current.textContent + text[0]
            text = text.substring(1)
        }
        else {
            clearInterval(id)
            setTimeout(() => {setTextStatus(true)}, 1000)
        }
    }
    useEffect(() => {
        id = setInterval(addSimbol, 10)
    }, [])
    const textRef = useRef()
    return <div id = {css.wrapper}>
        <div id = {css.title}>{props.title}</div> 
        <div ref = {textRef} id = {css. text}></div>
        {isTextShown && <div id = {css.buttonWrapper}>
                <div className = {css.button} onClick = {props.handleClick} >[{props.buttonLabel}]</div>
            </div>}
        </div>
}

export default Notice