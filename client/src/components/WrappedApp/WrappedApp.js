import React, { useEffect, useState } from "react"
import { connect } from "react-redux"
import { useRoutes } from "../../routes"
import { initializeAppThunkCreator } from "../../redux/authReducer"
import { Preloader } from "../Preloader/Preloader"
import css from './WrappedApp.module.css'
import Grain from "../Grain/Grain"
import Notice from "../Notice/Notice"
import { Routes, Route, useNavigate } from "react-router-dom"
import FullscreenMode from "../FullscreenMode/FullscreenMode"
import { connectThunkCreator } from "../../redux/dialogsReducer"


const WrappedApp = (props) => {
    const navigate = useNavigate()
    useEffect(() => {
        props.initialize()
        navigate('/fullscreen')
    }, [])
    const routes = useRoutes(props.isAuthenticated)
    // if (props.loading){
    //     return <Preloader/>
    // }
    // else {
    // const [isFullScreen, setFullscreenStatus] = useState(false)    
        return (
        <div>
            <Grain/>
            {routes}
            {/* {isFullScreen ? routes : <Notice
                title = 'ВНИМАНИЕ!'
                text = 'ОТОБРОЖЕНИЕ БУДЕТ ПЕРЕВЕДЕНО В ПОЛНОЭКРАННЫЙ РЕЖИМ. ДЛЯ ПРОДОЛЖЕНИЯ НАЖМИТЕ "ок"'
                buttonLabel = 'ок'
                handleClick = {() => { 
                    if (document.documentElement.requestFullscreen)document.documentElement.requestFullscreen(); 
                    setFullscreenStatus(true)}
                }
            />} */}
            
        </div>
        )
    //}
}

const mapStateToProps = (state) => {
    return{
        loading: state.auth.loading,
        isAuthenticated: state.auth.isAuthenticated
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        initialize: () => {dispatch(initializeAppThunkCreator())}
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WrappedApp)
