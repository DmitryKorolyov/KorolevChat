import React, { useEffect, useState, useRef } from "react"
import css from './ConsoleInput.module.css'

export const ConsoleInput = (props) => {
    //Костыль. Используется для активации виртуальной клавиатуры смартфона
    const inputEl = useRef(null)
    const hiddenInputHandler = (event) => {
        
        if (event.target.value.slice(-2) == '\\'){
            props.enter(event.target.value);
        }
        else {
            setChar(event.target.value)
        }
    }

    const [input, setChar] = useState("")

    const handler = (event) => {
        if (["ArrowLeft", "ArrowRight"].indexOf(event.key) > -1) {
            event.preventDefault()
          }

        if (event.key !== "Backspace" && event.key !== "Delete" && event.key.length == 1){
            setChar(entered => entered + event.key)

        }
        else if (event.key == "Backspace" || event.key == "Delete") {
            setChar(entered => entered.slice(0, -1))
            
        }
        else if (event.key == 'Enter') {
            setChar(entered => {
                props.enter(entered);
                return entered               
            })
            window.removeEventListener('keydown', handler)
        }
    }
    
    useEffect(() => {
        window.addEventListener('keydown', handler)
        inputEl.current.focus()
    }, [])

    return <div  className = {`${css.input} ${css.glitchText}`}>        
        <div >{props.title}</div>
        <div className ={css.inputText}>&rsaquo;:{props.isPassword ? input.replace(/./g, '*') : input}<div className = {css.carriage}>█</div></div>
        <input className = {css.hiddenInput} onBlur = {() => {inputEl.current.focus()}} ref = {inputEl} onChange = {hiddenInputHandler} type ='text'></input>
    </div>
}