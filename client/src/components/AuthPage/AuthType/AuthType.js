import React, { useEffect, useState } from "react"
import css from './AuthType.module.css'
import commonCss from '../AuthPage.module.css'

const AuthType = (props) => {
    //Переключение между регистрацией и входом стрелками клавиатуры
    const [highlighted, setHighlighted] = useState(0)
    const handler = (event) => {
        switch (event.key){
            case 'ArrowUp':
                setHighlighted(prev => (prev !== 0) ? prev - 1 : prev)
                break
            case 'ArrowDown':
                setHighlighted((prev) => (prev !== (options.length - 1)) ? prev + 1 : prev)
                break
            case 'Enter':
                setHighlighted(prev => {
                    props.enter(options[prev])
                })
                window.removeEventListener('keydown', handler)
            }
    }
    
    useEffect(() => {window.addEventListener('keydown', handler)}, [])

    const options = ['Вход', 'Регистрация']
    
    return <div className = {`${commonCss.text} ${css.glitchText}`}>
        {options.map(option => <div 
            onClick={() => {props.enter(option); window.removeEventListener('keydown', handler)}}
            onMouseOver = {() => {setHighlighted(options.indexOf(option))}}
            className = {`${css.glitchText} ${commonCss.text} ${(options[highlighted] == option) ? css.active: ''}`}>{option}</div>)}
    </div>
}
export default AuthType