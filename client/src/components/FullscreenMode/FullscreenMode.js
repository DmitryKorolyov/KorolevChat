import React from "react"
import Notice from "../Notice/Notice"
import { useNavigate } from "react-router-dom"

const FullscreenMode = (props) => {
    const navigate = useNavigate()
    return <Notice
        title = 'ВНИМАНИЕ!'
        text = 'ОТОБРОЖЕНИЕ БУДЕТ ПЕРЕВЕДЕНО В ПОЛНОЭКРАННЫЙ РЕЖИМ. ДЛЯ ПРОДОЛЖЕНИЯ НАЖМИТЕ "ок"'
        buttonLabel = 'ок'
        handleClick = {() => { 
            if (document.documentElement.requestFullscreen)document.documentElement.requestFullscreen(); 
            navigate(props.isAuthenticated ? '/dialogs' : '/auth')
        }
            
        }
/>
}

export default FullscreenMode